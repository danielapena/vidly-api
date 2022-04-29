const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const express = require("express");
const debug = require("debug")("app:startup");
const morgan = require("morgan");
const helmet = require("helmet");

const logger = require("./middleware/logger");

const genres = require("./routes/genres");
const users = require("./routes/users");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const auth = require("./routes/auth");

const app = express();

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: JWT private key not defined");
  process.exit(1);
}

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB"))
  .catch(() => console.error("Failed to connect to DB"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}

app.use(logger);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
