const moment = require('moment');

const UserRepository = require('../repositories/UserRepository');
const MachineRepository = require('../repositories/MachineRepository');
const AppointmentRepository = require('../repositories/AppointmentRepository');
const UUIDValidator = require('../lib/validators/UUIDValidator');
const ErrorHelper = require('../lib/ErrorHelper');
const ApiError = require('../constants/ApiError');
const UserRoleConstants = require('../constants/UserRoleConstants');

const { getError } = ErrorHelper;

function processAppointmentsToReturn(appointments, machines) {
  return appointments
    .filter(appointment => {
      const {
        schedule: { date, time }
      } = appointment;

      return moment(`${date} ${time}`).isAfter(moment());
    })
    .map(appointment => {
      const { machineId } = appointment;
      const { name: machineName } = machines.find(
        machine => machine.id === machineId
      );

      // eslint-disable-next-line no-underscore-dangle
      return { ...appointment._doc, machineName };
    });
}

exports.getNewlyCreatedAppointments = (loginToken, callback) => {
  if (!UUIDValidator.validate(loginToken)) {
    return callback(null, getError(null, 'Token validation failed'));
  }
  UserRepository.getUserByLoginToken(loginToken, (error, user) => {
    if (error) {
      return callback(null, getError(error, 'Get userId by token failed'));
    }
    if (!user || ![UserRoleConstants.customerService].includes(user.role)) {
      return callback(ApiError.unauthorized);
    }
    AppointmentRepository.getNewlyCreatedAppointments(
      (getAppointmentsError, appointments) => {
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
