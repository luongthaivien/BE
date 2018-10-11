/* eslint no-unused-vars:0 */
import express from 'express';
import validate from 'express-validation';
import Joi from '../../initial/joi_i18n';
import UserController from '../controllers/mysql/user.controller.js';

const router = express.Router(); // eslint-disable-line new-cap
const UserCrtl = new UserController();

/**
 * @api {get} /api/users/getAll Get all users
 * @apiVersion 1.0.0
 * @apiName getAll
 * @apiGroup users
 * @apiSuccessExample {json} Success-Response (example):
 * HTTP/1.1 200 OK
 {
  "success": true,
  "payload":[]
}
 * @apiErrorExample {json} Error-Response (example):
 *
 * {
     * "success": false,
     * "payload":{
     * "code": 500,
     * "message": "Database query error"
     * }
     */
router.route('/getAll')
  .get(UserCrtl.getAll);

/**
 * @api {post} /api/users/getAll Get all users
 * @apiVersion 1.0.0
 * @apiName getAll
 * @apiGroup users
 * @apiSuccessExample {json} Success-Response (example):
 * HTTP/1.1 200 OK
 {
  "success": true,
  "payload":[]
}
 * @apiErrorExample {json} Error-Response (example):
 *
 * {
     * "success": false,
     * "payload":{
     * "code": 500,
     * "message": "Database query error"
     * }
     */
router.route('/getAll')
  .post(UserCrtl.getAllByConditions);

/**
 * @api {post} /api/users/create Create new user
 * @apiVersion 1.0.0
 * @apiName create
 * @apiGroup users
 * @apiParam {Object} body Data to be inserted (in JSON Object form).
 * @apiParamExample {json} Request-Example:
 * POST /api/users/create
 {
  }
 * @apiErrorExample {json} Error-Response (example):
 * HTTP/1.1 400 Bad Request
 {
  "success": false,
  "payload": {
  "code": 400,
  "message": "Wrong request parameters"
  }
 * @apiSuccessExample {json} Success-Response (example):
 * HTTP/1.1 200 OK
 {
    "success": true,
    "payload": {}
}
 */
router.route('/create')
  .post(
    // validate(
    //   {
    //     body: {
    //       username: Joi.string().required(),
    //       password: Joi.string().required()
    //     }
    //   },
    //   { i18n: 'vi_VN' }
    // ),
    UserCrtl.create);

/**
 * @api {get} /api/users/getOne/:id Get an user information
 * @apiVersion 1.0.0
 * @apiName getOne
 * @apiGroup users
 * @apiSuccessExample {json} Success-Response (example):
 * HTTP/1.1 200 OK
 {
  "success": true,
  "payload":[]
}
 * @apiErrorExample {json} Error-Response (example):
 *
 {
   "success": false,
   "payload":{
   "code": 500,
   "message": "Database query error"
 }
*/
router.route('/getOne/:id')
  .get(
    validate(
      {
        params: {
          id: Joi.number().required()
        }
      },
      { i18n: 'vi_VN' }
    ),
    UserCrtl.getDetails);

/**
 * @api {put} /api/users/update/:id update an user
 * @apiVersion 1.0.0
 * @apiName update
 * @apiGroup users
 * @apiSuccessExample {json} Success-Response (example):
 * HTTP/1.1 200 OK
 {
  "success": true,
  "payload":[]
}
 * @apiErrorExample {json} Error-Response (example):
 *
 {
   "success": false,
   "payload":{
   "code": 500,
   "message": "Database query error"
 }
*/
router.route('/update/:id')
  .put(
    validate(
      {
        params: {
          id: Joi.number().required()
        }
      },
      { i18n: 'vi_VN' }
    ),
    UserCrtl.update);


/**
 * @api {delete} /api/users/remove/:id remove an user
 * @apiVersion 1.0.0
 * @apiName remove
 * @apiGroup users
 * @apiSuccessExample {json} Success-Response (example):
 * HTTP/1.1 200 OK
 {
  "success": true,
  "payload":[]
}
 * @apiErrorExample {json} Error-Response (example):
 *
 {
   "success": false,
   "payload":{
   "code": 500,
   "message": "Database query error"
 }
*/
router.route('/remove/:id')
  .delete(
    validate(
      {
        params: {
          id: Joi.number().required()
        }
      },
      { i18n: 'vi_VN' }
    ),
    UserCrtl.remove);

/** Load user when API with userId route parameter is hit */
router.param('Authorization', UserCrtl.load);

export default router;
