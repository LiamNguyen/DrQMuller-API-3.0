const { describe, it, beforeEach } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const uuidv1 = require('uuid/v1');

const { server } = require('../server');
const AuthService = require('../services/AuthService');
const LoginToken = require('../database/models/loginToken');
const User = require('../database/models/user');
const ApiError = require('../constants/ApiError');
const TestHelper = require('./TestHelper');

chai.use(chaiHttp);
chai.should();

describe('[Controller] Authentication', () => {
  beforeEach(done => {
    mongoose.connection.db.dropDatabase(() => done());
  });

  describe('POST /signin', () => {
    const username = 'username1';
    const password = 'password1';
    const invalidUsername = `${username}_invalid`;

    it('User should be able to sign in', done => {
      AuthService.createUser(username, password, () => {
        chai.request(server)
          .post('/signin')
          .send({ username, password })
          .end((error, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object');
            response.body.should.have.property('loginToken');
            LoginToken.findOne({ id: response.body.loginToken }, (e, result) => {
              result.should.not.eql(null);
            });
            done();
          });
      });
    });

    it('User should not be able to sign in using invalid username or password', done => {
      chai.request(server)
        .post('/signin')
        .send({ invalidUsername, password })
        .end((error, response) => {
          response.should.have.status(400);
          response.body.should.be.a('object');
          response.body.should.have.property('error_code')
            .eql(ApiError.invalid_username_or_password.error_code);
          done();
        });
    });
  });

  describe('POST /user', () => {
    it('User should be able to sign up', done => {
      const username = 'username1';
      const password = 'password1';

      chai.request(server)
        .post('/user')
        .send({ username, password })
        .end((error, response) => {
          response.should.have.status(201);
          response.body.should.be.a('object');
          response.body.should.have.property('loginToken');
          LoginToken.findOne(
            { id: response.body.loginToken },
            (loginTokenError, result) => {
              result.should.not.eql(null);
            }
          );
          User.find({}, (userError, result) => {
            result.length.should.eql(1);
          });
          done();
        });
    });

    it('User should not be able to sign up using existing username', done => {
      const username = 'username1';
      const password = 'password1';

      AuthService.createUser(username, password, () => {
        chai.request(server)
          .post('/user')
          .send({ username, password })
          .end((error, response) => {
            response.should.have.status(400);
            response.body.should.be.a('object');
            response.body.should.have.property('error_code')
              .eql(ApiError.username_exist.error_code);
            done();
          });
      });
    });

    it(
      // eslint-disable-next-line
      'User should not be able to sign up using username or password which fails validation',
      done => {
        const username = 'use$$@#$&&';
        const password = 'pas';

        chai.request(server)
          .post('/user')
          .send({ username, password })
          .end((error, response) => {
            response.should.have.status(400);
            response.body.should.be.a('object');
            response.body.should.have.property('error_code')
              .eql(ApiError.server_error.error_code);
            done();
          });
      }
    );
  });

  describe('POST /signout', () => {
    it('User should be able to sign out', done => {
      TestHelper.signin('username1', 'password1', (clientError, error, loginToken) => {
        chai.request(server)
          .post('/signout')
          .set('authorization', loginToken)
          .send()
          .end((signoutError, response) => {
            response.should.have.status(200);
            response.body.should.be.a('object').eql({});
            done();
          });
      });
    });

    it('User should not be able to sign out when login token does not exist', done => {
      const randomToken = uuidv1();
      chai.request(server)
        .post('/signout')
        .set('authorization', randomToken)
        .send()
        .end((error, response) => {
          response.should.have.status(401);
          response.body.should.be.a('object').eql({});
          done();
        });
    });
  });
});
