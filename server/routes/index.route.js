import express from 'express';
import expressLimiter from 'express-limiter';
import ip from 'ip';

import config from '../../initial/config';
import authenticationRoutes from '../middwares/authentication.middware';
import publicRoutes from './public.route';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import { resSuccess } from '../helpers/http_handler.helper.js';
import packagejson from '../../package.json';
import RedisConnection from '../models/connections/redis.connection';

const router = express.Router(); // eslint-disable-line new-cap
const redis = new RedisConnection();
const limiter = expressLimiter(router, redis);

router.get('/',
  (req, res) => {
    resSuccess(res, {
      info: 'Backend API Server',
      status: 'OK',
      version: packagejson.version,
      env: config.env,
      time: (new Date()).toISOString(),
      address: ip.address()
    });
  }
);
router.use('/public',
  limiter({
    lookup: 'connection.remoteAddress',
    // 30 requests per seconds
    total: config.request_per_second,
    expire: 1000,
    onRateLimited: (req, res) => {
      res.status(429).send({
        success: false,
        payload: {
          code: 429,
          message: 'Rate limit exceeded'
        }
      });
    }
  })
  , publicRoutes);
router.use('/api',
  limiter({
    lookup: 'connection.remoteAddress',
    total: config.request_per_second,
    expire: 1000,
    onRateLimited: (req, res) => {
      res.status(429).send({
        success: false,
        payload: {
          code: 429,
          message: 'Rate limit exceeded'
        }
      });
    }
  })
  , authenticationRoutes);

router.use('/api/auth', authRoutes);
router.use('/api/users', userRoutes);


export default router;
