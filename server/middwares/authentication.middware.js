import express from 'express';
import lodash from 'lodash';
import jwt from 'jsonwebtoken';
import { resError } from '../helpers/http_handler.helper';
import { jwt_secret as jwtSecret } from '../../initial/config';
import usersModel from '../models/idModel/usersModel';

const router = express.Router(); // eslint-disable-line new-cap

const getAuthorizationInfo = (req, res, next) => {
  const token = lodash.get(req, ['headers', 'authorization'], '');
  if (token.length > 0) {
    req.token = token;
    return next();
  }
  return resError(res,
    {
      code: 203,
      message: '203 Non-Authoritative Information'
    }
  );
};


const authorization = (req, res, next) => {
  const token = lodash.get(req, 'token', '');
  jwt.verify(token, jwtSecret, (err, data) => {
    if (err) {
      return resError(res,
        {
          code: 401,
          message: 'Unauthorized',
          error: err
        }
      );
    }
    const userId = lodash.get(data, 'user_id', '');
    return usersModel.findById(userId)
      .then((user) => {
        if (user) {
          req.user = user;
          return next();
        }
        return resError(res,
          {
            code: 403,
            message: 'Forbidden'
          }
        );
      })
      .catch(error => resError(res,
        {
          code: 401,
          message: 'Unauthorized',
          error
        }
        )
      );
  });
};

router.use(getAuthorizationInfo, authorization);

export default router;
