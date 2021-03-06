const mongoose = require("mongoose");
const config = require("config");
const logger = require("./logging");

module.exports = function () {
  const db = config.get("dbConnection");
  mongoose.connect(db).then(() => logger.info(`Connected to ${db}`));
};
