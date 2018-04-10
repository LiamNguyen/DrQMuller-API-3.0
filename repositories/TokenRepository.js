const uuidv1 = require('uuid/v1');
const moment = require('moment');

const Token = require('../database/models/token');
const { getError } = require('../lib/ErrorHelper');

module.exports.create = (userIdList, type, validUntil, callback) => {
  const id = uuidv1();

  Token.create({
    id,
    userIdList,
    type,
    validUntil
  }, callback);
};

module.exports.getUserIdListByToken = (token, callback) => {
  Token.findOne({ id: token }, (error, tokenDto) => {
    if (error) {
      return callback(error);
    }
    if (!tokenDto) {
      return callback(getError(null, `Token: ${token} cannot be found`));
    }
    callback(null, tokenDto.userIdList);
  });
};

module.exports.markTokenAsUsed = (token, callback) => {
  Token.update({ id: token }, { $set: { usedAt: Date.now() } }, callback);
};

module.exports.getTokenValidity = (token, callback) => {
  Token.findOne({ id: token }, (error, tokenDto) => {
    if (error) {
      return callback(error);
    }
    if (!tokenDto) {
      return callback(getError(null, `Token: ${token} cannot be found`));
    }
    callback(null, moment(tokenDto.validUntil).isAfter(moment()));
  });
};
