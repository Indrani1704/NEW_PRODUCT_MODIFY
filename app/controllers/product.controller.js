const Product = require("../models/product.model");
const slugify = require("slugify");


exports.createProduct = async (req, res) => {
  const images = req.files.map((f) => f.filename);

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
  const data = { ...req.body };

  if (req.body.name) {
    data.slug = slugify(req.body.name, {
      lower: true,
      strict: true,
    });
  }

  if (req.files?.length) {
    data.images = req.files.map((f) => f.filename);
  }

  const product = await Product.findByIdAndUpdate(req.params.id, data, {
    new: true,
  });

  res.json(product);
};


exports.deleteProduct = async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Product deleted" });
};


exports.getProducts = async (req, res) => {
  const { page = 1, limit = 5, search = "" } = req.query;

  const query = {
    $or: [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ],
  };

  const products = await Product.find(query)
    .skip((page - 1) * limit)
    .limit(Number(limit))
    .sort({ createdAt: -1 });

  const total = await Product.countDocuments(query);

  res.json({ total, page: Number(page), products });
};


exports.getProductBySlug = async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product)
    return res.status(404).json({ message: "Product not found" });

  res.json(product);
};
