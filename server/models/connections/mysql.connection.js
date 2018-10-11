import Sequelize from 'sequelize';
import config from '../../../initial/config';

const instance = {};

export default class MySQLDBConnection {
  constructor(name = 'default') {
    if (typeof instance[name] === 'undefined') {
      const configOption = this.getConfigOption(name);
      instance[name] = new Sequelize(
        configOption.database,
        configOption.user,
        configOption.password,
        {
          host: configOption.host,
          port: configOption.port,
          dialect: 'mysql',
          query: { raw: true },
          logging: false
        });
    }
    return instance[name];
  }

  getConfigOption(name) {
    return config.databases.mysql[name];
  }
}

