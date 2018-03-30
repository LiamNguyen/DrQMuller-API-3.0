const { OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const EventLoggerRepository = require('../repositories/EventLoggerRepository');
const { info, error, exception } = require('../constants/LogTypeConstants');

function getLogType(statusCode) {
  switch (statusCode) {
    case OK:
      return info;
    case INTERNAL_SERVER_ERROR:
      return exception;
    default:
      return error;
  }
}

module.exports = app => {
  app.use((req, res, next) => {
    const { end } = res;

    res.end = (chunk, encoding) => {
      const chunks = [];
      let responseBody;
      if (chunk) {
        chunks.push(chunk);
      }
      try {
        responseBody = Buffer.concat(chunks).toString('utf8');
      } catch (e) {
        responseBody = '';
      }
      EventLoggerRepository.create(
        getLogType(res.statusCode),
        req,
        responseBody,
        res.statusCode
      );
      res.header('Access-Control-Allow-Headers', '*');
      res.header('Access-Control-Allow-Origin', '*');
      res.end = end;
      res.end(chunk, encoding);
    };
    next();
  });
};
