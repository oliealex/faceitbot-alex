const dotenv = require('dotenv');
const winston = require('winston');
require('winston-daily-rotate-file');

dotenv.config();

const loggerLevel = process.env.LOGGING_LEVEL !== (undefined || null)
  ? process.env.LOGGING_LEVEL : 'debug';

const fileTransport = new winston.transports.DailyRotateFile({
  filename: 'bot-logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: false,
  maxSize: '5m',
  maxFiles: '1d',
});

const consoleTransport = new winston.transports.Console({
  format: winston.format.simple(),
});

module.exports = winston.createLogger({
  level: loggerLevel,
  transports: [
    fileTransport,
    consoleTransport,
  ],
});