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
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// eslint-disable-next-line func-names
tokenSchema.pre('update', function() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

module.exports = mongoose.model('Token', tokenSchema, 'Token');
