require("express-async-errors");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const debug = require("debug")("app:startup");
const morgan = require("morgan");

const app = express();
require("./startup/routes")(app);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: JWT private key not defined");
  process.exit(1);
}

mongoose
  .connect(config.get("dbConnection"))
  .then(() => console.log("Connected to MongoDB"))
  .catch(() => console.error("Failed to connect to DB"));

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
