const helmet = require("helmet");
const compression = require("compression");

module.exports = function (app) {
  app.user(helmet());
  app.use(compression());
};
