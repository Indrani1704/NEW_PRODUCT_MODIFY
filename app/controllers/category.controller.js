const Category = require("../models/category.model");
const Product = require("../models/product.model"); // ✅ for safe delete
const slugify = require("slugify");


exports.createCategory = async (req, res) => {
  try {
    // ✅ safe destructuring
    const name = req.body?.name;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const exists = await Category.findOne({
      $or: [{ name }, { slug }],
    });

    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({ name, slug });

    res.status(201).json(category);

  } catch (error) {
    console.error("❌ Category error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ GET CATEGORIES (PAGINATION)
exports.getCategories = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    const limit = 5;

    if (page < 1) page = 1;

    const skip = (page - 1) * limit;

    const total = await Category.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const categories = await Category.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    console.log(`📦 Categories → Page ${page}`);

    res.json({
      currentPage: page,
      totalPages,
      totalCategories: total,
      categories,
    });

  } catch (error) {
    console.error("❌ Fetch categories error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const slug = slugify(name, { lower: true, strict: true });

    // ✅ prevent duplicate on update
    const exists = await Category.findOne({
      _id: { $ne: req.params.id },
      $or: [{ name }, { slug }],
    });

    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, slug },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    console.log("✅ Category updated");

    res.json(category);

  } catch (error) {
    console.error("❌ Update category:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ DELETE CATEGORY (SAFE DELETE)
exports.deleteCategory = async (req, res) => {
  try {
    // ✅ Check if category is used in products
    const productsUsing = await Product.findOne({
      category: req.params.id,
    });

    if (productsUsing) {
      return res.status(400).json({
        message: "Cannot delete category (used in products)",
      });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    console.log("✅ Category deleted");

    res.json({ message: "Category deleted" });

  } catch (error) {
    console.error("❌ Delete category:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};