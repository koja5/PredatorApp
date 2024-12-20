require("dotenv").config();
const express = require("express");
const router = express.Router();
const logger = require("../../config/logger");
const auth = require("../../config/authentification/auth");
const sql = require("../../config/sql-database");
const uploadMiddleware = require("./uploadMiddleware");
const multipart = require("connect-multiparty");
const multipartMiddleware = multipart({
  uploadDir: process.env.FILE_STORAGE,
});
const fs = require("fs");
const util = require("util");

module.exports = router;

var connection = sql.connect();

connection.getConnection(function (err, conn) {});

router.post("/setPredator", multipartMiddleware, auth, function (req, res) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    console.log(req.files);

    req.body.id_user = req.user.user.id;

    conn.query(
      "select * from predators where id = ?",
      [req.body.id],
      function (err, rows) {
        if (!err) {
          let galleryPath = "";
          if (rows.length) {
            if (rows[0].gallery) {
              if (
                rows[0].gallery.length > req.body.gallery.length &&
                req.files &&
                !Object.keys(req.files).length
              ) {
                galleryPath = req.body.gallery;
                const differentFiles = checkDifferent(
                  rows[0].gallery,
                  galleryPath
                );
                deleteFiles(differentFiles);
              } else if (rows[0].gallery.length === req.body.gallery.length) {
                galleryPath = req.body.gallery;
              } else {
                galleryPath = rows[0].gallery
                  .concat(";")
                  .concat(
                    req.files && req.files.gallery
                      ? packDocumentsPath(req.files.gallery)
                      : req.body.gallery
                  );
              }
            } else {
              galleryPath =
                req.files && req.files.gallery
                  ? packDocumentsPath(req.files.gallery)
                  : req.body.gallery;
            }
            // deleteFiles(differentFiles);
          } else {
            galleryPath =
              req.files && req.files.gallery
                ? packDocumentsPath(req.files.gallery)
                : req.body.gallery;
          }
          req.body.gallery = galleryPath;

          conn.query(
            "INSERT INTO predators set ? ON DUPLICATE KEY UPDATE ?",
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
        } else {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(false);
        }
      }
    );
  });
});

router.post("/deleteObservationSheetFile", auth, function (req, res) {
  connection.getConnection(function (err, conn) {
    if (err) {
      logger.log("error", err.sql + ". " + err.sqlMessage);
      res.json(err);
    }

    if (req.body.date_time) {
      req.body.date_time = new Date(req.body.date_time);
    }

    req.body.id_owner = req.user.user.id;

    delete req.body.undefined;

    conn.query(
      "select * from observation_sheet where id = ?",
      [req.body.id],
      function (err, rows) {
        if (!err) {
          let documentPath = "";
          if (rows.length) {
            if (rows[0].documentation) {
              if (
                rows[0].documentation.length > req.body.documentation.length
              ) {
                documentPath = req.body.documentation;
                const differentFiles = checkDifferent(
                  rows[0].documentation,
                  documentPath
                );
                deleteFiles(differentFiles);
                req.body.documentation = documentPath;

                conn.query(
                  "update observation_sheet set documentation = ? where id = ?",
                  [req.body.documentation, req.body.id],
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
              }
            }
          }
        } else {
          logger.log("error", err.sql + ". " + err.sqlMessage);
          res.json(false);
        }
      }
    );
  });
});

function deleteFiles(files) {
  for (let i = 0; i < files.length; i++) {
    const fullPath = process.env.FILE_STORAGE + "/" + files[i];
    fs.unlinkSync(fullPath);
  }
}

function checkDifferent(currentPath, newPatch) {
  const currentFileNames = currentPath.split(";");
  const newFileNames = newPatch.split(";");
  for (let i = 0; i < currentFileNames.length; i++) {
    for (let j = 0; j < newFileNames.length; j++) {
      if (currentFileNames[i] == newFileNames[j]) {
        currentFileNames.splice(i, 1);
        i--;
        break;
      }
    }
  }

  return currentFileNames;
}

function packDocumentsPath(documentation) {
  let docs = documentation;
  let documents = "";
  if (docs.length) {
    for (let i = 0; i < docs.length; i++) {
      documents += getFileName(docs[i].path);
      if (i < docs.length - 1) {
        documents += ";";
      }
    }
  } else {
    documents += getFileName(docs.path);
  }

  return documents;
}

function getFileName(path) {
  return path.split("\\file-storage").length
    ? path.split("file-storage\\")[1]
    : null;
}
