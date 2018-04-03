const { describe, it, beforeEach } = require('mocha');
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');

const { server } = require('../server');
const AuthService = require('../services/AuthService');
const LoginToken = require('../database/models/loginToken');
const User = require('../database/models/user');

chai.use(chaiHttp);
chai.should();

describe('[Controller] Authentication', () => {
  beforeEach(done => {
    mongoose.connection.db.dropDatabase(() => done());
  });

  describe('POST /signin', () => {
    it('User should be able to sign in', done => {
      const username = 'username1';
      const password = 'password1';

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
  });
});
