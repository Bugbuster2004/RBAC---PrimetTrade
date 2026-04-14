const redis = require("redis");

// Create a Redis client
const redisClient = redis.createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379",
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Connected Successfully"));

// Connect to Redis
const connectRedis = async () => {
  await redisClient.connect();
};

module.exports = { redisClient, connectRedis };
