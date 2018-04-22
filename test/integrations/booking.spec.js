process.env.NODE_ENV = 'test';

const { describe, it, afterEach } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');
const _ = require('lodash');
const mongoose = require('mongoose');

const { server } = require('../../server');
const TestHelper = require('../TestHelper');
const MachineRepository = require('../../repositories/MachineRepository');
const AppointmentRepository = require('../../repositories/AppointmentRepository');
const LoginTokenRepository = require('../../repositories/LoginTokenRepository');

chai.use(chaiHttp);
const should = chai.should();

describe('[Controller] Booking', () => {
  afterEach(done => {
    mongoose.connection.db.dropDatabase(() => done());
  });

  describe('GET /availableTime', () => {
    const username = 'username2';
    const password = 'password2';
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

  describe('POST /appointment', () => {
    const username = 'username3';
    const password = 'password3';
    const today = moment().format('YYYY-MM-DD');
    const bookingTime = '12:50';

    it('User should be able to create new appointment', done => {
      TestHelper.createMachineWithSchedule(
        'Machine 1',
        [{ date: today, time: '17:50' }],
        machineId => {
          TestHelper.signin(
            username,
            password,
            (clientError, signinError, loginToken) => {
              chai
                .request(server)
                .post('/appointment')
                .set('authorization', loginToken)
                .send({
                  machineId,
                  schedule: { date: today, time: bookingTime }
                })
                .end((createAppointmentError, response) => {
                  response.should.have.status(201);
                  done();
                });
            }
          );
        }
      );
    });

    it('Newly created appointment should be saved correctly', done => {
      TestHelper.createMachineWithSchedule(
        'Machine 1',
        [{ date: today, time: '17:50' }],
        machineId => {
          TestHelper.signin(
            username,
            password,
            (clientError, signinError, loginToken) => {
              chai
                .request(server)
                .post('/appointment')
                .set('authorization', loginToken)
                .send({
                  machineId,
                  schedule: { date: today, time: bookingTime }
                })
                .end((createAppointmentError, response) => {
                  response.should.have.status(201);
                  LoginTokenRepository.getUserIdByToken(
                    loginToken,
                    (getUserIdByTokenError, userId) => {
                      AppointmentRepository.getByUserId(
                        userId,
                        (error, appointments) => {
                          appointments.length.should.eql(1);
                          appointments[0].should.have
                            .property('machineId')
                            .eql(machineId);
                          appointments[0].should.have.property('schedule');
                          appointments[0].schedule.should.be.a('object');
                          appointments[0].schedule.should.have
                            .property('date')
                            .eql(today);
                          appointments[0].schedule.should.have
                            .property('time')
                            .eql(bookingTime);
                          done();
                        }
                      );
                    }
                  );
                });
            }
          );
        }
      );
    });
  });
});
