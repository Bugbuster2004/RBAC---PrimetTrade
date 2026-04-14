require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const { swaggerUI, swaggerSpecs } = require("./config/swagger");
const { connectRedis } = require("./config/redis");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
// CORS must be configured to allow credentials (cookies)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

//Swagger api
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpecs));
// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/tasks", taskRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    connectRedis();
  })
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
