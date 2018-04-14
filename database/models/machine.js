const mongoose = require('mongoose');

const machineSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  schedules: {
    type: Array
  },
  createdBy: {
    type: String
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
machineSchema.pre('update', function () {
  this.update({}, { $set: { updatedAt: new Date() } });
});

module.exports = mongoose.model(
  'Machine',
  machineSchema,
  'Machine'
);
