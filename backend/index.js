import express from "express";
import OpenAI from "openai";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import MessageModel from "./schema/schema.js";
import cors from 'cors';

dotenv.config();

const app = express();

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

app.get("/conversation", async (req, res) => {
  const allMessages = await MessageModel.find();
  return res.json({
    status: 200,
    data: {
      messages: allMessages,
    },
  });
});

// API for conversation
app.post("/conversation", async (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).json({
      status: 400,
      message: "Message cannot be empty!",
    });
  }

  const newMessage = new MessageModel({
    role: "user",
    content: message,
  });
  const newMessageResp = await newMessage.save();

  return res.json({
    status: 200,
    data: {
      message: newMessageResp,
    },
  });

  // Calling the OpenAI API to complete the message
  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo",
    });
    if (
      Array.isArray(chatCompletion.choices) &&
      chatCompletion.choices.length > 0
    ) {
      return res.status(200).json({
        status: 200,
        data: {
          content: chatCompletion.choices[0]?.message?.content ?? "No reply",
        },
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: "No reply",
      });
    }
  } catch (err) {
    return res.status(500).json({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

// Starting the Express app and listening on port 3000
app.listen(5000, () => {
  console.log("Conversational ChatBot listening on port 5000!");
});
