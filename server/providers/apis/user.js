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
const multipart = require("connect-multiparty");
const AVATAR_UPLOAD_FOLDER = multipart({
  uploadDir: process.env.AVATAR_UPLOAD_FOLDER,
});
const COVER_UPLOAD_FOLDER = multipart({
  uploadDir: process.env.COVER_UPLOAD_FOLDER,
});

module.exports = router;

var connection = sql.connect();

connection.getConnection(function (err, conn) {});

//#region

router.get("/getAllPredators", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query("select * from all_predators", function (err, rows, fields) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.get("/getAllTypeOfWaters", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query("select * from all_waters", function (err, rows, fields) {
          conn.release();
          if (err) {
            logger.log("error", err.sql + ". " + err.sqlMessage);
            res.json(err);
          } else {
            res.json(rows);
          }
        });
      }
    });
  } catch (ex) {
    logger.log("error", err.sql + ". " + err.sqlMessage);
    res.json(ex);
  }
});

router.get("/getAllTerritories", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select afd.* from all_fish_districts afd left join users u on afd.id_area = u.id_area where u.id = ? and (afd.hidden = 0 or afd.hidden is null)",
          [req.user.user.id, 1],
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              res.json(rows);
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

router.get("/getAllActivities", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from all_activities",
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              res.json(rows);
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

router.get("/getAllPredatorNotes", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from predators where id_user = ? order by id desc",
          [req.user.user.id],
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              res.json(rows);
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

router.get("/getPredatorById/:id", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select p.*, ap.name 'name_of_predator', atow.name as 'name_of_type_of_water', at.name as 'name_of_territory', aa.name as 'name_of_activity' from predators p left join all_predators ap on p.id_predator = ap.id left join all_waters atow on p.id_water = atow.id left join all_fish_districts at on p.id_fish_district = at.id left join all_activities aa on p.id_activity = aa.id where p.id_user = ? and p.id = ?",
          [req.user.user.id, req.params.id],
          function (err, rows, fields) {
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              if (rows.length) {
                conn.release();
                res.json(rows[0]);
              } else {
                conn.query(
                  "select p.* from predators p where p.id_user = ? and p.id = ?",
                  [req.user.user.id, req.params.id],
                  function (err, rows, fields) {
                    conn.release();
                    if (err) {
                      logger.log("error", err.sql + ". " + err.sqlMessage);
                      res.json(err);
                    } else {
                      if (rows.length) {
                        res.json(rows[0]);
                      } else {
                        res.json(false);
                      }
                    }
                  }
                );
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

router.get("/getPredatorForEditById/:id", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from predators where id_user = ? and id = ?",
          [req.user.user.id, req.params.id],
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              res.json(rows.length ? rows[0] : {});
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

router.post("/deletePredator", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "delete from predators where id = ? and id_user = ?",
          [req.body.id, req.user.user.id],
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              res.json(true);
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

router.post("/completedReport", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "update predators set completed = 1, completed_date = ?, visible = ? where id = ? and id_user = ?",
          [new Date(), req.user.user.trusted, req.body.id, req.user.user.id],
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              res.json(true);
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

//#endregion

//#region PROFILE

router.get("/getMe", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from users where id = ?",
          [req.user.user.id],
          function (err, rows, fields) {
            conn.release();
            if (err) {
              logger.log("error", err.sql + ". " + err.sqlMessage);
              res.json(err);
            } else {
              res.json(rows.length ? rows[0] : {});
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

router.post("/setMe", auth, function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    conn.query(
      "INSERT INTO users set ? ON DUPLICATE KEY UPDATE ?",
      [req.body, req.body],
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(true);
        } else {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(false);
        }
      }
    );
  });
});

router.post("/setMyAvatar", AVATAR_UPLOAD_FOLDER, auth, (req, res) => {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    req.body.avatar = req.files.uploads[0].path.split("\\profile\\")[1];

    conn.query(
      "select * from users where id = ?",
      [req.user.user.id],
      function (err, rows) {
        if (!err) {
          if (rows.length && rows[0].avatar) {
            rows[0].avatar =
              process.env.AVATAR_UPLOAD_FOLDER + "/" + rows[0].avatar;
            fs.rmSync(rows[0].avatar, { force: true });
          }

          conn.query(
            "UPDATE users SET avatar = ? where id = ?",
            [req.body.avatar, req.user.user.id],
            function (err, rowInsert) {
              conn.release();
              if (!err) {
                rows[0].avatar = req.body.avatar;

                const token = generateToken(rows[0]);

                res.json(token);
              } else {
                logger.log("error", err.sql + ". " + err.sqlMessage);
                res.json(false);
              }
            }
          );
        } else {
          conn.release();
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(false);
        }
      }
    );
  });
});

router.post("/setMyCover", COVER_UPLOAD_FOLDER, auth, (req, res) => {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    console.log();
    req.body.cover = req.files.uploads[0].path.split("\\cover\\")[1];

    conn.query(
      "select * from users where id = ?",
      [req.user.user.id],
      function (err, rows) {
        if (!err) {
          if (rows.length && rows[0].cover) {
            rows[0].cover =
              process.env.COVER_UPLOAD_FOLDER + "/" + rows[0].cover;
            fs.rmSync(rows[0].cover, { force: true });
          }

          conn.query(
            "UPDATE users SET cover = ? where id = ?",
            [req.body.cover, req.user.user.id],
            function (err, rowInsert) {
              conn.release();
              if (!err) {
                rows[0].cover = req.body.cover;

                const token = generateToken(rows[0]);

                res.json(token);
              } else {
                logger.log("error", err.sql + ". " + err.sqlMessage);
                res.json(false);
              }
            }
          );
        } else {
          conn.release();
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(false);
        }
      }
    );
  });
});

//#endregion

//#region CHANGE PASSWORD

router.get("/checkOldPassword/:password", auth, async (req, res, next) => {
  try {
    connection.getConnection(function (err, conn) {
      if (err) {
        logger.log("error", err.sql + ". " + err.sqlMessage);
        res.json(err);
      } else {
        conn.query(
          "select * from users where id = ? and password = sha1(" +
            req.params.password +
            ")",
          [req.user.user.id],
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

router.post("/setMyPassword", auth, function (req, res, next) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    conn.query(
      "update users set password = sha1(" +
        req.body.new_password +
        ") where id = ?",
      [req.user.user.id],
      function (err, rows) {
        conn.release();
        if (!err) {
          res.json(true);
        } else {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(false);
        }
      }
    );
  });
});

//#endregion

//#region HELP FUNCTION

function setIdAndAdminId(body, user) {
  console.log(body.id, user.user);

  body.id = user.user.id;

  body.id_admin = user.user.id_admin;
  return body;
}

function generateToken(data) {
  return jwt.sign(
    {
      user: {
        id: data.id,
        id_admin: data.id_admin,
        firstname: data.firstname,
        lastname: data.lastname,
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
