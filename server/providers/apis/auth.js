require("dotenv").config();
const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const expiresToken = "24h";
const logger = require("../config/logger");
const request = require("request");
const fs = require("fs");
const sha1 = require("sha1");
const jwt = require("jsonwebtoken");
const auth = require("../config/authentification/auth");
const sql = require("../config/sql-database");
const makeRequest = require("./help-function/makeRequest");

module.exports = router;

var connection = sql.connect();

connection.getConnection(function (err, conn) {});

// #region AUTH

router.post("/login", function (req, res, next) {
  console.log(req.body);
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      return res.json(err);
    }

    conn.query(
      "select * from users WHERE email = ? AND password = ?",
      [req.body.email, sha1(req.body.password)],
      function (err, rows, fields) {
        conn.release();
        if (err) {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(err);
        }

        if (rows.length > 0) {
          if (rows[0].active) {
            const token = generateToken(rows[0]);
            logger.log(
              "info",
              `USER: ${
                req.body.email
              } is LOGIN at ${new Date().toDateString()}.`
            );
            return res.json({
              token: token,
            });
          } else {
            return res.json({
              type: "active",
              value: 0,
            });
          }
        } else {
          return res.json({
            type: "exist",
            value: 0,
          });
        }
      }
    );
  });
});

router.post("/signUp", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    conn.query(
      "select * from users where email = ?",
      [req.body.email],
      function (err, rows, fields) {
        if (rows.length) {
          conn.release();
          res.json({
            type: "exist-account",
            value: 0,
          });
        } else {
          req.body.password = sha1(req.body.password);
          delete req.body.rePassword;
          conn.query(
            "INSERT INTO users set ?",
            [req.body],
            function (err, rows, fields) {
              conn.release();
              if (err) {
                res.json({
                  type: "exist-account",
                  value: 0,
                });
              } else {
                makeRequest(req.body, "mail/sendLinkForVerifyEmail", res);
              }
            }
          );
        }
      }
    );
  });
});

router.post("/forgotPassword", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    conn.query(
      "select * from users where email = ?",
      [req.body.email],
      function (err, rows, fields) {
        conn.release();
        if (rows.length) {
          makeRequest(req.body, "mail/resetPasswordLink", res);
        } else {
          // mail not exists
          res.json(false);
        }
      }
    );
  });
});

router.get("/verifyEmail/:email", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    console.log(req.params);

    conn.query(
      "update users set verify = 1, active = 1 where sha1(email)",
      [req.params.email],
      function (err, rows, fields) {
        conn.release();
        console.log(err);
        if (err) {
          res.json(false);
        } else {
          res.redirect(process.env.link_client + "auth/login");
        }
      }
    );
  });
});

router.get("/checkIsNeedToActive/:email", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    console.log();

    conn.query(
      "select * from users where email = ? and active = 0",
      [req.params.email],
      function (err, rows, fields) {
        conn.release();
        console.log(err);
        if (err) {
          res.json(false);
        } else {
          if (rows.length) {
            res.json(true);
          } else {
            res.json(false);
          }
        }
      }
    );
  });
});

router.get("/checkIfMailExists/:email", async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from users where sha1(email) = ?",
          [req.params.email],
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              if (rows.length) {
                res.json(true);
              } else {
                res.json(false);
              }
            }
          }
        );
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.post("/resetPassword", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    console.log(req.body);

    conn.query(
      "update users set password = ? where sha1(lower(email)) = ?",
      [sha1(req.body.password), req.body.email],
      function (err, rows, fields) {
        conn.release();
        if (err) {
          res.json(true);
        }

        res.json(true);
      }
    );
  });
});

//#endregion

//#region HELP FUNCTION

function generateToken(data) {
  return jwt.sign(
    {
      user: {
        id: data.id,
        name: data.name,
        type: data.type,
      },
      email: data.email,
    },
    process.env.TOKEN_KEY,
    {
      expiresIn: expiresToken,
    }
  );
}

//#endregion
