const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const User = require("../models/User");

// In-memory chat store for MVP (replace with DB later)
let chats = [];

// Start a chat / session request
router.post("/start", authMiddleware, async (req, res) => {
  try {
    const { peerId, scheduledTime } = req.body;

    if (!peerId) return res.status(400).json({ error: "Peer ID is required" });

    const chat = {
      id: chats.length + 1,
      from: req.user.id,
      to: peerId,
      scheduledTime: scheduledTime || null,
      messages: [],
    };

    chats.push(chat);

    res.status(201).json(chat);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get all chats for logged-in user
router.get("/", authMiddleware, (req, res) => {
  const userChats = chats.filter(
    (chat) => chat.from === req.user.id || chat.to === req.user.id
  );
  res.json(userChats);
});

// Send message in chat
router.post("/:chatId/message", authMiddleware, (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;

  const chat = chats.find((c) => c.id === parseInt(chatId));
  if (!chat) return res.status(404).json({ error: "Chat not found" });

  chat.messages.push({ from: req.user.id, text: message, timestamp: new Date() });

  res.json(chat);
});

module.exports = router;