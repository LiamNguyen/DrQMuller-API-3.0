const _ = require('lodash');
const moment = require('moment');

const AuthService = require('../services/AuthService');
const BookingService = require('../services/BookingService');
const UserRepository = require('../repositories/UserRepository');
const MachineRepository = require('../repositories/MachineRepository');
const BookingConstants = require('../constants/BookingConstants');
const TimeHelper = require('../lib/TimeHelper');

const {
  morningShiftStartTime,
  morningShiftEndTime,
  afternoonShiftStartTime,
  afternoonShiftEndTime,
  period
} = BookingConstants;
const { isTimeAfter, addMinutes } = TimeHelper;

function signin(username, password, callback) {
  AuthService.createUser(username, password, () => {
    AuthService.signin(username, password, callback);
  });
}

function createUser(username, password, info, callback) {
  AuthService.createUser(username, password, (clientError, error, token) => {
    UserRepository.updateUserInfo(token, info, () => {
      UserRepository.getUserByUsername(username, callback);
    });
  });
}

function createMachineWithSchedule(name, schedules, callback) {
  MachineRepository.create(name, (error, machine) => {
    MachineRepository.overwriteSchedules(machine.id, schedules, () => {
      callback(machine.id);
    });
  });
}

function mockAvailableTime(omitList) {
  let morningTime = morningShiftStartTime;
  let afternoonTime = afternoonShiftStartTime;
  const morningAvailableTime = [];
  const afternoonAvailableTime = [];

  while (
    !morningAvailableTime[morningAvailableTime.length - 1] ||
    isTimeAfter(
      morningShiftEndTime,
      morningAvailableTime[morningAvailableTime.length - 1]
    )
  ) {
    if (!_.includes(omitList, morningTime)) {
      morningAvailableTime.push(morningTime);
    }
    morningTime = addMinutes(morningTime, period);
  }

  while (
    !afternoonAvailableTime[afternoonAvailableTime.length - 1] ||
    isTimeAfter(
      afternoonShiftEndTime,
      afternoonAvailableTime[afternoonAvailableTime.length - 1]
    )
  ) {
    if (!_.includes(omitList, afternoonTime)) {
      afternoonAvailableTime.push(afternoonTime);
    }
    afternoonTime = addMinutes(afternoonTime, period);
  }

  return _.concat(morningAvailableTime, afternoonAvailableTime);
}

function createAppointmentForUser(callback) {
  const today = moment().format('YYYY-MM-DD');
  const bookingTime = '12:50';
  const schedule = { date: today, time: bookingTime };

  createMachineWithSchedule(
    'Machine 1',
    [{ date: today, time: '17:50' }],
    machineId => {
      signin(
        'username1',
        'password1',
        (clientError, signinError, loginToken) => {
          BookingService.createAppointment(
            loginToken,
            machineId,
            schedule,
            () => {
              callback(loginToken, machineId, schedule);
            }
          );
        }
      );
    }
  );
}

module.exports = {
  signin,
  createUser,
  createMachineWithSchedule,
  mockAvailableTime,
  createAppointmentForUser
};
