const _ = require('lodash');
const ValidationHelper = require('../ValidationHelper');

exports.validate = (username, password) =>
  !_.isEmpty(username) &&
  !_.isEmpty(password) &&
  ValidationHelper.isValidUsername(username) &&
  ValidationHelper.isStrong(password);
