import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Video from "./models/Video.js";
import Channel from "./models/Channel.js";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

async function seed() {
  await User.deleteMany();
  await Video.deleteMany();
  await Channel.deleteMany();

  const user = await User.create({
    username: "JohnDoe",
    email: "john@example.com",
    password: "123456",
  });
  const channel = await Channel.create({
    channelName: "Code with John",
    owner: user._id,
  });
  await Video.create({
    title: "Learn React",
    uploader: user._id,
    channelId: channel._id,
    thumbnailUrl: "https://example.com/react.png",
  });
  console.log("Database seeded");
  process.exit();
}

seed();
