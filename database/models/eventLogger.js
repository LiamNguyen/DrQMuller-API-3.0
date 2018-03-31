const mongoose = require('mongoose');

const eventLoggerSchema = mongoose.Schema({
  id: {
    type: String
  },
  eventSource: {
    type: String,
    required: true
  },
  eventCode: {
    type: String,
    required: true
  },
  statusCode: {
    type: Number,
    required: true
  },
  response: {
    type: String
  },
  userAgent: {
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
