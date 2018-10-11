/* eslint max-len: 0 */

import express from 'express';
import validate from 'express-validation';
import Joi from '../../initial/joi_i18n';
import AuthController from '../controllers/mysql/auth.controller.js';

const router = express.Router(); // eslint-disable-line new-cap
const authCrl = new AuthController();
/**
 * @api {post} /public/auth/login Login
 * @apiVersion 1.0.0
 * @apiName login
 * @apiGroup auth
 *
 * @apiParam {String} username Username.
 * @apiParam {String} password password.
 *
 * @apiParamExample {json} Request-Example:
 * POST /public/auth/login
 {
  "username": "admin",
  "password": "123qwe!@#"
 }
 *
 * @apiSuccessExample {json} Success-Response (example):
 * HTTP/1.1 200 OK
 {
    "success": true,
    "payload":{
      "id": "1",
      "username": "admin",
      "password": "123",
      "fullname": "Administrator",
      "code": "admin",
      "email": "admin@localhost.com",
      "address": "localhost",
      "description": "Admin user",
      "_created_at": "2018-04-07 00:00:00",
      "_updated_at": "2018-04-07 00:00:00",
      "_deleted_at": null,
      "_created_by": "1",
      "_updated_by": "1",
      "_status": "1"
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoyNTY2MzgsImlhdCI6MTUwMTU4MDk0MiwiZXhwIjoxNTAyMTg1NzQyfQ.2r-TC_XQK0fNiySYYLxKNm1-4CPMWz3k4tzh3nRXQbQ"
    }
}
 *
 * @apiErrorExample {json} Error-Response (example):
 * HTTP/1.1 200 OK
 {
     "success": false,
     "payload": {
         "code": 403,
         "message": "Forbidden"
     }
 }

 */
router.route('/auth/login')
  .post(validate(
    {
      body: {
        username: Joi.string().required(),
        password: Joi.string().required()
      }
    }
    ),
    AuthController.login);

router.route('/register')
  .post(validate(
    {
      body: {
        username: Joi.string().required(),
        password: Joi.string().required(),
        email: Joi.string().required()
      }
    }
    ),
    authCrl.register);

export default router;
