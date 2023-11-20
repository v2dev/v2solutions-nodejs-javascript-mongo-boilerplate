"use-strict";

const bunyan = require("bunyan");
const moment = require("moment");

const env = process.env.NODE_ENV || "development";

function Ec_Service_call(req) {
  return {
    v2_function: req.functionName || "V2BackEnd",
    ex_api_url: req.API_URL || "",
    ex_api_payload: req.requestObj || "",
    ex_api_response: req.response || "",
    log_time: moment().format("MMMM Do YYYY  h:mm:ss a"),
  };
}

const logger = bunyan.createLogger({
  name: "NodeJS boilerplate accelerator",
  application: "log",
  app_env: env,
  serializers: {
    Ex_serviceErr_call: Ec_Service_call,
  },
  streams: [
    {
      stream: process.stdout,
      level: "debug",
    },
    {
      stream: process.stdout,
      level: "error",
    },
    {
      stream: process.stdout,
      level: "info",
    },
  ],
});

module.exports = logger;
