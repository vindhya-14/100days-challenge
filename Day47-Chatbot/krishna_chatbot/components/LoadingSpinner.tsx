import React from "react";
import BotIcon from "./icons/BotIcon";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-start space-x-3 group">
      <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center border-2 border-indigo-200 shadow-sm transform transition-transform duration-300 group-hover:scale-110">
        <BotIcon className="text-indigo-600 w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="relative p-4 bg-gradient-to-br from-white to-blue-50 rounded-lg rounded-tl-none shadow-md max-w-md border border-white/50">
          {/* Decorative corner */}
          <div className="absolute -left-2 top-0 w-4 h-4 bg-blue-50 transform rotate-45 origin-bottom-right border-t border-l border-white/50"></div>

          <div className="flex items-center space-x-2">
            <div className="flex space-x-1.5">
              <div className="w-2.5 h-2.5 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-2.5 h-2.5 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-2.5 h-2.5 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full animate-bounce"></div>
            </div>
            <span className="text-sm text-gray-600 font-medium">
              Krishna is thinking...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
