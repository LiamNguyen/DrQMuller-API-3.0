const { BAD_REQUEST } = require('http-status-codes');

const EventLoggerRepository = require('../repositories/EventLoggerRepository');
const LogTypeConstants = require('../constants/LogTypeConstants');
const Auth = require('./Auth');
const Docs = require('./Docs');
const User = require('./User');
const Booking = require('./Booking');
const ApiError = require('../constants/ApiError');

module.exports = app => {
  app.use(Auth);
  app.use(Docs);
  app.use(User);
  app.use(Booking);

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

    if (request.url === '/') {
      response.redirect('/docs');
    } else {
      response
        .status(statusCode || BAD_REQUEST)
        .send(clientError || ApiError.server_error);
    }
  });
};
