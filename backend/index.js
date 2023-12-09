import express from "express";
import OpenAI from "openai";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import MessageModel from "./schema/schema.js";
import cors from "cors";
import { Server } from "socket.io";
import { createServer } from "http";

dotenv.config();

const PORT = process.env.PORT || 3003;

const app = express();
const httpServer = createServer(app);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

// OpenAI configuration.
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Connect with MongoDB.
const mongodbConnectionUrl = process.env.MONGODB_CONNECTION_URL;
mongoose.connect(mongodbConnectionUrl);

const db = mongoose.connection;
db.once("open", () => {
  console.log("DB connected");
});
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// setup Socket.io
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  },
});
// registering client events
io.on("connection", (socket) => {
  socket.on("user-message", async (messageString) => {
    const newMessage = new MessageModel({
      role: "user",
      content: messageString,
    });
    const newMessageResp = await newMessage.save();
    io.emit("user-message-ack", newMessageResp);
    getInTouchWithOpenAI(newMessageResp.role, newMessageResp.content);
  });
});

app.get("/conversation", async (req, res) => {
  const allMessages = await MessageModel.find()
    .limit(20)
    .sort({ timestamp: -1 });
  return res.json({
    status: 200,
    data: {
      messages: allMessages,
    },
  });
});

const getInTouchWithOpenAI = async (role, messageString) => {
  let previousMessages = await MessageModel.find()
    .limit(3)
    .skip(1)
    .sort({ timestamp: -1 });
  previousMessages = previousMessages.map((previousMessage) => ({
    role: previousMessage.role,
    content: previousMessage.content,
  }));

  // Calling the OpenAI API to complete the message
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [...previousMessages, { role, content: messageString }],
      model: "gpt-3.5-turbo",
    });

    if (
      Array.isArray(chatCompletion.choices) &&
      chatCompletion.choices.length > 0
    ) {
      const newMessage = new MessageModel({
        role: "assistant",
        content: chatCompletion.choices[0]?.message?.content ?? "No reply",
      });
      const newMessageResp = await newMessage.save();
      io.emit("assistant-message", newMessageResp);
    } else {
      io.emit("assistant-error", "Something went wrong");
    }
  } catch (err) {
    io.emit("assistant-error", "Something went wrong");
  }
};

httpServer.listen(PORT);
