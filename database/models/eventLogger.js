const mongoose = require('mongoose');
const GUID = require('mongoose-guid');

const eventLoggerSchema = mongoose.Schema({
  id: {
    type: GUID.type,
    default: GUID.value
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
