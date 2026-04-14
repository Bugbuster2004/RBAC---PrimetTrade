const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Task Manager API",
      version: "1.0.0",
      description:
        "API documentation for the backend assignment. **Note on Authentication:** This API uses HTTP-Only cookies. To test protected routes here, first use the Login route to set the cookie in your browser.",
    },
    servers: [{ url: "http://localhost:5000" }],
  },
  // IMPORTANT: This path is relative to the root directory where server.js runs!
  apis: ["./routes/*.js"],
};

const swaggerSpecs = swaggerJsDoc(swaggerOptions);

// Export the UI and the generated specs so server.js can use them
module.exports = { swaggerUI, swaggerSpecs };
