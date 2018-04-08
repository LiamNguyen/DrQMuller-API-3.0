const {
  OK,
  CREATED,
  BAD_REQUEST,
  UNAUTHORIZED
} = require('http-status-codes');

const AuthService = require('../services/AuthService');

exports.POST_CREATE = (request, response, next) => {
  const { username, password } = request.body;

  AuthService.createUser(username, password, (clientError, error, loginToken) => {
    if (clientError || error) {
      response.locals.statusCode = BAD_REQUEST;
      response.locals.clientError = clientError;
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
    (clientError, error, loginToken) => {
      if (clientError || error) {
        response.locals.statusCode = BAD_REQUEST;
        response.locals.clientError = clientError;
        response.locals.error = error;
        next();
      } else {
        response.status(OK).json({ loginToken });
      }
    }
  );
};

exports.POST_SIGNOUT = (request, response, next) => {
  const { authorization } = request.headers;

  AuthService.signout(authorization, (error, removal) => {
    if (error || !authorization) {
      response.locals.statusCode = BAD_REQUEST;
      response.locals.error = error;
      next();
    } else if (removal.result.n === 0) {
      response.locals.statusCode = UNAUTHORIZED;
      response.locals.clientError = {};
      next();
    } else {
      response.status(OK).send();
    }
  });
};

exports.POST_RESET_PASSWORD_REQUEST = (request, response, next) => {
  const { email } = request.body;

  AuthService.resetPasswordRequest(email, (clientError, error) => {
    if (clientError || error) {
      response.locals.statusCode = BAD_REQUEST;
      response.locals.clientError = clientError;
      response.locals.error = error;
      next();
    } else {
      response.status(OK).send();
    }
  });
};
