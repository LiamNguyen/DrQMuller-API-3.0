const uuidv1 = require('uuid/v1');

const LoginToken = require('../database/models/loginToken');

module.exports.create = (userId, callback) => {
  const id = uuidv1();
  LoginToken.create({ id, userId }, callback);
};

module.exports.getUserIdByToken = (token, callback) => {
  LoginToken.findOne({ token }, callback);
};

module.exports.delete = (token, callback) => {
  LoginToken.remove({ id: token }, callback);
};
