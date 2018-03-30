const mongoose = require('mongoose');
const GUID = require('mongoose-guid');

const userSchema = mongoose.Schema({
  id: {
    type: GUID.type,
    default: GUID.value
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

module.exports = mongoose.model(
  'User',
  userSchema,
  'User'
);
