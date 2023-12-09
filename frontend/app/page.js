"use client";

import ChatForm from "@/components/chat-form";
import { useEffect, useState } from "react";
import MessageView from "@/components/message-view";
import { BASE_API_URL } from "@/config/site";
import axios from "axios";
import { socket } from "@/lib/socket";

export default function Home() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const appendMessage = (newMessage) => {
    /**
     * @TODO
     * Remove spread operator and use push instead for performance issues.
     */
    setMessages((prevMessages) => [newMessage, ...prevMessages]);
  };

  const fetchAllMessages = async () => {
    const apiUrl = `${BASE_API_URL}/conversation`;

    try {
      const { data } = await axios.get(apiUrl);
      if ("messages" in data.data) {
        setMessages((prevMessages) => data.data.messages);
      } else {
        /**
         * @TODO
         * throw error
         */
      }
    } catch (err) {
      /**
       * @TODO
       * Throw error
       */
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      await fetchAllMessages();
      setIsLoading(false);
    };
    fetchMessages();

    // Socket connections
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
	socket.on('user-message-ack', (newMessage) => {
		appendMessage(newMessage);
	});
	socket.on('assistant-message', (newMessage) => {
		console.log('received assistant message');
		appendMessage(newMessage);
		setIsLoading(false);
	});

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-5 md:p-10">
      <div className="w-full md:w-[70%] space-y-6">
        <h1 className="text-xl font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Ask from ChatBot
        </h1>
		<ChatForm isLoading={isLoading} setIsLoading={setIsLoading} />
        <MessageView messages={messages} isLoading={isLoading} />
      </div>
    </main>
  );
}
