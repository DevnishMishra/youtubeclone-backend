import express from "express";
import Video from "../models/Video.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Create Video
router.post("/", verifyToken, async (req, res) => {
  try {
    const video = await Video.create({ ...req.body, uploader: req.userId });
    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get All Videos
router.get("/", async (req, res) => {
  const videos = await Video.find();
  res.json(videos);
});

// Update Video
router.put("/:id", verifyToken, async (req, res) => {
  const video = await Video.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(video);
});

// Delete Video
router.delete("/:id", verifyToken, async (req, res) => {
  await Video.findByIdAndDelete(req.params.id);
  res.json({ message: "Video deleted" });
});
// Search by title
router.get("/search/:query", async (req, res) => {
  const videos = await Video.find({
    title: { $regex: req.params.query, $options: "i" },
  });
  res.json(videos);
});

// Filter by category
router.get("/category/:cat", async (req, res) => {
  const videos = await Video.find({ category: req.params.cat });
  res.json(videos);
});

export default router;
