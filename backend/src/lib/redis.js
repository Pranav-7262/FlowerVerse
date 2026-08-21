import Redis from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisClient = Redis.createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
});

redisClient.on("error", (err) => console.error("Redis Error:", err));
redisClient
  .connect()
  .catch((err) => console.error("Redis Connection Error:", err));

// Get from cache
const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error(`Cache GET error:`, err);
    return null;
  }
};

// Set in cache with TTL
const setCache = async (key, data, ttl = 300) => {
  try {
    await redisClient.setEx(key, ttl, JSON.stringify(data));
  } catch (err) {
    console.error(`Cache SET error:`, err);
  }
};

// Delete cache key
const deleteCache = async (key) => {
  try {
    await redisClient.del(key);
  } catch (err) {
    console.error(`Cache DELETE error:`, err);
  }
};

// Cache middleware for GET requests
const cacheMiddleware = async (req, res, next) => {
  if (req.method !== "GET") return next();

  const key = `${req.method}:${req.originalUrl}`;

  try {
    const cachedData = await getCache(key);
    if (cachedData) {
      console.log(`✅ Cache HIT: ${key}`);
      return res.json(cachedData);
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      setCache(key, data, 300);
      return originalJson(data);
    };
  } catch (err) {
    console.error("Cache middleware error:", err);
  }

  next();
};

// Flush all cache
const flushAll = async () => {
  try {
    await redisClient.flushAll();
    console.log("🗑️  All cache cleared");
  } catch (err) {
    console.error("Cache FLUSH error:", err);
  }
};

export {
  redisClient,
  getCache,
  setCache,
  deleteCache,
  cacheMiddleware,
  flushAll,
};
