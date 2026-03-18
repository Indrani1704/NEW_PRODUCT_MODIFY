const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const options = require("./swaggerOptions");

const specs = swaggerJsDoc(options);

module.exports = (app) => {
  console.log("🔥 Swagger mounted");

  // ✅ Dynamic server (auto localhost / live)
  app.use(
    "/api-docs",
    (req, res, next) => {
      specs.servers = [
        {
          url: `${req.protocol}://${req.get("host")}`,
          description: "Dynamic server",
        },
      ];
      next();
    },
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,

      // ✅ Hide top error box (clean UI)
      customCss: `
        .swagger-ui .errors-wrapper {
          display: none !important;
        }
      `,
    })
  );
};