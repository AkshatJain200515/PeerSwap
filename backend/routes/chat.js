const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const authMiddleware = require("../middleware/authMiddleware");

// Get all chats for current user
router.get("/", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const chats = await Chat.find({ participants: userId })
    .populate("participants", "name email")
    .populate("messages.sender", "name email");
  res.json(chats);
});

// Get a specific chat by ID
router.get("/:id", authMiddleware, async (req, res) => {
  const chat = await Chat.findById(req.params.id)
    .populate("participants", "name email")
    .populate("messages.sender", "name email");
  if (!chat) return res.status(404).json({ error: "Chat not found" });
  res.json(chat);
});

// Send message in chat
router.post("/:id/message", authMiddleware, async (req, res) => {
  const { text } = req.body;
  const chat = await Chat.findById(req.params.id);
  if (!chat) return res.status(404).json({ error: "Chat not found" });

  const message = { sender: req.user.id, text };
  chat.messages.push(message);
  await chat.save();

  res.json(message);
});

// Start or get 1-on-1 chat
router.post("/start", authMiddleware, async (req, res) => {
  const { participantId } = req.body;
  const userId = req.user.id;

  let chat = await Chat.findOne({
    participants: { $all: [userId, participantId], $size: 2 },
  });

  if (!chat) {
    chat = await Chat.create({ participants: [userId, participantId], messages: [] });
  }

  chat = await chat.populate("participants", "name email");
  res.json(chat);
});

module.exports = router;