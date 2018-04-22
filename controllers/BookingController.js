const { OK, BAD_REQUEST, UNAUTHORIZED, CREATED } = require('http-status-codes');

const BookingService = require('../services/BookingService');

exports.GET_AVAILABLE_TIME = (request, response, next) => {
  const {
    query: { machineId, date },
    headers: { authorization }
  } = request;

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

exports.CREATE_APPOINTMENT = (request, response, next) => {
  const {
    body: { machineId, schedule },
    headers: { authorization }
  } = request;

  BookingService.createAppointment(
    authorization,
    machineId,
    schedule,
    (clientError, error) => {
      if (clientError || error) {
        response.locals.statusCode = clientError ? UNAUTHORIZED : BAD_REQUEST;
        response.locals.clientError = clientError;
        response.locals.error = error;
        next();
      } else {
        response.status(CREATED).send();
      }
    }
  );
};

exports.GET_APPOINTMENTS_BY_LOGIN_TOKEN = (request, response, next) => {
  const {
    headers: { authorization }
  } = request;

  BookingService.getAppointmentsByLoginToken(
    authorization,
    (clientError, error, appointments) => {
      if (clientError || error) {
        response.locals.statusCode = clientError ? UNAUTHORIZED : BAD_REQUEST;
        response.locals.clientError = clientError;
        response.locals.error = error;
        next();
      } else {
        response.status(OK).json(appointments);
      }
    }
  );
};
