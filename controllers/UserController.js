const { OK, BAD_REQUEST, UNAUTHORIZED } = require('http-status-codes');

const UserService = require('../services/UserService');

exports.GET_INFO = (request, response, next) => {
  const { authorization } = request.headers;

  UserService.getUserInfo(authorization, (clientError, error, userInfo) => {
    if (clientError || error) {
      response.locals.statusCode = clientError ? UNAUTHORIZED : BAD_REQUEST;
      response.locals.error = error;
      next();
    } else {
      response.status(OK).send(userInfo);
    }
  });
};

exports.PATCH_INFO = (request, response, next) => {
  const info = request.body;
  const { authorization } = request.headers;

  UserService.updateUserInfo(authorization, info, (error, updateResult) => {
    if (error) {
      response.locals.statusCode = BAD_REQUEST;
      response.locals.error = error;
      next();
    } else if (!updateResult || updateResult.n === 0) {
      response.locals.statusCode = UNAUTHORIZED;
      response.locals.clientError = {};
      next();
    } else {
      response.status(OK).send({});
    }
  });
};
