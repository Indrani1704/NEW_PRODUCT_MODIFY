const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, index: true },
    price: Number,
    description: String,
    images: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
