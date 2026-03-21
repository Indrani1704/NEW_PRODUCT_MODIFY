const express = require("express");
const router = express.Router();

const multer = require("multer"); // ✅ ADD THIS
const upload = multer(); // ✅ for form-data (text only)

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/category.controller");

const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");


/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get categories (All OR Paginated)
 *     tags: [Categories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: false
 *         description: If provided → pagination, else → all categories
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", getCategories);








/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:   # ✅ KEEP THIS
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Fashion
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Category already exists
 *       401:
 *         description: Unauthorized
 */
router.post("/", auth, admin, upload.none(), createCategory); // ✅ FIXED


/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:   # ✅ KEEP THIS
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Updated Category
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */
router.put("/:id", auth, admin, upload.none(), updateCategory); // ✅ FIXED


/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete category (Admin only)
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */
router.delete("/:id", auth, admin, deleteCategory);


module.exports = router;