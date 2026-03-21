const Product = require("../models/product.model");
const Category = require("../models/category.model"); // ✅ IMPORTANT

const mongoose = require("mongoose");

const slugify = require("slugify");


exports.createProduct = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILES:", req.files);

    const { name, price, category } = req.body;

    // ✅ Basic validation
    if (!name || !price || !category) {
      return res.status(400).json({
        message: "Name, price and category are required",
      });
    }

    let categoryId = category;

    // ✅ Check if category is NOT ObjectId → find by name or slug
    if (!mongoose.Types.ObjectId.isValid(category)) {
      const categoryData = await Category.findOne({
        $or: [
          { name: category },
          { slug: slugify(category, { lower: true, strict: true }) },
        ],
      });

      if (!categoryData) {
        return res.status(400).json({
          message: "Invalid category (not found by name or slug)",
        });
      }

      categoryId = categoryData._id;
    } else {
      // ✅ If ObjectId → verify existence
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({
          message: "Invalid category ID",
        });
      }
    }

    // ✅ Images
    const images = req.files?.map((f) => f.filename) || [];

    // ✅ Slug
    const slug = slugify(name, {
      lower: true,
      strict: true,
    });

    // ✅ Create product
    const product = await Product.create({
      name,
      price,
      category: categoryId, // ✅ ALWAYS ObjectId stored
      slug,
      images,
      description: req.body.description || "",
      status: req.body.status || "unpublish",
    });

    console.log("✅ Product created:", product);

    res.status(201).json(product);

  } catch (error) {
    console.error("❌ FULL ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


exports.updateProduct = async (req, res) => {
  try {
    const data = { ...req.body };

    console.log("BODY:", req.body);

    // ✅ Slug update
    if (req.body?.name) {
      data.slug = slugify(req.body.name, {
        lower: true,
        strict: true,
      });
    }

    // ✅ CATEGORY FIX (🔥 MAIN FIX HERE)
    if (req.body.category && req.body.category.trim() !== "") {
      let categoryId = req.body.category;

      // If NOT ObjectId → find by name/slug
      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        const categoryData = await Category.findOne({
          $or: [
            { name: categoryId },
            {
              slug: slugify(categoryId, {
                lower: true,
                strict: true,
              }),
            },
          ],
        });

        if (!categoryData) {
          return res.status(400).json({
            message: "Invalid category",
          });
        }

        categoryId = categoryData._id;
      } else {
        // Validate ObjectId exists
        const exists = await Category.findById(categoryId);
        if (!exists) {
          return res.status(400).json({
            message: "Invalid category ID",
          });
        }
      }

      data.category = categoryId;
    } else {
      // ✅ IMPORTANT: remove empty category
      delete data.category;
    }

    // ✅ Images update
    if (req.files?.length > 0) {
      data.images = req.files.map((f) => f.filename);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      data,
      { new: true }
    ).populate("category", "name slug");

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    console.log("✅ Product updated");

    res.json(product);

  } catch (error) {
    console.error("❌ FULL UPDATE ERROR:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};


// ✅ DELETE PRODUCT
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    console.log("✅ Product deleted");

    res.json({ message: "Product deleted" });

  } catch (error) {
    console.error("❌ Delete error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ USER PRODUCTS (PAGINATION + CATEGORY)
exports.getProducts = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    const limit = 5;

    if (page < 1) page = 1;

    const skip = (page - 1) * limit;

    console.log(`👤 USER PRODUCTS → Page:${page}`);

    const total = await Product.countDocuments({ status: "publish" });
    const totalPages = Math.ceil(total / limit);

    const products = await Product.find({ status: "publish" })
      .populate("category", "name slug") // ✅ FIXED
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
    console.error("❌ Get products:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ ADMIN PRODUCTS (PAGINATION + CATEGORY)
exports.getAdminProducts = async (req, res) => {
  try {
    let page = parseInt(req.query.page) || 1;
    const limit = 5;

    if (page < 1) page = 1;

    const skip = (page - 1) * limit;

    console.log(`🛠 ADMIN PRODUCTS → Page:${page}`);

    const total = await Product.countDocuments();
    const totalPages = Math.ceil(total / limit);

    const products = await Product.find()
      .populate("category", "name slug") // ✅ FIXED
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
    console.error("❌ Admin error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


// ✅ GET PRODUCT BY SLUG (WITH CATEGORY + USER)
exports.getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({
      slug: req.params.slug,
    })
      .populate("category", "name slug") // ✅ FIXED
      .populate("reviews.user", "email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


exports.togglePublish = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        status: product.status === "publish" ? "unpublish" : "publish",
      },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    console.error("❌ Toggle error:", error);
    res.status(500).json({
      message: "Toggle failed",
      error: error.message,
    });
  }
};

// ✅ ADD REVIEW
exports.addReview = async (req, res) => {
  try {
    const { comment, rating } = req.body;

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          reviews: {
            user: req.user.id,
            comment,
            rating,
          },
        },
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Review added", product: updated });

  } catch (error) {
    console.error("❌ Review error:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};