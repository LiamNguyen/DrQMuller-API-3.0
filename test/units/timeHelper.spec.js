process.env.NODE_ENV = 'test';

const { describe, it } = require('mocha');
const chai = require('chai');

const TimeHelper = require('../../lib/TimeHelper');

chai.should();

describe('[TimeHelper.js]', () => {
  describe('addMinutes(time, minute)', () => {
    it('Add minutes helper should work as expected', done => {
      TimeHelper.addMinutes('16:00', 15).should.eql('16:15');
      TimeHelper.addMinutes('16:45', 15).should.eql('17:00');
      TimeHelper.addMinutes('16:57', 15).should.eql('17:12');
      TimeHelper.addMinutes('23:57', 15).should.eql('00:12');
      done();
    });
  });
});
