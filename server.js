const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

// Redis Client Setup
const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

redisClient.connect()
  .then(() => console.log("Connected to Redis"))
  .catch(err => console.error("Redis connection error:", err));

// Mongoose Model
const UserSchema = new mongoose.Schema({
  name: String,
  email: String
});
const User = mongoose.model("User", UserSchema);

// Middleware for Redis Caching
async function cache(req, res, next) {
  const email = req.params.email;
  const data = await redisClient.get(email);
  
  if (data) {
    console.log("Cache hit");
    return res.json(JSON.parse(data));
  } else {
    console.log("Cache miss");
    next();
  }
}

// API Routes
app.get("/user/:email", cache, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Store in cache
    await redisClient.set(req.params.email, JSON.stringify(user), { EX: 60 }); // Cache for 60 seconds
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/user", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

