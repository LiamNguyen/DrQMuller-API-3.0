process.env.NODE_ENV = 'test';

const { describe, it } = require('mocha');
const chai = require('chai');

const BookingHelper = require('../../lib/BookingHelper');

chai.should();

describe('[BookingHelper.js]', () => {
  describe('checkAvailability(machineSchedules, schedule)', () => {
    const machineSchedules = [
      { date: '2017-07-07', time: '17:00' },
      { date: '2017-07-07', time: '18:00' }
    ];
    // eslint-disable-next-line max-len
    it('Check time availability before create appointment should work as expected', done => {
      BookingHelper.checkAvailability(
        machineSchedules,
        machineSchedules[0]
      ).should.be.eql(false);
      BookingHelper.checkAvailability(machineSchedules, {
        date: '2017-07-08',
        time: '17:00'
      }).should.be.eql(true);
      BookingHelper.checkAvailability(machineSchedules, {
        date: '2017-07-07',
        time: '16:00'
      }).should.be.eql(true);
      done();
    });
  });
});
