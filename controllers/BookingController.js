const { OK, BAD_REQUEST, UNAUTHORIZED } = require('http-status-codes');

const BookingService = require('../services/BookingService');

exports.GET_AVAILABLE_TIME = (request, response, next) => {
  const {
    query: { machineId, date },
    headers
  } = request;
  const { authorization } = headers;

  BookingService.getAvailableTimes(
    authorization,
    machineId,
    date,
    (clientError, error, availableTime) => {
      if (clientError || error) {
        response.locals.statusCode = clientError ? UNAUTHORIZED : BAD_REQUEST;
        response.locals.clientError = clientError;
        response.locals.error = error;
        next();
      } else {
        response.status(OK).json(availableTime);
      }
    }
  );
};
