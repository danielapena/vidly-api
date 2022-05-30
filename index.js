require("express-async-errors");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const debug = require("debug")("app:startup");
const morgan = require("morgan");

const app = express();

require("./startup/routes")(app);
require("./startup/db")();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: JWT private key not defined");
  process.exit(1);
}

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
