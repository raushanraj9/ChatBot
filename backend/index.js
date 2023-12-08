const express = require("express");
const OpenAI = require("openai");

require("dotenv").config();

const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/converse", async (req, res) => {
  const message = req.body.message;

  if (!message) {
    return res.status(400).json({
      status: 400,
      message: "Message cannot be empty!",
    });
  }

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
