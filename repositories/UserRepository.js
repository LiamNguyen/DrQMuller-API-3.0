const User = require('../database/models/user');

module.exports.createNewUser = (
  username,
  password,
  callback
) => {
  User.create({
    username,
    password
  }, callback);
};
