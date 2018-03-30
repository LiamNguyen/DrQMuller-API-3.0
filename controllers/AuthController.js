const { CREATED, BAD_REQUEST } = require('http-status-codes');

const ApiError = require('../constants/ApiError');

const UserService = require('../services/UserService');

exports.POST = (request, response, next) => {
  const { username, password } = request.body;

  UserService.createUser(username, password, error => {
    if (error) {
      response.locals.statusCode = BAD_REQUEST;
      response.locals.clientError = ApiError.create_user_failed;
      response.locals.error = error;
      next();
    } else {
      response.status(CREATED).send();
    }
  });
};
