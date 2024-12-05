const request = require("request");
const logger = require("../../config/logger");

module.exports = makeRequest;

function prepareOptionsForRequest(body, api) {
  return {
    url: process.env.link_api + api,
    method: "POST",
    body: body,
    json: true,
    rejectUnauthorized: false,
  };
}

function makeRequest(body, api, res) {
  var options = prepareOptionsForRequest(body, api);

  logger.log("info", JSON.stringify(options));

  request(options, function (error, response, body) {
    if (!error) {
      res.json(true);
    } else {
      res.json(false);
    }
  });
}
