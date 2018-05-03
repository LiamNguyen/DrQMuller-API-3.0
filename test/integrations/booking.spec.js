process.env.NODE_ENV = 'test';

const { describe, it, afterEach } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const moment = require('moment');
const _ = require('lodash');
const mongoose = require('mongoose');
const uuidv4 = require('uuid/v4');

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
    const schedule = { date: today, time: bookingTime };

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
                  schedule
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

    // eslint-disable-next-line max-len
    it("Newly created appointment's schedule should be added to machine's schedules ", done => {
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
                  schedule
                })
                .end((createAppointmentError, response) => {
                  response.should.have.status(201);
                  MachineRepository.getById(machineId, (error, machine) => {
                    machine.should.be.a('object');
                    machine.should.have.property('schedules');
                    machine.schedules.length.should.be.eql(2);
                    const newlyAddedSchedule = machine.schedules.find(
                      s => s.time === schedule.time
                    );
                    should.not.equal(newlyAddedSchedule, null);
                    newlyAddedSchedule.date.should.be.eql(today);
                    done();
                  });
                });
            }
          );
        }
      );
    });

    // eslint-disable-next-line max-len
    it('User should not be able to create new appointment if login token is invalid', done => {
      TestHelper.createMachineWithSchedule(
        'Machine 1',
        [{ date: today, time: '17:50' }],
        machineId => {
          chai
            .request(server)
            .post('/appointment')
            .set('authorization', uuidv4())
            .send({
              machineId,
              schedule
            })
            .end((createAppointmentError, response) => {
              response.should.have.status(401);
              done();
            });
        }
      );
    });

    // eslint-disable-next-line max-len
    it('User should not be able to create new appointment if the date or time is already being booked', done => {
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
                  schedule
                })
                .end((error, response) => {
                  response.should.have.status(201);
                  chai
                    .request(server)
                    .post('/appointment')
                    .set('authorization', loginToken)
                    .send({
                      machineId,
                      schedule
                    })
                    .end((createAppointmentError, response) => {
                      response.should.have.status(400);
                      done();
                    });
                });
            }
          );
        }
      );
    });

    // eslint-disable-next-line max-len
    // TODO: User should not be able to create new appointment if machine ID is missing or invalid
    // eslint-disable-next-line max-len
    // TODO: User should not be able to create new appointment if schedule is missing or invalid
  });

  describe('PATCH /appointment', () => {
    it('User should be able to cancel the appointment', done => {
      TestHelper.createAppointmentForUser(loginToken => {
        chai
          .request(server)
          .get('/appointments')
          .set('authorization', loginToken)
          .send()
          .end((getAppointmentsError, response) => {
            response.should.have.status(200);
            const { id: appointmentId } = response.body[0];
            chai
              .request(server)
              .patch('/appointment')
              .set('authorization', loginToken)
              .send({ appointmentId })
              .end((cancelAppointmentError, response) => {
                response.should.have.status(200);
                chai
                  .request(server)
                  .get('/appointments')
                  .set('authorization', loginToken)
                  .send()
                  .end((getAppointmentsError, response) => {
                    response.body.should.be.a('array');
                    const appointments = response.body;
                    const cancelledAppointment = appointments.find(
                      appointment => appointment.id === appointmentId
                    );
                    cancelledAppointment.isCancelled.should.be.eql(true);
                    done();
                  });
              });
          });
      });
    });

    // eslint-disable-next-line max-len
    // TODO: User should not be able to cancel appointment if they are unauthorized
    // eslint-disable-next-line max-len
    // TODO: User should not be able to cancel appointment if appointment ID is missing or invalid
    // eslint-disable-next-line max-len
    // TODO: User should not be able to cancel appointment which has not been created by them
  });

  describe('GET /appointments', () => {
    it('User should be able to get own appointments', done => {
      TestHelper.createAppointmentForUser((loginToken, machineId, schedule) => {
        chai
          .request(server)
          .get('/appointments')
          .set('authorization', loginToken)
          .send()
          .end((getAppointmentsError, response) => {
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body.length.should.eql(1);
            response.body[0].should.have.property('machineId').eql(machineId);
            response.body[0].should.have.property('schedule');
            should.not.equal(response.body[0].schedule, null);
            should.not.equal(response.body[0].schedule, undefined);
            response.body[0].schedule.date.should.eql(schedule.date);
            response.body[0].schedule.time.should.eql(schedule.time);
            done();
          });
      });
    });

    // eslint-disable-next-line max-len
    it('User should not be able to get own appointments if login token is invalid', done => {
      chai
        .request(server)
        .get('/appointments')
        .set('authorization', uuidv4())
        .send()
        .end((getAppointmentsError, response) => {
          response.should.have.status(401);
          done();
        });
    });
  });

  describe('GET /machines', () => {
    it('User should be able to get all machines', done => {
      TestHelper.signin(
        'username1',
        'password1',
        (clientError, signinError, loginToken) => {
          TestHelper.createMachine('Machine 1', () => {
            TestHelper.createMachine('Machine 2', () => {
              chai
                .request(server)
                .get('/machines')
                .set('authorization', loginToken)
                .send()
                .end((getMachinesError, response) => {
                  response.should.have.status(200);
                  response.body.should.be.a('array');
                  response.body.length.should.eql(2);
                  response.body[0].should.have.property('id');
                  response.body[0].id.should.be.a('string');
                  response.body[0].should.have.property('name');
                  response.body[0].name.should.be.eql('Machine 1');
                  response.body[1].should.have.property('id');
                  response.body[1].id.should.be.a('string');
                  response.body[1].should.have.property('name');
                  response.body[1].name.should.be.eql('Machine 2');
                  done();
                });
            });
          });
        }
      );
    });

    // eslint-disable-next-line max-len
    it('User should not be able to get all machines if login token is invalid', done => {
      chai
        .request(server)
        .get('/machines')
        .set('authorization', uuidv4())
        .send()
        .end((getMachinesError, response) => {
          response.should.have.status(401);
          done();
        });
    });
  });
});
