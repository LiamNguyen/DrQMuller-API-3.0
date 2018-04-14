const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  gender: {
    type: String
  },
  phone: {
    type: String
  },
  email: {
    type: String
  },
  address: {
    type: String
  },
  dob: {
    type: String
  },
  status: {
    type: String
  },
  isFilledForConfirmation: {
    type: Boolean,
    default: false
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
userSchema.pre('update', function () {
  this.update({}, { $set: { updatedAt: new Date() } });
});

module.exports = mongoose.model(
  'User',
  userSchema,
  'User'
);
