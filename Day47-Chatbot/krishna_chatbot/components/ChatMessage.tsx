import React from "react";
import { Message, BotResponse } from "../types";
import BotIcon from "./icons/BotIcon";
import UserIcon from "./icons/UserIcon";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isBot = message.sender === "bot";
  const isInitialMessage = message.id.startsWith("init-");

  // Helper function to format timestamp
  const formatTimestamp = (id: string) => {
    if (isInitialMessage) return "Just now";
    const timestamp = parseInt(id);
    return isNaN(timestamp)
      ? ""
      : new Date(timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
  };

  if (isBot) {
    const botResponse = message.content as BotResponse;
    return (
      <div className="flex items-start space-x-3 group">
        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center border-2 border-indigo-200 shadow-sm transform transition-transform duration-200 group-hover:scale-110">
          <BotIcon className="text-indigo-600 w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="relative p-4 bg-gradient-to-br from-white to-blue-50 rounded-lg rounded-tl-none shadow-md max-w-md animate-fade-in border border-white/50">
            {/* Decorative corner */}
            <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-50 transform rotate-45 origin-bottom-right border-t border-l border-white/50"></div>

            <blockquote className="border-l-4 border-yellow-400 pl-4 italic text-gray-800 font-serif text-lg">
              "{botResponse.quote}"
            </blockquote>
            <p className="text-right text-sm text-gray-600 mt-2 font-medium">
              — {botResponse.source}
            </p>
            <p className="mt-4 text-gray-700 text-base leading-relaxed">
              {botResponse.explanation}
            </p>

            {botResponse.practice && (
              <div className="mt-4 pt-3 border-t border-yellow-400/30">
                <p className="text-sm font-medium text-indigo-700">
                  <span className="font-bold text-purple-700">
                    A simple practice:
                  </span>{" "}
                  {botResponse.practice}
                </p>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-400 mt-1 pl-1">
            {formatTimestamp(message.id)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end group">
      <div className="flex flex-col items-end max-w-md">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-3 rounded-lg rounded-br-none shadow-md animate-fade-in relative">
          <div className="absolute -right-2 bottom-0 w-4 h-4 bg-indigo-500 transform rotate-45 origin-bottom-left"></div>
          {message.content as string}
        </div>
        <div className="flex items-center mt-1 space-x-2">
          <div className="text-xs text-gray-400">
            {formatTimestamp(message.id)}
          </div>
          <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center border border-indigo-200 shadow-sm">
            <UserIcon className="text-indigo-600 w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
