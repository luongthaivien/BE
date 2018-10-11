/* eslint no-console: 0 */
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';
import userExample from './example_data/user.json';

chai.config.includeStack = true;

describe('## User APIs', () => {
  let currentUser;
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
  userExample.username = `${userExample.username}_${Date.now()}`;
  describe('# POST /api/users/create', () => {
    it('should create a new user', (done) => {
      request(app)
        .post('/api/users/create')
        .set('Authorization', userTmpForTest.token)
        .send(userExample)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.success).to.equal(true);
          /**
           "username": "admin",
           "password": "123",
           "fullname": "Administrator",
           "code": "admin",
           "email": "admin@localhost.com",
           "address": "localhost",
           "description": "Admin user",
           */
          expect(res.body.payload.username).to.equal(userExample.username);
          expect(res.body.payload.fullname).to.equal(userExample.fullname);
          expect(res.body.payload.code).to.equal(userExample.code);
          expect(res.body.payload.email).to.equal(userExample.email);
          expect(res.body.payload.address).to.equal(userExample.address);
          expect(res.body.payload.description).to.equal(userExample.description);
          currentUser = res.body.payload;
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/getOne/:id', () => {
    it('should get user info', (done) => {
      request(app)
        .get(`/api/users/getOne/${currentUser.id}`)
        .set('Authorization', userTmpForTest.token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.success).to.equal(true);
          expect(res.body.payload.username).to.equal(userExample.username);
          expect(res.body.payload.fullname).to.equal(userExample.fullname);
          expect(res.body.payload.code).to.equal(userExample.code);
          expect(res.body.payload.email).to.equal(userExample.email);
          expect(res.body.payload.address).to.equal(userExample.address);
          expect(res.body.payload.description).to.equal(userExample.description);
          done();
        })
        .catch(done);
    });

    it('should report error with message - Not found, when user does not exists', (done) => {
      request(app)
        .get('/api/users/getOne/0')
        .set('Authorization', userTmpForTest.token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.payload.message).to.equal('Not found object with id 0');
          done();
        })
        .catch(done);
    });
  });

  describe('# PUT /api/users/update/:id', () => {
    it('should update user details', (done) => {
      currentUser.description = 'KK';
      request(app)
        .put(`/api/users/update/${currentUser.id}`)
        .set('Authorization', userTmpForTest.token)
        .send(currentUser)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.success).to.equal(true);
          expect(res.body.payload.username).to.equal(currentUser.username);
          expect(res.body.payload.fullname).to.equal(currentUser.fullname);
          expect(res.body.payload.code).to.equal(currentUser.code);
          expect(res.body.payload.email).to.equal(currentUser.email);
          expect(res.body.payload.address).to.equal(currentUser.address);
          expect(res.body.payload.description).to.equal(currentUser.description);
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/users/getAll', () => {
    it('should get all users', (done) => {
      request(app)
        .get('/api/users/getAll')
        .set('Authorization', userTmpForTest.token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.success).to.equal(true);
          expect(res.body.payload).to.be.an('array');
          done();
        })
        .catch(done);
    });
  });

  describe('# POST /api/users/getAll', () => {
    it('should get all users (with limit and skip)', (done) => {
      request(app)
        .post('/api/users/getAll')
        .set('Authorization', userTmpForTest.token)
        .send({ query: { limit: 10, skip: 1 } })
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.success).to.equal(true);
          expect(res.body.payload.data).to.be.an('array');
          expect(res.body.payload.total).to.be.an('number');
          done();
        })
        .catch(done);
    });
  });

  describe('# DELETE /api/users/remove/:id', () => {
    it('should delete user', (done) => {
      request(app)
        .delete(`/api/users/remove/${currentUser.id}`)
        .set('Authorization', userTmpForTest.token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.success).to.equal(true);
          done();
        })
        .catch(done);
    });
  });
});
