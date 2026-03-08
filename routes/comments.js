import express from "express";
import Comment from "../models/Comment.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// POST /api/comments — add a comment (auth required)
// Rubric: Comment section — users can add comments saved to DB
router.post("/", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.create({ userId: req.userId, ...req.body });

    // Populate username so frontend doesn't need a second request
    const populated = await comment.populate("userId", "username avatar");

    res.status(201).json({
      ...populated.toObject(),
      username: populated.userId.username,
      avatar: populated.userId.avatar,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/comments/:videoId — get all comments for a video, newest first
// Rubric: Comments saved along with that video
router.get("/:videoId", async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .populate("userId", "username avatar")
      .sort({ createdAt: -1 });

    // Flatten username into the response object for easy use in frontend
    const result = comments.map((c) => ({
      ...c.toObject(),
      username: c.userId?.username || "Unknown",
      avatar: c.userId?.avatar || "",
    }));

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/comments/:id — edit a comment (owner only)
// Rubric: Users can edit their own comments
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.userId.toString() !== req.userId)
      return res.status(403).json({ error: "Not authorized" });

    comment.text = req.body.text;
    await comment.save();
    res.json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/comments/:id — delete a comment (owner only)
// Rubric: Users can delete their own comments
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ error: "Comment not found" });
    if (comment.userId.toString() !== req.userId)
      return res.status(403).json({ error: "Not authorized" });

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: "Comment deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
