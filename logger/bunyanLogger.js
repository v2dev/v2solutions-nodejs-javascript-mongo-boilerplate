'use-strict';

const bunyan = require('bunyan');
const moment = require('moment');

const env = process.env.NODE_ENV || 'development';

const loglevels = {
  ERROR: 'error',
  WARN: 'warn',
  INFO: 'info',
  VERBOSE: 'verbose',
  DEBUG: 'debug',
  SILLY: 'silly',
};

function Ec_Service_call(req) {
  return {
    v2_function: req.functionName || 'V2BackEnd',
    ex_api_url: req.API_URL || '',
    ex_api_payload: req.requestObj || '',
    ex_api_response: req.response || '',
    log_time: moment().format('MMMM Do YYYY  h:mm:ss a'),
  };
}

const logger = bunyan.createLogger({
  name: 'Backend',
  application: 'log',
  app_env: env,
  serializers: {
    Ex_serviceErr_call: Ec_Service_call,
  },
  streams: [
    {
      stream: process.stdout,
      level: loglevels.DEBUG,
    },
    {
      stream: process.stdout,
      level: loglevels.WARN,
    },
    {
      stream: process.stdout,
      level: loglevels.ERROR,
    },
    {
      stream: process.stdout,
      level: loglevels.INFO,
    },
  ],
});

module.exports = logger;
