const bcrypt = require('bcrypt');

const UserRepository = require('../repositories/UserRepository');
const CredentialsValidator = require('../lib/validators/CredentialsValidator');

function encryptPassword(password, callback) {
  bcrypt.genSalt(10, (genSaltError, salt) => {
    if (genSaltError) {
      return callback(genSaltError);
    }

    bcrypt.hash(password, salt, (hashError, hash) =>
      callback(hashError, hash));
  });
}

exports.createUser = (username, password, callback) => {
  if (!CredentialsValidator.validate(username, password)) {
    callback(new Error('Credentials validation failed'));
    return;
  }
  encryptPassword(password, (error, hash) => {
    if (error) {
      callback(new Error('Password hash error'));
    }
    UserRepository.createNewUser(username, hash, callback);
  });
};
