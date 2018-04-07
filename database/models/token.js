const mongoose = require('mongoose');

const tokenSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  userIdList: {
    type: Array,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  validUntil: {
    type: Date,
    require: true
  },
  usedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  'Token',
  tokenSchema,
  'Token'
);
