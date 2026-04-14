const redis = require("redis");

// Create a Redis client
const redisClient = redis.createClient({
  url: "redis://localhost:6379", // Default local Redis URL
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));
redisClient.on("connect", () => console.log("Redis Connected Successfully"));

// Connect to Redis
const connectRedis = async () => {
  await redisClient.connect();
};

module.exports = { redisClient, connectRedis };
