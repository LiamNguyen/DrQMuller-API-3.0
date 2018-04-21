const uuidv1 = require('uuid/v1');

const Machine = require('../database/models/machine');

module.exports.create = (name, callback) => {
  const id = uuidv1();

  Machine.create(
    {
      id,
      name
    },
    callback
  );
};

module.exports.getById = (id, callback) => {
  Machine.findOne({ id }, callback);
};

module.exports.addSchedule = (id, schedule, callback) => {
  Machine.findOne({ id }, (error, machine) => {
    if (error) {
      return callback(error);
    }
    const { schedules } = machine;
    schedules.push(schedule);
    Machine.update({ id }, { $set: { schedules } }, callback);
  });
};

// Integration test purpose only
module.exports.overwriteSchedules = (id, schedules, callback) => {
  Machine.findOne({ id }, error => {
    if (error) {
      return callback(error);
    }
    Machine.update({ id }, { $set: { schedules } }, callback);
  });
};
