const bcrypt = require('bcrypt');

const ApiError = require('../constants/ApiError');
const UserRepository = require('../repositories/UserRepository');
const LoginTokenRepository = require('../repositories/LoginTokenRepository');
const CredentialsValidator = require('../lib/validators/CredentialsValidator');
const ErrorHelper = require('../lib/ErrorHelper');
const TokenValidator = require('../lib/validators/TokenValidator');

const { getError } = ErrorHelper;

function encryptPassword(password, callback) {
  bcrypt.genSalt(10, (genSaltError, salt) => {
    if (genSaltError) {
      return callback(genSaltError);
    }

    bcrypt.hash(password, salt, (hashError, hash) =>
      callback(hashError, hash));
  });
}

function comparePassword(password, hash, callback) {
  bcrypt.compare(password, hash, (error, match) => (
    error == null
      ? callback(null, match)
      : callback(error)
  ));
}

function usernameExist(username, callback) {
  UserRepository.getUserByUsername(username, (getUserError, user) => {
    if (getUserError) {
      return callback(getError(
        getUserError,
        'Failed when query user from database'
      ));
    }
    return callback(null, user !== null);
  });
}

exports.createUser = (username, password, callback) => {
  // Validate input
  if (!CredentialsValidator.validateCredentials(username, password)) {
    return callback(null, getError(null, 'Credentials validation failed'));
  }

  // Check if username exist
  usernameExist(username, (checkExistError, exist) => {
    if (checkExistError) {
      return callback(null, checkExistError);
    }
    if (exist) {
      return callback(ApiError.username_exist);
    }
    encryptPassword(password, (encryptPasswordError, hash) => {
      if (encryptPasswordError) {
        return callback(null, getError(encryptPasswordError, 'Password hash error'));
      }
      UserRepository.createNewUser(username, hash, (createUserError, user) => {
        if (createUserError) {
          return callback(null, getError(createUserError, 'Create new user error'));
        }
        LoginTokenRepository.create(
          user.id,
          (createLoginTokenError, tokenDto) => {
            if (createLoginTokenError) {
              return callback(null, getError(
                createLoginTokenError,
                'Create login token error'
              ));
            }
            callback(null, null, tokenDto.id);
          }
        );
      });
    });
  });
};

exports.signin = (username, password, callback) => {
  // Validate input
  if (!CredentialsValidator.validateCredentials(username, password)) {
    return callback(ApiError.invalid_username_or_password);
  }
  UserRepository.getUserByUsername(username, (getUserError, user) => {
    if (getUserError) {
      return callback(null, getError(
        getUserError,
        'Failed when query user from database'
      ));
    }
    if (user) {
      comparePassword(password, user.password, (error, match) => {
        if (error) {
          return callback(null, getError(error, 'Compare password failed'));
        }
        if (match) {
          LoginTokenRepository.create(user.id, (createLoginTokenError, tokenDto) => {
            if (createLoginTokenError) {
              return callback(null, getError(
                createLoginTokenError,
                'Create login token error'
              ));
            }
            callback(null, null, tokenDto.id);
          });
        } else {
          callback(ApiError.invalid_username_or_password);
        }
      });
    } else {
      callback(ApiError.invalid_username_or_password);
    }
  });
};

exports.signout = (token, callback) => {
  if (!TokenValidator.validate(token)) {
    return callback(getError(null, 'Token validation failed'));
  }
  LoginTokenRepository.delete(token, callback);
};
