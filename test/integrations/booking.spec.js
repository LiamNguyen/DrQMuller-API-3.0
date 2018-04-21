process.env.NODE_ENV = 'test';

const { describe, it, beforeEach } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const moment = require('moment');
const _ = require('lodash');

const { server } = require('../../server');
const TestHelper = require('../TestHelper');
const MachineRepository = require('../../repositories/MachineRepository');

chai.use(chaiHttp);
const should = chai.should();

describe('[Controller] Booking', () => {
  beforeEach(done => {
    mongoose.connection.db.dropDatabase(() => done());
  });

  describe('GET /availableTime', () => {
    const username = 'username1';
    const password = 'password1';
    const today = moment().format('YYYY-MM-DD');

    it('User should be able to get available time', done => {
      MachineRepository.create('Machine 1', (error, machine) => {
        TestHelper.signin(
          username,
          password,
          (clientError, signinError, loginToken) => {
            chai
              .request(server)
              .get(`/availableTime?machineId=${machine.id}&date=${today}`)
              .set('authorization', loginToken)
              .send()
              .end((getTimeError, response) => {
                response.should.have.status(200);
                should.equal(
                  _.isEqual(response.body, TestHelper.mockAvailableTime([])),
                  true
                );
                done();
              });
          }
        );
      });
    });

    it('Available time return should be correct', done => {
      TestHelper.createMachineWithSchedule(
        'Machine 1',
        [{ date: today, time: '17:50' }, { date: today, time: '22:00' }],
        machineId => {
          TestHelper.signin(
            username,
            password,
            (clientError, signinError, loginToken) => {
              chai
                .request(server)
                .get(`/availableTime?machineId=${machineId}&date=${today}`)
                .set('authorization', loginToken)
                .send()
                .end((getTimeError, response) => {
                  response.should.have.status(200);
                  should.equal(
                    _.isEqual(
                      response.body,
                      TestHelper.mockAvailableTime(['17:50', '22:00'])
                    ),
                    true
                  );
                  done();
                });
            }
          );
        }
      );
    });

    // TODO: User should not be able to get available time if token cannot be found
    // TODO: User should not be able to get available time if machine Id cannot be found
    // TODO: User should not be able to get available time if with bad pattern token
    // TODO: User should not be able to get available time if with bad pattern machine Id
  });
});
