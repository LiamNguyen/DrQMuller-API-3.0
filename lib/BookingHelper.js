const moment = require('moment');

module.exports = {
  checkAvailability(machineSchedules, bookingSchedule) {
    let result = true;

    machineSchedules.forEach(schedule => {
      if (
        schedule.date === bookingSchedule.date &&
        schedule.time === bookingSchedule.time
      ) {
        result = false;
      }
    });
    return result;
  },
  isAppointmentValid(appointment) {
    const {
      schedule: { date, time },
      isCancelled
    } = appointment;

    return moment(`${date} ${time}`).isAfter(moment()) && !isCancelled;
  }
};
