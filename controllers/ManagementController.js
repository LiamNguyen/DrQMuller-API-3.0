const { OK, BAD_REQUEST, UNAUTHORIZED } = require('http-status-codes');

const ManagementService = require('../services/ManagementService');

exports.GET_NEWLY_CREATED_APPOINTMENT = (request, response, next) => {
  const { authorization } = request.headers;

  ManagementService.getNewlyCreatedAppointments(
    authorization,
    (clientError, error, appointments) => {
      if (clientError || error) {
        response.locals.statusCode = clientError ? UNAUTHORIZED : BAD_REQUEST;
        response.locals.clientError = clientError;
        response.locals.error = error;
        next();
      } else {
        response.status(OK).send(appointments);
      }
    }
  );
};
