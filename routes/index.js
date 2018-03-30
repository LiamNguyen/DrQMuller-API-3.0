const EventLoggerRepository = require('../repositories/EventLoggerRepository');
const LogTypeConstants = require('../constants/LogTypeConstants');
const Auth = require('./Auth');

module.exports = app => {
  app.use(Auth);

  // Error handler
  app.use((request, response) => {
    const { statusCode, clientError, error } = response.locals;
    EventLoggerRepository.create(
      LogTypeConstants.error,
      request,
      error,
      statusCode
    );
    response
      .status(statusCode)
      .send(clientError);
  });
};
