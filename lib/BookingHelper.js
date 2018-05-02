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
  }
};
