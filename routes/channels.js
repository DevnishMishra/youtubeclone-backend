import express from "express";
import Channel from "../models/Channel.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Create Channel
router.post("/", verifyToken, async (req, res) => {
  const channel = await Channel.create({ owner: req.userId, ...req.body });
  res.status(201).json(channel);
});

// Get Channel by ID
router.get("/:id", async (req, res) => {
  const channel = await Channel.findById(req.params.id).populate("videos");
  res.json(channel);
});

// Update Channel
router.put("/:id", verifyToken, async (req, res) => {
  const channel = await Channel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(channel);
});

// Delete Channel
router.delete("/:id", verifyToken, async (req, res) => {
  await Channel.findByIdAndDelete(req.params.id);
  res.json({ message: "Channel deleted" });
});

export default router;
