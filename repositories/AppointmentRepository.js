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
    callback
  );
};

module.exports.getByUserId = (userId, callback) => {
  Appointment.find({ userId }, callback).sort({
    'schedule.date': 1,
    'schedule.time': 1
  });
};
