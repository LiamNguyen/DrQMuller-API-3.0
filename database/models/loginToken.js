const mongoose = require('mongoose');

const loginTokenSchema = mongoose.Schema({
  id: {
    type: String
  },
  userId: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  'LoginToken',
  loginTokenSchema,
  'LoginToken'
);
