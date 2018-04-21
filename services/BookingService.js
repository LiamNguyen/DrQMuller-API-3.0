const _ = require('lodash');

const MachineRepository = require('../repositories/MachineRepository');
const BookingConstants = require('../constants/BookingConstants');
const TimeHelper = require('../lib/TimeHelper');
const ErrorHelper = require('../lib/ErrorHelper');
const LoginTokenRepository = require('../repositories/LoginTokenRepository');
const ApiError = require('../constants/ApiError');
const TokenValidator = require('../lib/validators/TokenValidator');
const DateValidator = require('../lib/validators/DateValidator');

const {
  morningShiftStartTime,
  morningShiftEndTime,
  afternoonShiftStartTime,
  afternoonShiftEndTime,
  period
} = BookingConstants;
const { isTimeAfter, addMinutes } = TimeHelper;
const { getError } = ErrorHelper;

function getAvailableList(machineId, date, startTime, endTime, callback) {
  const result = [];
  let time = startTime;

  // eslint-disable-next-line no-loop-func
  MachineRepository.getById(machineId, (error, machines) => {
    if (error) {
      return callback(getError(error, 'Get machine by Id failed'));
    }
    if (_.isEmpty(machines)) {
      return callback(getError(null, 'Machine not found'));
    }
    while (
      // When the first element is not yet added,
      // move forward by return true for while condition
      !result[result.length - 1] ||
      isTimeAfter(endTime, result[result.length - 1])
    ) {
      const { schedules } = machines;
      const bookedTime = schedules
        .filter(schedule => schedule.date === date)
        .map(schedule => schedule.time);

      if (!_.includes(bookedTime, time)) {
        result.push(time);
      }
      time = addMinutes(time, period);
    }

    return callback(null, result);
  });
}

exports.getAvailableTimes = (token, machineId, date, callback) => {
  // Validate input
  if (!TokenValidator.validate(token)) {
    return callback(null, getError(null, 'Token validation failed'));
  }
  if (!DateValidator.validate(date)) {
    return callback(null, getError(null, 'Date validation failed'));
  }
  LoginTokenRepository.getUserIdByToken(token, (error, userId) => {
    if (error) {
      return callback(null, getError(error, 'Get userId by token failed'));
    }
    if (!userId) {
      return callback(ApiError.unauthorized);
    }
    getAvailableList(
      machineId,
      date,
      morningShiftStartTime,
      morningShiftEndTime,
      (getMorningError, morningShiftAvailableTime) => {
        if (getMorningError) {
          return callback(null, getMorningError);
        }
        getAvailableList(
          machineId,
          date,
          afternoonShiftStartTime,
          afternoonShiftEndTime,
          (getAfternoonError, afternoonShiftAvailableTime) => {
            if (getAfternoonError) {
              return callback(null, getAfternoonError);
            }
            callback(
              null,
              null,
              _.concat(morningShiftAvailableTime, afternoonShiftAvailableTime)
            );
          }
        );
      }
    );
  });
};
