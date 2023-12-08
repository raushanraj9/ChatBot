"use client";

import ChatForm from "@/components/chat-form";
import { useState } from "react";
import MessageView from "@/components/message-view";

export default function Home() {
  const [messages, setMessages] = useState([]);

  const appendMessage = (newMessage) => {
    /**
     * @TODO
     * Remove spread operator and use push instead for performance issues.
     */
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <div className="container space-y-6">
        <h1 className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Ask from ChatBot
        </h1>
        <ChatForm appendMessage={appendMessage} />
		<MessageView messages={messages} />
      </div>
    </main>
  );
}
