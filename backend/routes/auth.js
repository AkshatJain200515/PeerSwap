const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");


// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", async (req, res) => {
  const { name, email, password, strongSubjects, weakSubjects } = req.body;
  console.log("Incoming registration :", { name, email, strongSubjects, weakSubjects });
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
     const strongSubjectsArray = Array.isArray(strongSubjects)
      ? strongSubjects
      : strongSubjects.split(",").map((s) => s.trim());
    const weakSubjectsArray = Array.isArray(weakSubjects)
      ? weakSubjects
      : weakSubjects.split(",").map((s) => s.trim());
 
    const newUser = await User.create({
      name,
      email,
      password, // ❗ DO NOT hash here
      strongSubjects,
      weakSubjects
    });
     await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  expiresIn: "1d",
});

    res.status(201).json({ token, email: newUser.email, name: newUser.name });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Optional: Login route (you can add later)
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log("LOGIN ATTEMPT:", email);

    const user = await User.findOne({ email });
    console.log("USER FOUND:", user);

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    console.log("PASSWORD MATCH:", isMatch);

    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
});


router.get("/me", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;