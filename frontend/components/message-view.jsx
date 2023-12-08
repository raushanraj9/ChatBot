import React from "react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import classNames from 'classnames';

const MessageView = ({ messages }) => {
  return (
    <div className="border-2 border-solid h-[75vh]">
      {messages.length > 0 ? (
        <div className="space-y-2 h-full overflow-auto p-5">
          {messages.map((message) => (
            <div key={message._id} className={classNames("flex items-center gap-2", message.role !== 'user' && 'justify-end')}>
              <Avatar>
                <AvatarFallback>
                  {message.role === "user" ? "You" : "Bot"}
                </AvatarFallback>
              </Avatar>
              <p>{message.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center p-4">No message yet! Start chatting now!!!</p>
      )}
    </div>
  );
};

export default MessageView;
