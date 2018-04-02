const uuidv1 = require('uuid/v1');

const EventLogger = require('../database/models/eventLogger');

module.exports.create = (
  logType,
  request,
  response,
  statusCode
) => {
  const id = uuidv1();

  EventLogger.create({
    id,
    eventSource: request.originalUrl,
    eventCode: logType,
    statusCode,
    response,
    userAgent: request.get('User-Agent')
  });
};

module.exports.createLocalError = (logType, error) => {
  const id = uuidv1();

  EventLogger.create({ id, error, eventCode: logType });
};
