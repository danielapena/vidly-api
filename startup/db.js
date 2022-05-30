const mongoose = require("mongoose");
const config = require("config");
const logger = require("../middleware/logger");

module.exports = function () {
  mongoose
    .connect(config.get("dbConnection"))
    .then(() => logger.info("Connected to MongoDB"));
};
