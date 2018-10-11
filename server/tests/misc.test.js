/* eslint no-console: 0 */
import request from 'supertest-as-promised';
import httpStatus from 'http-status';
import chai, { expect } from 'chai';
import app from '../../index';
import userExample from './example_data/user.json';


chai.config.includeStack = true;

describe('## Misc', () => {
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
  describe('# Health Check /', () => {
    it('should return OK', (done) => {
      request(app)
        .get('/')
        .set('Authorization', userTmpForTest.token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.success).to.equal(true);
          expect(res.body.payload.status).to.equal('OK');
          done();
        })
        .catch(done);
    });
  });

  describe('# GET /api/404', () => {
    it('should return 404 status', (done) => {
      request(app)
        .get('/api/404')
        .set('Authorization', userTmpForTest.token)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.payload.message).to.equal('Not Found');
          done();
        })
        .catch(done);
    });
  });
});
