import Joi from 'joi';
import configData from '../config.json';
import {
  getAbsoluteFolderAndCreateIfNotExist
} from '../server/helpers/file.helper';

const envVarsSchema = Joi.object({
  env: Joi.string()
    .allow(['development', 'production', 'test', 'provision'])
    .default('development'),
  jwt_secret: Joi.string()
    .default('123qwe!@#'),
  request_per_second: Joi.number()
    .default(30),
  path_uploadfile: Joi.string()
    .default('./static/uploads'),
  port: Joi.number()
    .default(4040),
  databases: Joi.object().keys({
    mysql: Joi.object().keys({
      default: Joi.object().keys({
        host: Joi.string().required().description('MySQL host is required'),
        port: Joi.number().required().description('MySQL port is required'),
        user: Joi.string().required().description('MySQL user is required'),
        password: Joi.string().required().description('MySQL password is required'),
        database: Joi.string().required().description('MySQL database is required'),
        charset: Joi.string().required().description('MySQL charset is required')
      })
    }),
    mongodb: Joi.object().keys({
      default: Joi.object().keys({
        uri: Joi.string().required().description('MongoDB URI is required'),
        port: Joi.number().required().description('MongoDB port is required'),
        reconnectTries: Joi.number().description('MongoDB reconnectTries'),
        reconnectInterval: Joi.number().description('MongoDB reconnectInterval'),
        debug: Joi.boolean()
          .when('node_env', {
            is: Joi.string().equal('development'),
            then: Joi.boolean().default(true),
            otherwise: Joi.boolean().default(false)
          })
      })
    }),
    redis: Joi.object().keys({
      default: Joi.object().keys({
        host: Joi.string().required().description('Redis host is required'),
        port: Joi.number().required().description('Redis port is required')
      })
    })
  }),
  logs: Joi.object().keys({
    path: Joi.string().required().description('Path to logging required'),
    mode_configs: Joi.object().keys({
      info: Joi.object().required().description('Info logging config is required'),
      error: Joi.object().required().description('Error logging config is required'),
      console: Joi.object().required().description('Console to logging config is required')
    }).required()
  }).required()
}).unknown()
  .required();

const { error, value: config } = Joi.validate(configData, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

getAbsoluteFolderAndCreateIfNotExist(config.path_uploadfile).then(() => {
  getAbsoluteFolderAndCreateIfNotExist(`${config.path_uploadfile}`)
    .then((pathUpload) => {
      config.pathUpload = pathUpload;
    });
});

module.exports = config;
