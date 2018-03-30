const EventLogger = require('../database/models/eventLogger');

module.exports.create = (
  logType,
  request,
  response,
  statusCode
) => {
  EventLogger.create({
    eventSource: request.originalUrl,
    eventCode: logType,
    statusCode,
    response,
    userAgent: request.get('User-Agent')
  });
};
