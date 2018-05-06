const uuidv1 = require('uuid/v1');

const Appointment = require('../database/models/appointment');

module.exports.create = (userId, machineId, schedule, callback) => {
  const id = uuidv1();

  Appointment.create(
    {
      id,
      userId,
      machineId,
      schedule
    },
    error => callback(error, id)
  );
};

module.exports.getByUserId = (userId, callback) => {
  Appointment.find({ userId }, callback).sort({
    'schedule.date': 1,
    'schedule.time': 1
  });
};

module.exports.cancelAppointment = (id, userId, callback) => {
  Appointment.update({ id, userId }, { $set: { isCancelled: true } }, callback);
};

module.exports.getById = (id, callback) => {
  Appointment.findOne({ id }, callback);
};

module.exports.getNewlyCreatedAppointments = callback => {
  Appointment.find({ isConfirmed: false, isCancelled: false }, callback).sort({
    createdAt: 1
  });
};

module.exports.confirmAppointment = (id, confirmedBy, callback) => {
  Appointment.update(
    { id },
    { $set: { isConfirmed: true, confirmedBy } },
    callback
  );
};
