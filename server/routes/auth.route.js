import express from 'express';
import expressJwt from 'express-jwt';
import AuthController from '../controllers/mysql/auth.controller.js';
import config from '../../initial/config';

const router = express.Router(); // eslint-disable-line new-cap

/** GET /api/auth/random-number - Protected route,
 * needs token returned by the above as header. Authorization: Bearer {token} */

/**
 * @api {get} /api/auth/random-number Get a random number
 * @apiVersion 1.0.0
 * @apiName random-number
 * @apiGroup auth
 * @apiParam {Number} id  ID of attachments is required.
 * @apiSuccessExample {json} Success-Response (example):
 * HTTP/1.1 200 OK
 {
  "success": true,
  "payload": 1
}
 * @apiErrorExample {json} Error-Response (example):
 {
  "success": false,
  "payload": {
  "error":203
  }
}
 */

router.route('/random-number')
  .get(expressJwt({ secret: config.jwt_secret }), AuthController.getRandomNumber);

export default router;
