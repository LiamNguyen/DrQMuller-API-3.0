const _ = require('lodash');

const MachineRepository = require('../repositories/MachineRepository');
const BookingConstants = require('../constants/BookingConstants');
const TimeHelper = require('../lib/TimeHelper');
const ErrorHelper = require('../lib/ErrorHelper');
const LoginTokenRepository = require('../repositories/LoginTokenRepository');
const ApiError = require('../constants/ApiError');
const UUIDValidator = require('../lib/validators/UUIDValidator');
const DateValidator = require('../lib/validators/DateValidator');
const NewAppointmentValidator = require('../lib/validators/NewAppointmentValidator');
const AppointmentRepository = require('../repositories/AppointmentRepository');
const BookingHelper = require('../lib/BookingHelper');

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

  MachineRepository.getById(machineId, (error, machine) => {
    if (error) {
      return callback(getError(error, 'Get machine by Id failed'));
    }
    if (_.isEmpty(machine)) {
      return callback(getError(null, 'Machine not found'));
    }
    while (
      // When the first element is not yet added,
      // move forward by return true for while condition
      !result[result.length - 1] ||
      isTimeAfter(endTime, result[result.length - 1])
    ) {
      const { schedules } = machine;
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

function processAppointmentsToReturn(appointments, machines) {
  // Include machine name in each appointment model
  const appointmentsWithMachineNames = appointments.map(appointment => {
    const { machineId } = appointment;
    const { name: machineName } = machines.find(
      machine => machine.id === machineId
    );

    // eslint-disable-next-line no-underscore-dangle
    return { ...appointment._doc, machineName };
  });

  // Sort appointments
  const validAppointments = [];
  const cancelledAppointments = [];
  const expiredAppointments = [];
  appointmentsWithMachineNames.forEach(appointment => {
    if (BookingHelper.isAppointmentValid(appointment)) {
      validAppointments.push(appointment);
    } else if (appointment.isCancelled) {
      cancelledAppointments.push(appointment);
    } else {
      expiredAppointments.push(appointment);
    }
  });

  return _.concat(
    validAppointments,
    cancelledAppointments,
    expiredAppointments
  );
}

exports.getAvailableTimes = (token, machineId, date, callback) => {
  // Validate input
  if (!UUIDValidator.validate(token)) {
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

exports.createAppointment = (token, machineId, schedule, callback) => {
  // Validate input
  if (!NewAppointmentValidator.validate(token, machineId, schedule)) {
    return callback(null, getError(null, 'New appointment validation failed'));
  }
  LoginTokenRepository.getUserIdByToken(token, (error, userId) => {
    if (error) {
      return callback(null, getError(error, 'Get userId by token failed'));
    }
    if (!userId) {
      return callback(ApiError.unauthorized);
    }
    MachineRepository.getById(machineId, (getMachineByIdError, machine) => {
      if (getMachineByIdError) {
        return callback(
          null,
          getError(getMachineByIdError, 'Get machine by Id failed')
        );
      }
      if (_.isEmpty(machine)) {
        return callback(null, getError(null, 'Machine not found'));
      }
      if (!BookingHelper.checkAvailability(machine.schedules, schedule)) {
        return callback(ApiError.date_time_not_available);
      }
      AppointmentRepository.create(
        userId,
        machineId,
        schedule,
        createAppointmentError => {
          if (createAppointmentError) {
            return callback(
              null,
              getError(createAppointmentError, 'Create appointment failed')
            );
          }
          MachineRepository.addSchedule(
            machineId,
            schedule,
            (addScheduleError, result) => {
              if (addScheduleError || result.n === 0) {
                return callback(
                  null,
                  getError(addScheduleError, 'Add schedule failed')
                );
              }
              // TODO: Release booking in temporary collection
              // TODO: Send email to customer service
              // TODO: Push notification via Socket.io to management portal
              callback(null, null);
            }
          );
        }
      );
    });
  });
};

exports.getAppointmentsByLoginToken = (token, callback) => {
  // Validate input
  if (!UUIDValidator.validate(token)) {
    return callback(null, getError(null, 'LoginToken validation failed'));
  }
  LoginTokenRepository.getUserIdByToken(token, (error, userId) => {
    if (error) {
      return callback(null, getError(error, 'Get userId by token failed'));
    }
    if (!userId) {
      return callback(ApiError.unauthorized);
    }
    AppointmentRepository.getByUserId(
      userId,
      (getAppointmentByUserIdError, appointments) => {
        if (getAppointmentByUserIdError) {
          return callback(
            null,
            getError(
              getAppointmentByUserIdError,
              'Get appointment by UserId failed'
            )
          );
        }
        MachineRepository.getAllMachines((getMachinesError, machines) => {
          if (getMachinesError) {
            return callback(
              null,
              getError(getMachinesError, 'Get all machines failed')
            );
          }
          const processedAppointments = processAppointmentsToReturn(
            appointments,
            machines
          );
          callback(null, null, processedAppointments);
        });
      }
    );
  });
};

exports.getAllMachines = (token, callback) => {
  // Validate input
  if (!UUIDValidator.validate(token)) {
    return callback(null, getError(null, 'LoginToken validation failed'));
  }
  LoginTokenRepository.getUserIdByToken(token, (error, userId) => {
    if (error) {
      return callback(null, getError(error, 'Get userId by token failed'));
    }
    if (!userId) {
      return callback(ApiError.unauthorized);
    }
    MachineRepository.getAllMachines((getMachinesError, machines) => {
      if (getMachinesError) {
        return callback(
          null,
          getError(getMachinesError, 'Get all machines failed')
        );
      }
      callback(null, null, machines);
    });
  });
};

exports.cancelAppointment = (token, appointmentId, callback) => {
  // Validate input
  if (!UUIDValidator.validate(token)) {
    return callback(null, getError(null, 'Token validation failed'));
  }
  if (!UUIDValidator.validate(appointmentId)) {
    return callback(null, getError(null, 'AppointmentId validation failed'));
  }
  LoginTokenRepository.getUserIdByToken(token, (error, userId) => {
    if (error) {
      return callback(null, getError(error, 'Get userId by token failed'));
    }
    if (!userId) {
      return callback(ApiError.unauthorized);
    }
    AppointmentRepository.cancelAppointment(
      appointmentId,
      userId,
      (cancelAppointmentError, result) => {
        if (cancelAppointmentError || result.n === 0) {
          return callback(
            null,
            getError(cancelAppointmentError, 'Cancel appointment failed')
          );
        }
        AppointmentRepository.getById(
          appointmentId,
          (getAppointmentError, appointment) => {
            if (getAppointmentError) {
              return callback(
                null,
                getError(getAppointmentError, 'Get appointment failed')
              );
            }
            const { machineId, schedule } = appointment;
            MachineRepository.removeSchedule(
              machineId,
              schedule,
              (removeScheduleError, result) => {
                if (removeScheduleError || result.n === 0) {
                  return callback(
                    null,
                    getError(removeScheduleError, 'Remove schedule failed')
                  );
                }
                callback(null, null);
              }
            );
          }
        );
      }
    );
  });
};
