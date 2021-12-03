const debug = require("debug")("app:startup");
const logger = require("./middleware/logger");
const morgan = require("morgan");
const express = require("express");
const helmet = require("helmet");
const genres = require("./routes/genres");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/api/genres", genres);
app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan enabled...");
}

app.use(logger);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}`));
