const mongoose = require('mongoose');

const mailLoggerSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  type: {
    type: String,
    require: true
  },
  recipient: {
    type: String,
    require: true
  },
  content: {
    type: String,
    require: true
  },
  mailSenderResponse: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model(
  'MailLogger',
  mailLoggerSchema,
  'MailLogger'
);
