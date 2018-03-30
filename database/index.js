const mongoose = require('mongoose');
const config = require('../config/environmentConfig');

exports.connect = () => {
  const { connectionString } = config.get(process.env.NODE_ENV);

  mongoose.connect(
    connectionString,
    { useMongoClient: true, promiseLibrary: global.Promise },
    error => {
      if (error) {
        console.log(error);
      }
    }
  );
  const db = mongoose.connection;
  db.once('open', () => {
    console.log('Connected to mongodb');
  });
};
