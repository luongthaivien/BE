import mongoose from 'mongoose';
import Promise from 'bluebird';

// config should be imported before importing any other file
import config from '../../../initial/config';

const instance = {};

export default class MongoDBConnection {
  constructor(name = 'default') {
    if (typeof instance[name] === 'undefined') {
      const connStr = this.getConnStr(name);
      const mongo = new mongoose.Mongoose();
      mongo.connection.on('connecting', () => {
        console.log(`connecting MongoDB Server ${name}!`);// eslint-disable-line no-console
      });
      mongo.connection.on('connected', () => {
        console.log(`connected MongoDB Server ${name}!`);// eslint-disable-line no-console
      });
      mongo.connection.on('open', () => {
        console.log(`open MongoDB Server ${name}!`);// eslint-disable-line no-console
      });
      mongo.connection.on('disconnecting', () => {
        console.log('disconnecting MongoDB Server !');// eslint-disable-line no-console
      });
      mongo.connection.on('disconnected', () => {
        console.log('disconnected MongoDB Server !\n\n');// eslint-disable-line no-console
      });
      // mongo.connection.on('close', () => {
      //   // console.log('close MongoDB Server !');// eslint-disable-line no-console
      // });
      mongo.connection.on('reconnected', () => {
        console.log('reconnected MongoDB Server !');// eslint-disable-line no-console
      });
      mongo.connection.on('error', () => {
        console.log(`error unable to connect to database: ${connStr}`);// eslint-disable-line no-console
      });
      mongo.connect(connStr, config.databases.mongodb[name]);
      mongo.Promise = Promise;
      instance[name] = mongo;
    }
    return instance[name];
  }

  getConnStr(name) {
    return config.databases.mongodb[name].uri;
  }
}
