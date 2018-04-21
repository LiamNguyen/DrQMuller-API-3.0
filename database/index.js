const mongoose = require('mongoose');

const config = require('../config/environmentConfig');
const EventLoggerRepository = require('../repositories/EventLoggerRepository');
const LogTypeConstants = require('../constants/LogTypeConstants');

exports.connect = () => {
  const { connectionString } = config.get(process.env.NODE_ENV);

  mongoose.Promise = global.Promise;
  mongoose.connect(
    connectionString,
    { useMongoClient: true, promiseLibrary: global.Promise },
    error => {
      if (error) {
        console.log(error);
        EventLoggerRepository.createLocalError(
          LogTypeConstants.localError,
          error
        );
      }
    }
  );
  mongoose.connection.once('open', () => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Connected to mongodb');
    }
  });
};
