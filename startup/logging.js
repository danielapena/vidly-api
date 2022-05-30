require("express-async-errors");
winston = require("winston");
const config = require("config");
require("winston-mongodb");

const { combine, timestamp } = winston.format;

module.exports = winston.createLogger({
  format: combine(timestamp(), winston.format.json()),
  transports: [
    new winston.transports.Console({
      handleExceptions: true,
      colorize: true,
      prettyPrint: true,
      level: "error",
    }),
    new winston.transports.MongoDB({
      db: config.get("dbConnection"),
      handleExceptions: true,
      level: "error",
    }),
    new winston.transports.File({
      filename: "error.log",
      level: "error",
      handleExceptions: true,
    }),
  ],
});
