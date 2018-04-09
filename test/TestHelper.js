const AuthService = require('../services/AuthService');
const UserRepository = require('../repositories/UserRepository');

module.exports = {
  signin: (username, password, callback) => {
    AuthService.createUser(username, password, () => {
      AuthService.signin(username, password, callback);
    });
  },
  createUser: (username, password, info, callback) => {
    AuthService.createUser(username, password, (clientError, error, token) => {
      UserRepository.updateUserInfo(token, info, () => {
        UserRepository.getUserByUsername(username, callback);
      });
    });
  }
};
