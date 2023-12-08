import mongoose from "mongoose";

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  role: String,
  content: String,
  timestamp: { type: Date, default: Date.now },
});

const MessageModel = mongoose.model( 'MessageModel', MessageSchema );

export default MessageModel;
