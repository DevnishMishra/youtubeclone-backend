import express from "express";
import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────
// CRITICAL: /mine must come BEFORE /:id (same reason as videos.js)
// ─────────────────────────────────────────────────────────────────────

// GET /api/channels/mine — get the logged-in user's channel
// Rubric: Channel page — show logged-in user's own channel
router.get("/mine", verifyToken, async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.userId }).populate(
      "videos",
    );
    res.json(channel); // null if user has no channel yet — frontend handles this
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/channels/:id — get any channel by ID with its videos
// Rubric: Channel Management — fetch channel info
router.get("/:id", async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id).populate("videos");
    if (!channel) return res.status(404).json({ error: "Channel not found" });
    res.json(channel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/channels — create a channel (auth required)
// Rubric: Option to create a channel only after the user is signed in
router.post("/", verifyToken, async (req, res) => {
  try {
    // One channel per user
    const existing = await Channel.findOne({ owner: req.userId });
    if (existing) {
      return res.status(400).json({ error: "You already have a channel" });
    }
    const channel = await Channel.create({ owner: req.userId, ...req.body });
    res.status(201).json(channel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/channels/:id — update channel (owner only)
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ error: "Channel not found" });
    if (channel.owner.toString() !== req.userId)
      return res.status(403).json({ error: "Not authorized" });

    const updated = await Channel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/channels/:id — delete channel (owner only)
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id);
    if (!channel) return res.status(404).json({ error: "Channel not found" });
    if (channel.owner.toString() !== req.userId)
      return res.status(403).json({ error: "Not authorized" });

    await Channel.findByIdAndDelete(req.params.id);
    res.json({ message: "Channel deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
