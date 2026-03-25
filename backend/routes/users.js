const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// @route   GET /api/users/match
// @desc    Find matching peers
// @access  Private
router.get("/match", authMiddleware, async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id); // full user object
    if (!currentUser) return res.status(404).json({ error: "User not found" });

    // Find all other users
    const users = await User.find({ _id: { $ne: currentUser._id } }).select("-password");

    // Matching logic: complementary subjects both ways
    const matches = users.filter(user => {
      const strongWeakMatch = user.strongSubjects.some(subject => currentUser.weakSubjects.includes(subject));
      const weakStrongMatch = user.weakSubjects.some(subject => currentUser.strongSubjects.includes(subject));
      return strongWeakMatch && weakStrongMatch;
    });

    res.json(matches);
    
router.put("/me", authMiddleware, async (req, res) => {
  try {
    const { name, strongSubjects, weakSubjects } = req.body;

    // Convert comma-separated strings to arrays if needed
    const strongSubjectsArray = Array.isArray(strongSubjects)
      ? strongSubjects
      : strongSubjects.split(",").map((s) => s.trim());

    const weakSubjectsArray = Array.isArray(weakSubjects)
      ? weakSubjects
      : weakSubjects.split(",").map((s) => s.trim());

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name,
        strongSubjects: strongSubjectsArray,
        weakSubjects: weakSubjectsArray,
      },
      { returnDocument: 'after' }
    ).select("-password");

    res.json(updatedUser);
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;