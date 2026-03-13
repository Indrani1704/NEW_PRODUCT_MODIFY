const router = require("express").Router();
const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");
const upload = require("../helper/multer.middleware");
const controller = require("../controllers/product.controller");

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         description:
 *           type: string
 *         category:
 *           type: string
 *         status:
 *           type: string
 *           example: publish
 *         images:
 *           type: array
 *           items:
 *             type: string
 */


/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get products (User → publish only)
 *     tags: [Products]
 

 *     responses:
 *       200:
 *         description: Products fetched successfully
 */
router.get("/",  controller.getProducts);



/**
 * @swagger
 * /api/products/admin/products:
 *   get:
 *     summary: Admin view all products (publish + unpublish)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin products fetched
 */
router.get("/admin/products", auth, admin, controller.getAdminProducts);



/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create product (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *                 example: publish
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product created
 */
router.post("/", auth, admin, upload.array("images", 5), controller.createProduct);



/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update product (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               status:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put("/:id", auth, admin, upload.array("images", 5), controller.updateProduct);



/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete product (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete("/:id", auth, admin, controller.deleteProduct);



/**
 * @swagger
 * /api/products/publish/{id}:
 *   patch:
 *     summary: Publish or Unpublish product (Admin)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product publish status toggled
 */
router.patch("/publish/:id", auth, admin, controller.togglePublish);



/**
 * @swagger
 * /api/products/review/{id}:
 *   post:
 *     summary: Add product review
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - comment
 *               - rating
 *             properties:
 *               comment:
 *                 type: string
 *                 example: Great product
 *               rating:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Review added
 */
router.post("/review/:id", auth, upload.none(), controller.addReview);



/**
 * @swagger
 * /api/products/slug/{slug}:
 *   get:
 *     summary: Get product by slug
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product fetched successfully
 */
router.get("/slug/:slug", controller.getProductBySlug);

module.exports = router;