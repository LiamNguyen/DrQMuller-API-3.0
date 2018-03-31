const uuidv1 = require('uuid/v1');

const User = require('../database/models/user');

module.exports.createNewUser = (
  username,
  password,
  callback
) => {
  const id = uuidv1();

  User.create({
    id,
    username,
    password
  }, callback);
};

module.exports.getUserByUsername = (username, callback) => {
  User.findOne({ username }, callback);
};
