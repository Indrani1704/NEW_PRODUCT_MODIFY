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
/* BACKGROUND */
body {
  background-color: #0d1117 !important;
}

.swagger-ui {
  background-color: #0d1117 !important;
  color: #ffffff !important;
  font-family: Inter, system-ui, sans-serif;
}

/* TOP BAR */
.swagger-ui .topbar {
  background-color: #010409 !important;
  border-bottom: 1px solid #30363d !important;
}

/* SECTION BLOCK */
.swagger-ui .opblock {
  background-color: #161b22 !important;
  border: 1px solid #30363d !important;   /* GRAY BORDER */
  box-shadow: none !important;
}

/* ENDPOINT TEXT */
.swagger-ui .opblock-summary-path,
.swagger-ui .opblock-summary-description,
.swagger-ui .opblock-summary-method,
.swagger-ui .info hgroup.main h2 {
  color: #ffffff !important;   /* WHITE TEXT */
}

/* INPUTS */
.swagger-ui input,
.swagger-ui textarea,
.swagger-ui select {
  background-color: #0d1117 !important;
  color: #ffffff !important;
  border: 1px solid #30363d !important;
}

/* EXECUTE BUTTON */
.swagger-ui .btn.execute {
  background-color: #238636 !important;
  border-color: #238636 !important;
  color: white !important;
}

/* AUTHORIZE BUTTON */
.swagger-ui .btn.authorize {
  background-color: #1f6feb !important;
  color: white !important;
}

/* HTTP METHOD LEFT BORDER COLORS */
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

/* RESPONSE PANEL */
.swagger-ui .responses-inner {
  background-color: #0d1117 !important;
  border: 1px solid #30363d !important;
}

/* CODE BLOCK */
.swagger-ui pre {
  background-color: #010409 !important;
  color: #ffffff !important;
  border: 1px solid #646a72 !important;
}
`,

    })
  );
};
