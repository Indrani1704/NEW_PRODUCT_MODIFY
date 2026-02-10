const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comment: String,
    rating: Number,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    price: Number,
    category: String,

    status: {
      type: String,
      enum: ["publish", "unpublish"],
      default: "unpublish",
    },

    images: [String],

    reviews: [reviewSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
