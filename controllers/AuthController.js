const {
  OK,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED
} = require('http-status-codes');

const ApiError = require('../constants/ApiError');

const AuthService = require('../services/AuthService');

exports.POST_CREATE = (request, response, next) => {
  const { username, password } = request.body;

  AuthService.createUser(username, password, (clientError, error, loginToken) => {
    if (clientError || error) {
      response.locals.statusCode = BAD_REQUEST;
      response.locals.clientError = clientError || ApiError.server_error;
      response.locals.error = error;
      next();
    } else {
      response.status(CREATED).json({ loginToken });
    }
  });
};

exports.POST_SIGNIN = (request, response, next) => {
  const { username, password } = request.body;

  AuthService.signin(
    username,
    password,
    (clientError, error, authorizationToken) => {
      if (clientError || error) {
        response.locals.statusCode = BAD_REQUEST;
        response.locals.clientError = clientError || ApiError.server_error;
        response.locals.error = error;
        next();
      } else {
        response.status(OK).json({ authorizationToken });
      }
    }
  );
};

exports.POST_SIGNOUT = (request, response, next) => {
  const { authorization } = request.headers;

  AuthService.signout(authorization, (error, removal) => {
    if (error || !authorization) {
      response.locals.statusCode = BAD_REQUEST;
      response.locals.clientError = ApiError.server_error;
      response.locals.error = error;
      next();
    } else if (removal.result.n === 0) {
      response.locals.statusCode = UNAUTHORIZED;
      response.locals.clientError = '';
      next();
    } else {
      response.status(OK).send();
    }
  });
};
