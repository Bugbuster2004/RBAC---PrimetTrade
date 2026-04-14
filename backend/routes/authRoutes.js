const express = require("express");
const { register, login, logout } = require("../controllers/authController");
const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         username:
 *           type: string
 *         password:
 *           type: string
 *         role:
 *           type: string
 *           enum: [user, admin]
 *
 * paths:
 *   /api/v1/auth/register:
 *     post:
 *       summary: Register a new user
 *       tags: [Auth]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       responses:
 *         201:
 *           description: Success
 *
 *   /api/v1/auth/login:
 *     post:
 *       summary: Log in a user
 *       tags: [Auth]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         200:
 *           description: Success
 *
 *   /api/v1/auth/logout:
 *     post:
 *       summary: Log out
 *       tags: [Auth]
 *       responses:
 *         200:
 *           description: Success
 */

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

module.exports = router;
