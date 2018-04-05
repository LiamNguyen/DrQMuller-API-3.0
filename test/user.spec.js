const { describe, it, beforeEach } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');

const { server } = require('../server');
const ApiError = require('../constants/ApiError');
const TestHelper = require('./TestHelper');

chai.use(chaiHttp);
chai.should();

describe('[Controller] User', () => {
  beforeEach(done => {
    mongoose.connection.db.dropDatabase(() => done());
  });

  describe('PUT /user/me', () => {
    const username = 'username1';
    const password = 'password1';
    const name = 'Santa Clause';
    const address = 'Lapland';
    const gender = 'Male';
    const dob = '1980/11/01';
    const email = 'santa.clause@lapland.com';
    const phone = '0987654321';

    it('User should be able to update [Name] and [Address]', done => {
      TestHelper.signin(username, password, (clientError, error, loginToken) => {
        chai.request(server)
          .put('/user/me')
          .set('authorization', loginToken)
          .send({ name, address })
          .end((updateError, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object').eql({});
            done();
          });
      });
    });

    it('User should be able to update [Gender] and [Dob]', done => {
      TestHelper.signin(username, password, (clientError, error, loginToken) => {
        chai.request(server)
          .put('/user/me')
          .set('authorization', loginToken)
          .send({ gender, dob })
          .end((updateError, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object').eql({});
            done();
          });
      });
    });

    it('User should be able to update [Email] and [Phone]', done => {
      TestHelper.signin(username, password, (clientError, error, loginToken) => {
        chai.request(server)
          .put('/user/me')
          .set('authorization', loginToken)
          .send({ email, phone })
          .end((updateError, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object').eql({});
            done();
          });
      });
    });

    it('User should not be able to update if [Token] is incorrect', done => {
      chai.request(server)
        .put('/user/me')
        .set('authorization', uuidv1())
        .send({ name, address })
        .end((updateError, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object').eql({});
          done();
        });
    });

    it('User should not be able to update if [Name] or [Address] is invalid', done => {
      TestHelper.signin(username, password, (clientError, error, loginToken) => {
        chai.request(server)
          .put('/user/me')
          .set('authorization', loginToken)
          .send({ name: `${name}_123`, address: `${address}_@#$@%^&&**__+` })
          .end((updateError, response) => {
            response.should.have.status(400);
            response.body.should.be.a('object');
            response.body.should.have.property('error_code')
              .eql(ApiError.server_error.error_code);
            done();
          });
      });
    });

    it('User should not be able to update if [Gender] or [Dob] is invalid', done => {
      TestHelper.signin(username, password, (clientError, error, loginToken) => {
        chai.request(server)
          .put('/user/me')
          .set('authorization', loginToken)
          .send({ gender: 'BOY', dob: `${dob}_invalid` })
          .end((updateError, response) => {
            response.should.have.status(400);
            response.body.should.be.a('object');
            response.body.should.have.property('error_code')
              .eql(ApiError.server_error.error_code);
            done();
          });
      });
    });

    it('User should not be able to update if [Email] or [Phone] is invalid', done => {
      TestHelper.signin(username, password, (clientError, error, loginToken) => {
        chai.request(server)
          .put('/user/me')
          .set('authorization', loginToken)
          .send({ email: 'invalid_email', phone: `${phone}_invalid` })
          .end((updateError, response) => {
            response.should.have.status(400);
            response.body.should.be.a('object');
            response.body.should.have.property('error_code')
              .eql(ApiError.server_error.error_code);
            done();
          });
      });
    });

    it(
      // eslint-disable-next-line
      'User should not be able to update if [Name] and [Address] are not updated together',
      done => {
        TestHelper.signin(username, password, (clientError, error, loginToken) => {
          chai.request(server)
            .put('/user/me')
            .set('authorization', loginToken)
            .send({ name, phone })
            .end((updateError, response) => {
              response.should.have.status(400);
              response.body.should.be.a('object');
              response.body.should.have.property('error_code')
                .eql(ApiError.server_error.error_code);
              done();
            });
        });
      }
    );

    it(
      // eslint-disable-next-line
      'User should not be able to update if [Gender] and [Dob] are not updated together',
      done => {
        TestHelper.signin(username, password, (clientError, error, loginToken) => {
          chai.request(server)
            .put('/user/me')
            .set('authorization', loginToken)
            .send({ gender, phone })
            .end((updateError, response) => {
              response.should.have.status(400);
              response.body.should.be.a('object');
              response.body.should.have.property('error_code')
                .eql(ApiError.server_error.error_code);
              done();
            });
        });
      }
    );

    it(
      // eslint-disable-next-line
      'User should not be able to update if [Email] and [Phone] are not updated together',
      done => {
        TestHelper.signin(username, password, (clientError, error, loginToken) => {
          chai.request(server)
            .put('/user/me')
            .set('authorization', loginToken)
            .send({ email, name })
            .end((updateError, response) => {
              response.should.have.status(400);
              response.body.should.be.a('object');
              response.body.should.have.property('error_code')
                .eql(ApiError.server_error.error_code);
              done();
            });
        });
      }
    );
  });
});
