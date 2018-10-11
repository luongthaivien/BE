import request from 'supertest-as-promised';
import httpStatus from 'http-status';
// import jwt from 'jsonwebtoken';
import chai, { expect } from 'chai';
import app from '../../index';
// import config from '../../initial/config';

chai.config.includeStack = true;

describe('## Auth APIs', () => {
  const invalidUserCredentials = {
    username: 'react',
    password: 'IDontKnow'
  };

  describe('# POST /public/auth/login', () => {
    it('should return User not found', (done) => {
      request(app)
        .post('/public/auth/login')
        .send(invalidUserCredentials)
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.success).to.equal(false);
          expect(res.body.payload.message).to.equal('User not found');
          done();
        })
        .catch(done);
    });

    // it('should get valid JWT token', (done) => {
    //   request(app)
    //     .post('/public/auth/login')
    //     .send(validUserCredentials)
    //     .expect(httpStatus.OK)
    //     .then((res) => {
    //       expect(res.body.payload).to.have.property('token');
    //       jwt.verify(res.body.payload.token, config.jwt_secret, (err, decoded) => {
    //         expect(err).to.not.be.ok; // eslint-disable-line no-unused-expressions
    //         expect(decoded.user_id).to.equal(parseInt(validUserCredentials.username, 10));
    //         jwtToken = `abcfz13792ddfc14f18213c8f15e4b02f5d32${res.body.payload.token}`;
    //         done();
    //       });
    //     })
    //     .catch(done);
    // });
  });

  describe('# GET /api/auth/random-number', () => {
    // it('should fail to get random number because of missing Authorization', (done) => {
    //   request(app)
    //     .get('/api/auth/random-number')
    //     .set('Authorization', jwtToken)
    //     .expect(httpStatus.OK)
    //     .then((res) => {
    //       expect(res.body.payload.message).to.equal('Unauthorized');
    //       done();
    //     })
    //     .catch(done);
    // });

    it('should fail to get random number because of wrong token', (done) => {
      request(app)
        .get('/api/auth/random-number')
        .set('Authorization', 'Bearer inValidToken')
        .expect(httpStatus.OK)
        .then((res) => {
          expect(res.body.payload.message).to.equal('Unauthorized');
          done();
        })
        .catch(done);
    });

    // it('should get a random number', (done) => {
    //   request(app)
    //     .get('/api/auth/random-number')
    //     .set('Authorization', jwtToken)
    //     .expect(httpStatus.OK)
    //     .then((res) => {
    //       expect(res.body.num).to.be.a('number');
    //       done();
    //     })
    //     .catch(done);
    // });
  });
});
