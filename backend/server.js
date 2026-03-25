// server.js
const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcryptjs");
const cors = require("cors");
require("dotenv").config();
const authMiddleware = require("./middleware/authMiddleware");
const jwt = require("jsonwebtoken");

// Initialize Express
const app = express();
app.use(cors({
  origin: 'http://localhost:5173'
}));

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

// Routes
const authRoutes = require("./routes/auth");

app.use("/api/auth", authRoutes);

const userRoutes = require("./routes/users");

app.use("/api/users", userRoutes);

const chatRoutes = require("./routes/chat");
app.use("/api/chat", chatRoutes);
// Test route
app.get("/api/test", (req, res) => {
  console.log("Test route hit!");
  res.json({ message: "Backend works" });
});

// Get current logged-in user
app.get("/api/auth/me", authMiddleware, async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});



// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));