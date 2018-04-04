const AuthService = require('../services/AuthService');

module.exports = {
  signin: (username, password, callback) => {
    AuthService.createUser(username, password, () => {
      AuthService.signin(username, password, callback);
    });
  }
};
