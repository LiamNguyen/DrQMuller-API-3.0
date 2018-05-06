const mongoose = require('mongoose');

const appointmentSchema = mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  machineId: {
    type: String,
    required: true
  },
  schedule: {
    type: Object,
    required: true
  },
  isConfirmed: {
    type: Boolean,
    default: false
  },
  isCancelled: {
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
appointmentSchema.pre('update', function() {
  this.update({}, { $set: { updatedAt: new Date() } });
});

module.exports = mongoose.model(
  'Appointment',
  appointmentSchema,
  'Appointment'
);
