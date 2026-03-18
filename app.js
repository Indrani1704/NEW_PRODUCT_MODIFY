require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./app/config/db");
const swagger = require("./app/config/swagger.js");

const authRoutes = require("./app/routes/auth.routes");
const productRoutes = require("./app/routes/product.routes");
const categoryRoutes = require("./app/routes/category.routes");

const app = express();

// Connect database
connectDB();


// Middleware
app.use(cors());

app.use(express.json()); // parse application/json

app.use(express.urlencoded({ extended: true })); // parse urlencoded

// Static files
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);


// Swagger Docs
swagger(app);


// Health Check Route (optional but useful)
app.get("/", (req, res) => {
  res.json({
    status: "API Running",
    docs: `http://localhost:${process.env.PORT || 5000}/api-docs`
  });
});


// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  console.log(` Swagger Docs: http://localhost:${PORT}/api-docs`);
});