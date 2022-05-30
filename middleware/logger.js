winston = require("winston");
const config = require("config");
require("winston-mongodb");

const { combine, timestamp } = winston.format;

const logger = winston.createLogger({
  format: combine(timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
    }),
    new winston.transports.MongoDB({
      db: config.get("dbConnection"),
      handleExceptions: true,
    }),
    new winston.transports.File({ filename: "error.log", level: "error" }),
  ],
});

module.exports = logger;
