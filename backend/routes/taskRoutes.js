const express = require("express");
const router = express.Router();
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  deleteAllTasks,
} = require("../controllers/taskController");
const { protect, authorize } = require("../middleware/authMiddleware");

/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, in-progress, completed]
 *
 * paths:
 *   /api/v1/tasks:
 *     post:
 *       summary: Create a new task
 *       tags: [Tasks]
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       responses:
 *         201:
 *           description: Success
 *
 *     get:
 *       summary: Get all tasks
 *       tags: [Tasks]
 *       responses:
 *         200:
 *           description: Success
 *
 *   /api/v1/tasks/{id}:
 *     put:
 *       summary: Update an existing task
 *       tags: [Tasks]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The task ID
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 *       responses:
 *         200:
 *           description: Success
 *
 *     delete:
 *       summary: Delete a specific task
 *       tags: [Tasks]
 *       parameters:
 *         - in: path
 *           name: id
 *           schema:
 *             type: string
 *           required: true
 *           description: The task ID
 *       responses:
 *         200:
 *           description: Success
 *
 *   /api/v1/tasks/admin/all:
 *     delete:
 *       summary: Delete all tasks (Admin Only)
 *       tags: [Tasks (Admin)]
 *       responses:
 *         200:
 *           description: Success
 */

// All routes below this line require a valid JWT cookie
router.use(protect);

// Standard CRUD routes
router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

// Admin-only route example
router.delete("/admin/all", authorize("admin"), deleteAllTasks);

module.exports = router;
