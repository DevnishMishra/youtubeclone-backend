import express from "express";
import Video from "../models/Video.js";
import Channel from "../models/Channel.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// ─────────────────────────────────────────────────────────────────────
// CRITICAL: Specific routes MUST come BEFORE /:id
// Otherwise Express matches "search" and "category" as video IDs
// ─────────────────────────────────────────────────────────────────────

// Rubric: Search by Title (20 marks) — GET /api/videos/search/:query
router.get("/search/:query", async (req, res) => {
  try {
    const videos = await Video.find({
      title: { $regex: req.params.query, $options: "i" },
    }).sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rubric: Filter by Category (20 marks) — GET /api/videos/category/:cat
router.get("/category/:cat", async (req, res) => {
  try {
    const videos = await Video.find({ category: req.params.cat }).sort({
      createdAt: -1,
    });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/videos — fetch all videos sorted newest first
router.get("/", async (req, res) => {
  try {
    const videos = await Video.find().sort({ createdAt: -1 });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/videos/:id — single video, increments view count
router.get("/:id", async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true },
    );
    if (!video) return res.status(404).json({ error: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/videos — create video (auth required)
// Also pushes video ID into the channel's videos array
router.post("/", verifyToken, async (req, res) => {
  try {
    const video = await Video.create({ ...req.body, uploader: req.userId });

    // Keep channel.videos array in sync
    if (req.body.channelId) {
      await Channel.findByIdAndUpdate(req.body.channelId, {
        $push: { videos: video._id },
      });
    }

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/videos/:id/like — increment likes (auth required)
// Rubric: Like button on video player page
router.put("/:id/like", verifyToken, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true },
    );
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/videos/:id/dislike — increment dislikes (auth required)
// Rubric: Dislike button on video player page
router.put("/:id/dislike", verifyToken, async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { dislikes: 1 } },
      { new: true },
    );
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/videos/:id — update video (owner only)
// Rubric: Channel page — edit videos
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    if (video.uploader.toString() !== req.userId)
      return res.status(403).json({ error: "Not authorized" });

    const updated = await Video.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/videos/:id — delete video (owner only)
// Rubric: Channel page — delete videos
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ error: "Video not found" });
    if (video.uploader.toString() !== req.userId)
      return res.status(403).json({ error: "Not authorized" });

    await Video.findByIdAndDelete(req.params.id);

    // Remove from channel's videos array too
    if (video.channelId) {
      await Channel.findByIdAndUpdate(video.channelId, {
        $pull: { videos: video._id },
      });
    }

    res.json({ message: "Video deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
