const _ = require('lodash');
const ValidationHelper = require('../ValidationHelper');

exports.validate = (token, password) =>
  !_.isEmpty(token) &&
  ValidationHelper.isValidUUID(token) &&
  !_.isEmpty(password) &&
  ValidationHelper.isStrong(password);
