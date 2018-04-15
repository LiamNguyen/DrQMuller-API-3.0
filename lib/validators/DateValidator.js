const _ = require('lodash');
const ValidationHelper = require('../ValidationHelper');

exports.validate = date =>
  !_.isEmpty(date) &&
  ValidationHelper.isValidDate(date);
