const uuidv1 = require('uuid/v1');

const Token = require('../database/models/token');

module.exports.create = (userIdList, type, validUntil, callback) => {
  const id = uuidv1();

  Token.create({
    id,
    userIdList,
    type,
    validUntil
  }, callback);
};

module.exports.getTokenByUserId = (userId, callback) => {
  Token.findOne({ userId }, callback);
};

module.exports.markTokenAsUsed = (token, callback) => {
  Token.update({ id: token }, { $set: { usedAt: Date.now() } }, callback);
};
