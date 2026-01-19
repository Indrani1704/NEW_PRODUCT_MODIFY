const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const config = require("./app/config/swagger.config");

module.exports = (app) => {
  const specs = swaggerJsDoc(config);
  app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
};
