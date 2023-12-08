import React from "react";

const MessageView = ({ messages }) => {
  return (
    <div className="border-2 border-solid min-h-[75vh]">
      {messages.length > 0 ? (
        <div className="space-y-2">
          {messages.map((message) => (
            <div key={message._id}>
              {message._id} : {message.role} : {message.content}
            </div>
          ))}
          Hello
        </div>
      ) : (
        <p className="text-center p-4">No message yet! Start chatting now!!!</p>
      )}
    </div>
  );
};

export default MessageView;
