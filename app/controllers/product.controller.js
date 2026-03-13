const Product = require("../models/product.model");
const slugify = require("slugify");


// CREATE PRODUCT
exports.createProduct = async (req, res) => {

  const images = req.files?.map((f) => f.filename) || [];

  const slug = slugify(req.body.name, {
    lower: true,
    strict: true,
  });

  const product = await Product.create({
    ...req.body,
    slug,
    images,
  });

  res.status(201).json(product);

};


// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {

  try {

    const data = req.body ? { ...req.body } : {};

    if (req.body?.name) {
      data.slug = slugify(req.body.name, {
        lower: true,
        strict: true,
      });
    }

    if (req.files && req.files.length > 0) {
      data.images = req.files.map((f) => f.filename);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      });
    }

    res.json(product);

  } catch (err) {

    res.status(500).json({
      message: "Server error"
    });

  }

};


// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {

  await Product.findByIdAndDelete(req.params.id);

  res.json({
    message: "Product deleted"
  });

};


// ⭐ USER PRODUCTS (publish only)
exports.getProducts = async (req, res) => {

  try {

    const products = await Product.find({
      status: "publish"
    }).sort({ createdAt: -1 });

    res.json(products);

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};


// ⭐ ADMIN PRODUCTS (publish + unpublish)
exports.getAdminProducts = async (req, res) => {

  try {

    const products = await Product.find()
      .sort({ createdAt: -1 });

    res.json({
      message: "Admin product list",
      total: products.length,
      products
    });

  } catch (error) {

    res.status(500).json({
      message: "Server error"
    });

  }

};


// GET PRODUCT BY SLUG
exports.getProductBySlug = async (req, res) => {

  const product = await Product.findOne({
    slug: req.params.slug
  }).populate("reviews.user", "email");

  if (!product) {
    return res.status(404).json({
      message: "Product not found"
    });
  }

  res.json(product);

};


// ADMIN PUBLISH / UNPUBLISH
exports.togglePublish = async (req, res) => {

  const product = await Product.findById(req.params.id);

  product.status =
    product.status === "publish"
      ? "unpublish"
      : "publish";

  await product.save();

  res.json(product);

};


// USER REVIEW
exports.addReview = async (req, res) => {

  const { comment, rating } = req.body;

  const product = await Product.findById(req.params.id);

  product.reviews.push({
    user: req.user.id,
    comment,
    rating,
  });

  await product.save();

  res.json({
    message: "Review added"
  });

};