const mongoose = require('mongoose');

const eventLoggerSchema = mongoose.Schema({
  id: {
    type: String
  },
  eventSource: {
    type: String
  },
  eventCode: {
    type: String
  },
  statusCode: {
    type: Number
  },
  response: {
    type: String
  },
  userAgent: {
    type: String
  },
  error: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  'EventLogger',
  eventLoggerSchema,
  'EventLogger'
);
