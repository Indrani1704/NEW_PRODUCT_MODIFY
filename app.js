require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./app/config/db");
const swagger = require("./app/config/swagger.js");

const authRoutes = require("./app/routes/auth.routes");
const productRoutes = require("./app/routes/product.routes");
const categoryRoutes = require("./app/routes/category.routes");

const app = express();

// ✅ VERY IMPORTANT (for deployment behind proxy)
app.set("trust proxy", 1);

// Connect database
connectDB();

// ✅ Middleware
app.use(cors());

// ✅ Body parsers (CORRECT)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Static files
app.use("/uploads", express.static("uploads"));

// ✅ Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);

// ✅ Test route
app.get("/check", (req, res) => {
  res.send("Server working");
});

// ✅ Swagger
swagger(app);

// ✅ Root route (dynamic URL)
app.get("/", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;

  res.json({
    status: "API Running",
    docs: `${baseUrl}/api-docs`, // ✅ dynamic
  });
});

// ✅ Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});