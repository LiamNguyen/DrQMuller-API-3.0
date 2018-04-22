const UUIDValidator = require('../lib/validators/UUIDValidator');
const UserInfoValidator = require('../lib/validators/UserInfoValidator');
const ErrorHelper = require('../lib/ErrorHelper');
const UserRepository = require('../repositories/UserRepository');

const { getError } = ErrorHelper;

exports.updateUserInfo = (token, info, callback) => {
  if (!UUIDValidator.validate(token)) {
    return callback(getError(null, 'Token validation failed'));
  }
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
