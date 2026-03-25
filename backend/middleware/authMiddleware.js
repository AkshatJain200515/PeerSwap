const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function (req, res, next) {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ error: "No token, authorization denied" });
    }

    const decoded = jwt.verify(
      token.replace("Bearer ", ""),
      process.env.JWT_SECRET || "secret"
    );

    req.user = decoded;

    next();
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
};