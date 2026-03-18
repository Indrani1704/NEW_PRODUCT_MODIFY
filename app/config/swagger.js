const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = require("./swaggerOptions");

const specs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  console.log("🔥 Swagger mounted");

  // ✅ Force redirect from /api-docs/ → /api-docs
  app.get("/api-docs/", (req, res) => {
    res.redirect("/api-docs");
  });

  // ✅ Serve Swagger UI
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
};