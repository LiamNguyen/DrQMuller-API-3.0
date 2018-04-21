const _ = require('lodash');
const ValidationHelper = require('../ValidationHelper');

exports.validate = email =>
  !_.isEmpty(email) && ValidationHelper.isValidEmail(email);
