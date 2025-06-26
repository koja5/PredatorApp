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
const userType = require("./enums/user-type");

module.exports = router;

var connection = sql.connect();

connection.getConnection(function (err, conn) {});

// #region AUTH

router.post("/login", function (req, res, next) {
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
            "select * from all_areas where id = ?",
            [req.body.id_area],
            function (err, rows, fields) {
              if (err) {
                logger.log("error", err.sql + ". " + err.sqlMessage);
              } else {
                if (rows.length) {
                  req.body.id_admin = rows[0].id_admin;
                  conn.query(
                    "INSERT INTO users set ?",
                    [req.body],
                    function (err, rows, fields) {
                      conn.release();
                      if (err) {
                        logger.log("error", err.sql + ". " + err.sqlMessage);
                        res.json({
                          type: "exist-account",
                          value: 0,
                        });
                      } else {
                        makeRequest(
                          req.body,
                          "mail/sendLinkForVerifyEmail",
                          res
                        );
                      }
                    }
                  );
                } else {
                  res.json({ type: "exist-account", value: 0 });
                }
              }
            }
          );
        }
      }
    );
  });
});

router.get("/getAllAreas", function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    conn.query("select id, name from all_areas", function (err, rows, fields) {
      conn.release();
      console.log(err);
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(false);
      } else {
        res.json(rows);
      }
    });
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

    conn.query(
      "select u.*, u.email as 'email_user', a.allow_access_automatically from users u left join area_settings a on u.id_area = a.id_area where sha1(u.email) = ?",
      [req.params.email],
      function (err, currentValue, fields) {
        console.log(err);
        if (err) {
          res.json(false);
        } else {
          console.log(currentValue);
          let active = 0;
          if (
            currentValue.length &&
            currentValue[0].allow_access_automatically
          ) {
            active = 1;
          }
          conn.query(
            "update users set verify = 1, active = ? where sha1(email) = ?",
            [active, req.params.email],
            function (err, updatedValue, fields) {
              if (err) {
                res.json(false);
              } else {
                if (active) {
                  conn.release();
                  res.redirect(process.env.link_client + "auth/login");
                } else {
                  console.log(currentValue[0]);
                  conn.query(
                    "select u.* from users u where u.id_area = ? and u.type = ?",
                    [currentValue[0].id_area, userType.admin],
                    function (err, admins, fields) {
                      conn.release();
                      console.log(admins);
                      for (let i = 0; i < admins.length; i++) {
                        currentValue[0]["email"] = admins[i].email;
                        makeRequest(
                          currentValue[0],
                          "mail/sendInfoToAdminAboutApprovingAccount"
                        );
                      }
                      makeRequest(
                        currentValue[0],
                        "mail/sendInfoToUserAboutApprovingAccount"
                      );
                    }
                  );

                  res.redirect(
                    process.env.link_client + "page/need-to-approve"
                  );
                }
              }
            }
          );
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
        id_admin: data.id_admin,
        name: data.name,
        type: data.type,
        trusted: data.trusted,
        avatar: data.avatar,
        cover: data.cover,
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
