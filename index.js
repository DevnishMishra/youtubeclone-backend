import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import videoRoutes from "./routes/videos.js";
import channelRoutes from "./routes/channels.js";
import commentRoutes from "./routes/comments.js";
import mongoose from "mongoose";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ── Connect to MongoDB first, then start server ────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log("MongoDB connection error:", err));

// ── Routes ─────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/channels", channelRoutes);
app.use("/api/comments", commentRoutes);

// ── Health check ───────────────────────────────────────────────────
app.get("/", (req, res) => res.json({ message: "YouTubeClone API running" }));
