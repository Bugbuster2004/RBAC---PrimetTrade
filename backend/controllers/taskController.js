const Task = require("../models/Task");
const { redisClient } = require("../config/redis"); // Import Redis

// Helper function to create unique cache keys per user
const getCacheKey = (req) => `tasks_${req.user.id}_${req.user.role}`;

// 1. GET TASKS (The Caching Logic)
exports.getTasks = async (req, res) => {
  try {
    const cacheKey = getCacheKey(req);

    // A. Check Redis first
    const cachedTasks = await redisClient.get(cacheKey);
    if (cachedTasks) {
      console.log("Serving from Redis Cache!");
      return res.status(200).json(JSON.parse(cachedTasks));
    }

    // B. If not in Redis, fetch from MongoDB
    console.log("Serving from MongoDB!");
    let tasks;
    if (req.user.role === "admin") {
      tasks = await Task.find().populate("user", "username");
    } else {
      tasks = await Task.find({ user: req.user.id });
    }

    // C. Save the result in Redis for 1 hour (3600 seconds)
    await redisClient.setEx(cacheKey, 3600, JSON.stringify(tasks));

    res.status(200).json(tasks);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching tasks", error: error.message });
  }
};

// 2. CREATE TASK (Cache Invalidation)
exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const task = new Task({ title, description, status, user: req.user.id });
    await task.save();

    // CLEAR CACHE: Because data changed, we delete the old cached list
    await redisClient.del(getCacheKey(req));
    if (req.user.role !== "admin") {
      // Also clear admin cache so they see the new user task
      await redisClient.del(`tasks_${req.user.id}_admin`);
    }

    res.status(201).json(task);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating task", error: error.message });
  }
};

// 3. DELETE TASK (Cache Invalidation)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    await task.deleteOne();

    // CLEAR CACHE
    await redisClient.del(getCacheKey(req));

    res.status(200).json({ message: "Task removed" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting task", error: error.message });
  }
};

// 4. UPDATE TASK (Cache Invalidation)
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    // CLEAR CACHE
    await redisClient.del(getCacheKey(req));

    res.status(200).json(updatedTask);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating task", error: error.message });
  }
};

// 5. DELETE ALL TASKS (Admin Only)
exports.deleteAllTasks = async (req, res) => {
  try {
    await Task.deleteMany({});

    // CLEAR CACHE: Since all tasks are gone, we clear the entire Redis cache
    // to ensure no users see old, deleted tasks.
    await redisClient.flushDb();

    res.status(200).json({ message: "All tasks deleted by Admin" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting tasks", error: error.message });
  }
};
