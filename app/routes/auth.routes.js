const router = require("express").Router();
const multer = require("multer");
const upload = multer();

const auth = require("../middlewares/auth.middleware");
const admin = require("../middlewares/admin.middleware");

const {
  login,
  refresh,
  register,
  changeRole,
} = require("../controllers/auth.controller");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */


/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register user or admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       201:
 *         description: User created
 */
router.post("/register", upload.none(), register);


/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user or admin
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post("/login", upload.none(), login);


/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token (Admin)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token
 */
router.post("/refresh", upload.none(), refresh);


/**
 * @swagger
 * /api/auth/role/{id}:
 *   patch:
 *     summary: Change user role (Admin only)
 *     tags: [Auth]
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [admin, user]
 *     responses:
 *       200:
 *         description: Role updated
 */
router.patch("/role/:id", auth, admin, changeRole);

module.exports = router;
