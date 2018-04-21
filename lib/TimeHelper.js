const moment = require('moment');

module.exports = {
  addMinutes: (time, minute) => {
    if (!time || !minute) return '';

    // Time follows format: hh:mm
    const hourPart = parseInt(time.split(':')[0]);
    const minutePart = parseInt(time.split(':')[1]);
    const addedMinute = minutePart + minute;

    return addedMinute < 60
      ? `${hourPart < 10 ? `0${hourPart}` : hourPart}:${addedMinute}`
      : `${
          hourPart + 1 < 24
            ? `${hourPart + 1 < 10 ? `0${hourPart + 1}` : hourPart + 1}`
            : '00'
        }:${addedMinute - 60 < 10 ? `0${addedMinute - 60}` : addedMinute - 60}`;
  },
  isTimeAfter: (compareTime, time) =>
    // Only interested in time so date can be anything which is the same
    // This case we take 1970-01-01
    !!compareTime &&
    !!time &&
    moment(`1970-01-01 ${compareTime}`, 'YYYY-MM-DD h:mm').isAfter(
      moment(`1970-01-01 ${time}`, 'YYYY-MM-DD h:mm')
    )
};
