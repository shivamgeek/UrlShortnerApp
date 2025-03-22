const express = require("express");
const { nanoid } = require("nanoid");
const mongoose = require("mongoose");
const redis = require("redis");

const app = express();
app.use(express.json());

const MONGO_URL = process.env.MONGO_URL || "mongodb://mongo:27017/urlshortener";
const REDIS_URL = process.env.REDIS_URL || "redis://cache:6379";

// Connect to MongoDB
mongoose.connect(MONGO_URL);

// Define a schema and model for URLs
const urlSchema = new mongoose.Schema({
  shortUrl: String,
  longUrl: String,
});
const URL = mongoose.model("URL", urlSchema);

// Connect to Redis
const redisClient = redis.createClient({ url: REDIS_URL });
redisClient.connect();

// API: Shorten a URL
app.post("/api/shorten", async (req, res) => {
  const { longUrl } = req.body;
  if (!longUrl)
    return res.status(400).json({ error: "Please provide a longUrl" });

  // Generate a short URL identifier
  const shortUrl = nanoid(6);

  // Save the mapping to MongoDB
  await URL.create({ shortUrl, longUrl });

  // Cache the result in Redis for 1 hour (3600 seconds)
  await redisClient.setEx(shortUrl, 3600, longUrl);

  res.json({ shortUrl });
});

// API: Get the last 10 shortened URLs (history)
app.get("/api/history", async (req, res) => {
  const urls = await URL.find().sort({ _id: -1 }).limit(10);
  res.json(urls);
});

// API: Redirect from short URL to long URL
app.get("/api/:shortUrl", async (req, res) => {
  const { shortUrl } = req.params;

  // Check Redis cache first
  const cachedUrl = await redisClient.get(shortUrl);
  if (cachedUrl) {
    return res.redirect(cachedUrl);
  }

  // If not in cache, search MongoDB
  const urlEntry = await URL.findOne({ shortUrl });
  if (!urlEntry) {
    return res.status(404).json({ error: "URL not found" });
  }

  // Cache the value and redirect
  await redisClient.setEx(shortUrl, 3600, urlEntry.longUrl);
  res.redirect(urlEntry.longUrl);
});

app.listen(5000, () => console.log("Backend running on port 5000"));
