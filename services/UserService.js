const _ = require('lodash');

const UUIDValidator = require('../lib/validators/UUIDValidator');
const UserInfoValidator = require('../lib/validators/UserInfoValidator');
const ErrorHelper = require('../lib/ErrorHelper');
const UserRepository = require('../repositories/UserRepository');
const ApiError = require('../constants/ApiError');

const { getError } = ErrorHelper;

exports.getUserInfo = (token, callback) => {
  if (!UUIDValidator.validate(token)) {
    return callback(null, getError(null, 'Token validation failed'));
  }
  UserRepository.getUserByLoginToken(token, (error, user) => {
    if (error) {
      return callback(null, getError(error, 'Get user by login token failed'));
    }
    if (!user) {
      return callback(ApiError.unauthorized);
    }
    callback(null, null, _.pick(user, ['username', 'role']));
  });
};

exports.updateUserInfo = (token, requestInfo, callback) => {
  if (!UUIDValidator.validate(token)) {
    return callback(getError(null, 'Token validation failed'));
  }
  // Avoid unwanted value being inserted into database
  const info = _.pick(requestInfo, [
    'name',
    'address',
    'dob',
    'gender',
    'email',
    'phone'
  ]);
  if (!UserInfoValidator.validate(info)) {
    return callback(getError(null, 'User info validation failed'));
  }
  UserRepository.updateUserInfo(token, info, (error, updateResult) => {
    if (error) {
      return callback(getError(error, 'Update user info failed'));
    }
    callback(null, updateResult);
  });
};
