const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = require("./swaggerOptions");

const specs = swaggerJsDoc(swaggerOptions);

module.exports = (app) => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
     customCss: `
/* Background */
body {
  background-color: #0d1117 !important;
}

.swagger-ui {
  background-color: #0d1117 !important;
  color: #ffffff !important;
  font-family: Inter, system-ui, sans-serif;
}

/* Top bar */
.swagger-ui .topbar {
  background-color: #010409 !important;
  border-bottom: 1px solid #30363d !important;
}

/* Section panels */
.swagger-ui .opblock {
  background-color: #161b22 !important;
  border: 1px solid #30363d !important;
  box-shadow: none !important;
}

/* Titles */
.swagger-ui .opblock-summary-description,
.swagger-ui .info hgroup.main h2 {
  color: #ffffff !important;
}

/* Inputs */
.swagger-ui input,
.swagger-ui textarea,
.swagger-ui select {
  background-color: #0d1117 !important;
  color: #ffffff !important;
  border: 1px solid #e2e9f0 !important;
}

/* Execute button */
.swagger-ui .btn.execute {
  background-color: #238636 !important;
  border-color: #238636 !important;
}

/* HTTP METHOD COLORS */

.swagger-ui .opblock.opblock-get {
  border-left: 4px solid #1f6feb !important;
}

.swagger-ui .opblock.opblock-post {
  border-left: 4px solid #2ea043 !important;
}

.swagger-ui .opblock.opblock-put {
  border-left: 4px solid #d29922 !important;
}

.swagger-ui .opblock.opblock-delete {
  border-left: 4px solid #f85149 !important;
}

.swagger-ui .opblock.opblock-patch {
  border-left: 4px solid #a371f7 !important;
}

/* Code block */
.swagger-ui pre {
  background-color: #010409 !important;
  color: #f8f8f8 !important;
}

/* Response box */
.swagger-ui .responses-inner {
  background-color: #0d1117 !important;
}

/* Authorize button */
.swagger-ui .btn.authorize {
  background-color: #21262d !important;
  color: white !important;
}
`,

    })
  );
};
