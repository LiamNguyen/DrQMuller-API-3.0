const { BAD_REQUEST } = require('http-status-codes');

const EventLoggerRepository = require('../repositories/EventLoggerRepository');
const LogTypeConstants = require('../constants/LogTypeConstants');
const Auth = require('./Auth');
const Docs = require('./Docs');

module.exports = app => {
  app.use(Auth);
  app.use(Docs);

  // Error handler
  app.use((request, response) => {
    const { statusCode, clientError, error } = response.locals;

    if (error) {
      EventLoggerRepository.create(
        LogTypeConstants.error,
        request,
        error,
        statusCode
      );
    }
    response
      .status(statusCode || BAD_REQUEST)
      .send(clientError);
  });
};
