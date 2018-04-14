module.exports = {
  addMinutes: (time, minute) => {
    // Time follows format: hh:mm
    const hourPart = parseInt(time.split(':')[0]);
    const minutePart = parseInt(time.split(':')[1]);
    const addedMinute = minutePart + minute;

    return addedMinute < 60
      ? `${hourPart}:${addedMinute}`
      : `${hourPart + 1 < 24 ? hourPart + 1 : '00'}:${
        addedMinute - 60 < 10
          ? `0${addedMinute - 60}`
          : addedMinute - 60
      }`;
  }
};
