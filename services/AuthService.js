const bcrypt = require('bcrypt');
const moment = require('moment');
const _ = require('lodash');

const ApiError = require('../constants/ApiError');
const UserRepository = require('../repositories/UserRepository');
const LoginTokenRepository = require('../repositories/LoginTokenRepository');
const TokenRepository = require('../repositories/TokenRepository');
const CredentialsValidator = require('../lib/validators/CredentialsValidator');
const ErrorHelper = require('../lib/ErrorHelper');
const UUIDValidator = require('../lib/validators/UUIDValidator');
const TokenType = require('../constants/TokenTypeConstants');
const MailGun = require('../lib/MailGun');
const RoutePathConstants = require('../constants/RoutePathConstants');
const EmailValidator = require('../lib/validators/EmailValidator');
const TokenPasswordValidator = require('../lib/validators/TokenPasswordValidator');

const { getError } = ErrorHelper;
const { getEmailTemplatePath } = RoutePathConstants;

function encryptPassword(password, callback) {
  bcrypt.genSalt(10, (genSaltError, salt) => {
    if (genSaltError) {
      return callback(genSaltError);
    }

    bcrypt.hash(password, salt, (hashError, hash) => callback(hashError, hash));
  });
}

function comparePassword(password, hash, callback) {
  bcrypt.compare(
    password,
    hash,
    (error, match) => (error == null ? callback(null, match) : callback(error))
  );
}

function usernameExist(username, callback) {
  UserRepository.getUserByUsername(username, (getUserError, user) => {
    if (getUserError) {
      return callback(
        getError(getUserError, 'Failed when query user from database')
      );
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
        return callback(
          null,
          getError(encryptPasswordError, 'Password hash error')
        );
      }
      UserRepository.createNewUser(username, hash, (createUserError, user) => {
        if (createUserError) {
          return callback(
            null,
            getError(createUserError, 'Create new user error')
          );
        }
        LoginTokenRepository.create(
          user.id,
          (createLoginTokenError, tokenDto) => {
            if (createLoginTokenError) {
              return callback(
                null,
                getError(createLoginTokenError, 'Create login token error')
              );
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
      return callback(
        null,
        getError(getUserError, 'Failed when query user from database')
      );
    }
    if (user) {
      comparePassword(password, user.password, (error, match) => {
        if (error) {
          return callback(null, getError(error, 'Compare password failed'));
        }
        if (match) {
          LoginTokenRepository.create(
            user.id,
            (createLoginTokenError, tokenDto) => {
              if (createLoginTokenError) {
                return callback(
                  null,
                  getError(createLoginTokenError, 'Create login token error')
                );
              }
              callback(null, null, tokenDto.id);
            }
          );
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
  if (!UUIDValidator.validate(token)) {
    return callback(getError(null, 'Token validation failed'));
  }
  LoginTokenRepository.delete(token, callback);
};

exports.resetPasswordRequest = (email, callback) => {
  // Validate input
  if (!EmailValidator.validate(email)) {
    return callback(getError(null, 'Email validation failed'));
  }
  UserRepository.getUserByEmail(email, (error, userList) => {
    if (error) {
      return callback(getError(error, 'Get user by email failed'));
    }
    const userIdList = userList.map(user => user.id);

    // Return success message even if email cannot be found
    // Security reason, avoiding automatic scanning tool from penetrating the API
    if (_.isEmpty(userIdList)) return callback(null);

    TokenRepository.create(
      userIdList,
      TokenType.resetPassword,
      moment()
        .add(5, 'h')
        .format(),
      (createTokenError, tokenDto) => {
        if (createTokenError) {
          return callback(
            getError(
              createTokenError,
              `Create reset password token failed for user: ${userIdList}`
            )
          );
        }
        MailGun.send(
          email,
          'Forgotten password',
          `${getEmailTemplatePath()}/ResetPasswordTemplate.ejs`,
          { resetPasswordLink: tokenDto.id },
          sendMailError => {
            if (sendMailError) {
              return callback(
                getError(
                  sendMailError,
                  `Send reset password email failed for address: ${email}`
                )
              );
            }
            callback(null);
          }
        );
      }
    );
  });
};

exports.resetPasswordConfirm = (token, password, callback) => {
  // Validate input
  if (!TokenPasswordValidator.validate(token, password)) {
    return callback(
      null,
      getError(null, 'Token or password validation failed')
    );
  }
  TokenRepository.getTokenValidity(token, (getTokenValidityError, valid) => {
    if (getTokenValidityError) {
      return callback(
        null,
        getError(getTokenValidityError, 'Get token validity failed')
      );
    }
    if (!valid) {
      return callback(ApiError.token_expired);
    }
    TokenRepository.getUserIdListByToken(token, (error, userIdList) => {
      if (error) {
        return callback(null, getError(error, 'Get user Id list failed'));
      }
      encryptPassword(password, (encryptPasswordError, hash) => {
        if (encryptPasswordError) {
          return callback(
            null,
            getError(encryptPasswordError, 'Password hash error')
          );
        }
        UserRepository.updatePasswordForUsers(
          userIdList,
          hash,
          (updatePwdError, updateResult) => {
            if (updatePwdError) {
              return callback(
                null,
                getError(updatePwdError, 'Reset password failed')
              );
            }
            if (!updateResult || updateResult.n === 0) {
              return callback(
                null,
                getError(null, `Reset password failed for token ${token}`)
              );
            }
            TokenRepository.markTokenAsUsed(
              token,
              (markedTokenAsUsedError, result) => {
                if (markedTokenAsUsedError) {
                  return callback(
                    null,
                    getError(
                      markedTokenAsUsedError,
                      'Mark token as used failed'
                    )
                  );
                }
                if (!result || result.n === 0) {
                  return callback(
                    null,
                    getError(null, `Mark token as used failed for ${token}`)
                  );
                }
                callback(null, null);
              }
            );
          }
        );
      });
    });
  });
};
