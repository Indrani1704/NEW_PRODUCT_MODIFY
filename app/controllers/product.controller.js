const Product = require("../models/product.model");
const slugify = require("slugify");

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

exports.updateProduct = async (req, res) => {
  try {
    // SAFE default object
    const data = req.body ? { ...req.body } : {};

    // safe slug creation
    if (req.body?.name) {
      data.slug = slugify(req.body.name, {
        lower: true,
        strict: true,
      });
    }

    // safe image update
    if (req.files && req.files.length > 0) {
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

    res.json(product);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};



// ⭐ ADVANCED SEARCH + FILTER
exports.getProducts = async (req, res) => {
  const {
    name,
    category,
    startDate,
    endDate,
    page = 1,
    limit = 10,
  } = req.query;

  let query = { status: "publish" };

  if (name) query.name = { $regex: name, $options: "i" };

  if (category) query.category = category;

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (page - 1) * limit;

  const products = await Product.find(query)
    .skip(skip)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(query);

  res.json({
    page: Number(page),
    limit: Number(limit),
    total,
    totalPages: Math.ceil(total / limit),
    products,
  });
};



exports.getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug })
    .populate("reviews.user", "email");

  if (!product)
    return res.status(404).json({ message: "Product not found" });

  res.json(product);
};



// ⭐ ADMIN publish/unpublish
exports.togglePublish = async (req, res) => {
  const product = await Product.findById(req.params.id);

  product.status =
    product.status === "publish" ? "unpublish" : "publish";

  await product.save();

  res.json(product);
};



// ⭐ USER REVIEW
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
