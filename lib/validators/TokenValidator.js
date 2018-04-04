const _ = require('lodash');
const ValidationHelper = require('../ValidationHelper');

exports.validate = token =>
  !_.isEmpty(token) &&
  ValidationHelper.isValidUUID(token);
