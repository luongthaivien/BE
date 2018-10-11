/* eslint no-console: 0 */
import mongoose from 'mongoose';
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';

chai.config.includeStack = true;

/**
 * root level hooks
 */
after((done) => {
  // required because https://github.com/Automattic/mongoose/issues/1251#issuecomment-65793092
  mongoose.models = {};
  mongoose.modelSchemas = {};
  mongoose.connection.close();
  done();
});

describe('## Public APIs', () => {
  let userTmpForTest;
  // Regist an user, then login get token
  before('Regist user', (done) => {
    const name = `test-${Date.now()}`;
    request(app)
      .post('/public/register')
      .send({
        username: name,
        password: '123'
      })
      .expect(httpStatus.OK)
      .then(() => {
        // Login
        request(app)
          .post('/public/auth/login')
          .send({
            username: name,
            password: '123'
          })
          .expect(httpStatus.OK)
          .then((res) => {
            userTmpForTest = res.body.payload;
            console.log('Regist AND Login done !');
            done();
          });
        // End login
      });
  });
  after('Delete user after test', (done) => {
    request(app)
      .delete(`/api/users/remove/${userTmpForTest.id}`)
      .set('Authorization', userTmpForTest.token)
      .expect(httpStatus.OK)
      .then(() => {
        console.log('Delete done !');
        done();
      });
  });
  describe('# POST /public/auth/login', () => {
    it('Native Login', (done) => {
      request(app)
        .post('/public/auth/login')
        .send({
          username: userTmpForTest.username,
          password: '123'
        })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.success).to.equal(true);
          expect(res.body.payload.username).to.equal(userTmpForTest.username);
          expect(res.body.payload.token).to.be.an('string');
          done();
        })
        .catch(done);
    });
  });
});
