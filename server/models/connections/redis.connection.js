import redis from 'redis';
import Promise from 'bluebird';
import config from '../../../initial/config';

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

const instance = {};

export default class RedisConnection {
  constructor(name = 'default') {
    if (typeof instance[name] === 'undefined') {
      if (typeof config.databases.redis[name] !== 'undefined') {
        const redisConfig = config.databases.redis[name];
        try {
          const redisClient = redis.createClient(redisConfig.port, redisConfig.host);
          redisClient.on('connect', () => {
            console.log(`Redis Server ${name} is connected!`);// eslint-disable-line no-console
          });
          redisClient.on('error', () => {
            console.error('Error connecting to redis');// eslint-disable-line no-console
          });
          instance[name] = redisClient;
        } catch (err) {
          console.log('err :');// eslint-disable-line no-console
        }
      } else {
        console.log(`unable to connect to redis: ${name}`);// eslint-disable-line no-console
      }
    }
    return instance[name];
  }
}
