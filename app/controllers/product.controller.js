const Product = require("../models/product.model");
const slugify = require("slugify");


// CREATE PRODUCT
exports.createProduct = async (req, res) => {
  try {
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

    console.log(" Product created");

    res.status(201).json(product);

  } catch (error) {
    console.error(" Create error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE PRODUCT
exports.updateProduct = async (req, res) => {
  try {
    const data = { ...req.body };

    if (req.body?.name) {
      data.slug = slugify(req.body.name, {
        lower: true,
        strict: true,
      });
    }

    if (req.files?.length > 0) {
      data.images = req.files.map((f) => f.filename);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    console.log(" Product updated");

    res.json(product);

  } catch (error) {
    console.error(" Update error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    console.log(" Product deleted");

    res.json({ message: "Product deleted" });

  } catch (error) {
    console.error(" Delete error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


//  USER PRODUCTS (PAGINATION ONLY)
exports.getProducts = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    const limit = 5;

    if (page < 1) page = 1;

    const skip = (page - 1) * limit;

    console.log(` USER PRODUCTS → Page:${page}`);

    const total = await Product.countDocuments({ status: "publish" });
    const totalPages = Math.ceil(total / limit);

    const products = await Product.find({ status: "publish" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      currentPage: page,
      totalPages,
      totalProducts: total,
      products,
    });

  } catch (error) {
    console.error(" Get products:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


//  ADMIN PRODUCTS (PAGINATION ONLY)
exports.getAdminProducts = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    const limit = 5;

    if (page < 1) page = 1;

    const skip = (page - 1) * limit;

    console.log(` ADMIN PRODUCTS → Page:${page}`);

    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const products = await Product.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      currentPage: page,
      totalPages,
      totalProducts: total,
      products,
    });

  } catch (error) {
    console.error(" Admin error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// GET PRODUCT BY SLUG
exports.getProductBySlug = async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug
  }).populate("reviews.user", "email");

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
};


// TOGGLE PUBLISH
exports.togglePublish = async (req, res) => {
  const product = await Product.findById(req.params.id);

  product.status =
    product.status === "publish" ? "unpublish" : "publish";

  await product.save();

  res.json(product);
};


// ADD REVIEW
exports.addReview = async (req, res) => {
  const { comment, rating } = req.body;

  const product = await Product.findById(req.params.id);

  product.reviews.push({
    user: req.user.id,
    comment,
    rating,
  });

  await product.save();

  res.json({ message: "Review added" });
};