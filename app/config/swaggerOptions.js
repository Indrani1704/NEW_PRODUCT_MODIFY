module.exports = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Product API",
      version: "1.0.0",
      description: "Product API documentation",
      contact: {
        name: "indrani",
      },
    },

    servers: [
      {
        url: "/",
        description: "Current server (auto-detect)",
      },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Bearer token needed to access this API",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: [
    "app.js",
    "./app/routes/auth.routes.js",
    "./app/routes/product.routes.js",
  ],
};

