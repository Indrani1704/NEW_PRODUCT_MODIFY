const Category = require("../models/category.model");
const slugify = require("slugify");


// CREATE
exports.createCategory = async (req, res) => {
  try {
    const slug = slugify(req.body.name, { lower: true });

    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ message: "Category exists" });
    }

    const category = await Category.create({
      name: req.body.name,
      slug,
    });

    console.log(" Category created");

    res.status(201).json(category);

  } catch (error) {
    console.error(" Category error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// GET (PAGINATION)
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

    console.log(` Categories → Page ${page}`);

    res.json({
      currentPage: page,
      totalPages,
      totalCategories: total,
      categories,
    });

  } catch (error) {
    console.error(" Fetch categories error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// UPDATE
exports.updateCategory = async (req, res) => {
  try {
    const slug = slugify(req.body.name, { lower: true });

    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name, slug },
      { new: true }
    );

    if (!category) {
      return res.status(404).json({ message: "Not found" });
    }

    res.json(category);

  } catch (error) {
    console.error(" Update category:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// DELETE
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: "Deleted" });

  } catch (error) {
    console.error(" Delete category:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};