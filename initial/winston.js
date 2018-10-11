import winston from 'winston';
import path from 'path';
import fs from 'fs';
import config from './config';

const logDir = path.join(__dirname, config.logs.path);
const getTransport = (modeConfig) => {
  switch (modeConfig.mode) {
    case 'file':
      if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
      }
      modeConfig.option.filename =
        path.join(logDir, modeConfig.option.filename);
      return new (winston.transports.File)(modeConfig.option);
    case 'mongo':
      return new (winston.transports.MongoDB)(modeConfig.option);
    case 'console':
      return new (winston.transports.Console)(modeConfig.option);
    default:
      return null;
  }
};

export const loggerInfo = new (winston.Logger)({
  transports: [getTransport(config.logs.mode_configs.info)]
});

export const loggerError = new (winston.Logger)({
  transports: [getTransport(config.logs.mode_configs.error)]
});
export const loggerConsole = new (winston.Logger)({
  transports: [getTransport(config.logs.mode_configs.console)]
});
