const uuidv1 = require('uuid/v1');

const User = require('../database/models/user');
const LoginTokenRepository = require('./LoginTokenRepository');

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

module.exports.updateUserInfo = (token, info, callback) => {
  LoginTokenRepository.getUserIdByToken(token, (error, userId) => {
    if (error) {
      return callback(error);
    }
    User.update({ id: userId }, { $set: info }, (updateError, result) => {
      if (updateError) {
        return callback(updateError);
      }
      callback(null, result);
    });
  });
};
