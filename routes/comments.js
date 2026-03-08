import express from "express";
import Comment from "../models/Comment.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Add Comment
router.post("/", verifyToken, async (req, res) => {
  const comment = await Comment.create({ userId: req.userId, ...req.body });
  res.status(201).json(comment);
});

// Get comments by video
router.get("/:videoId", async (req, res) => {
  const comments = await Comment.find({ videoId: req.params.videoId });
  res.json(comments);
});

// Update Comment
router.put("/:id", verifyToken, async (req, res) => {
  const comment = await Comment.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(comment);
});

// Delete Comment
router.delete("/:id", verifyToken, async (req, res) => {
  await Comment.findByIdAndDelete(req.params.id);
  res.json({ message: "Comment deleted" });
});

export default router;
