module.exports = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "Product API",
      version: "1.0.0",
      description: "Product & Category API documentation",
      contact: {
        name: "Indrani",
      },
    },

    tags: [
      { name: "Products", description: "Product APIs" },
      { name: "Categories", description: "Category APIs" },
      { name: "Auth", description: "Authentication APIs" },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      // ✅ FIXED SCHEMAS (NO MORE ERROR)
      schemas: {
        Category: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            slug: { type: "string" },
          },
        },

        CategoryPagination: {
          type: "object",
          properties: {
            currentPage: { type: "integer", example: 1 },
            totalPages: { type: "integer", example: 5 },
            totalCategories: { type: "integer", example: 20 },
            categories: {
              type: "array",
              items: {
                $ref: "#/components/schemas/Category",
              },
            },
          },
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./app/routes/**/*.js"],
};