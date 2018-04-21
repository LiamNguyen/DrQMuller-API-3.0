const _ = require('lodash');
const ValidationHelper = require('../ValidationHelper');

exports.validate = (token, machineId, schedule) =>
  !_.isEmpty(token) &&
  !_.isEmpty(machineId) &&
  !_.isEmpty(schedule) &&
  !_.isEmpty(schedule.date) &&
  !_.isEmpty(schedule.time) &&
  ValidationHelper.isValidUUID(token) &&
  ValidationHelper.isValidUUID(machineId) &&
  ValidationHelper.isValidDate(schedule.date) &&
  ValidationHelper.isValidTime(schedule.time);
