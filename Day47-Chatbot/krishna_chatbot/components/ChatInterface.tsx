import React, { useState, useRef, useEffect } from "react";
import { Message, BotResponse } from "../types";
import { getKrishnaWisdom } from "../services/geminiService";
import ChatMessage from "./ChatMessage";
import LoadingSpinner from "./LoadingSpinner";
import SendIcon from "./icons/SendIcon";
import MicrophoneIcon from "./icons/MicrophoneIcon";
import FlowerPattern from "./icons/FlowerPattern";

const initialBotMessage: Message = {
  id: "init-1",
  sender: "bot",
  content: {
    quote: "You have the right to work, but never to the fruit of work.",
    source: "Bhagavad Gita 2.47",
    explanation:
      "Welcome, dear friend. Share what is on your mind. Focus on your actions and intentions with a pure heart, and release your attachment to the outcomes. Let your journey be your reward.",
    practice: "",
  } as BotResponse,
};

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([initialBotMessage]);
  const [userInput, setUserInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isPeacockVisible, setIsPeacockVisible] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Speech recognition setup
  useEffect(() => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      recognition.onstart = () => {
        setIsListening(true);
        setIsPeacockVisible(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setUserInput(transcript);
        inputRef.current?.focus();
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
      };

      recognition.onend = () => {
        setIsListening(false);
        setTimeout(() => setIsPeacockVisible(false), 1000);
      };

      return () => {
        recognition.stop();
      };
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: userInput.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setUserInput("");
    setIsLoading(true);

    try {
      const botResponseContent = await getKrishnaWisdom(userInput.trim());
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content: botResponseContent,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Failed to get response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        content: {
          quote: "Even in the midst of turmoil, peace can be found within.",
          source: "Timeless Wisdom",
          explanation:
            "A technical issue occurred, but do not be discouraged. True strength is shown in how we face unexpected challenges.",
          practice:
            "Close your eyes for a moment. Take a deep breath in, and a long breath out. Find the calm center within you.",
        },
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startListening = () => {
    if ("webkitSpeechRecognition" in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.start();
    } else {
      alert("Speech recognition is not supported in your browser.");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <div className="relative w-full max-w-2xl h-[90vh] max-h-[700px] bg-gradient-to-br from-blue-50/90 to-purple-50/90 backdrop-blur-lg rounded-2xl shadow-xl flex flex-col overflow-hidden border border-white/30">
      {/* Decorative elements */}
      {/* <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <FlowerPattern />
      </div> */}

      {/* Peacock animation when listening */}
      {isPeacockVisible && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <div className="animate-pulse">
            <svg
              className="w-32 h-32 text-blue-500 opacity-70"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10s10-4.5 10-10S17.5 2 12 2m0 2c2.9 0 5.4 1.6 6.8 4H5.2C6.6 5.6 9.1 4 12 4m0 16c-4.4 0-8-3.6-8-8v-1h16v1c0 4.4-3.6 8-8 8"
              />
              <path
                fill="currentColor"
                d="M12 6c-3.3 0-6 2.7-6 6s2.7 6 6 6s6-2.7 6-6s-2.7-6-6-6m0 2c2.2 0 4 1.8 4 4s-1.8 4-4 4s-4-1.8-4-4s1.8-4 4-4"
              />
            </svg>
          </div>
        </div>
      )}

      <header className="relative text-center p-4 border-b border-white/30 bg-gradient-to-r from-blue-500/10 to-purple-500/10">
        <h1 className="text-3xl font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-purple-700">
          SpeakToKrishna
        </h1>
        <p className="text-sm text-purple-600/80 mt-1">
          Timeless wisdom for modern minds
        </p>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400/30 via-purple-400/30 to-pink-400/30"></div>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-6 relative z-0">
        {messages.map((msg, index) => (
          <div
            key={msg.id}
            className={`transition-all duration-300 ${
              index === messages.length - 1 ? "animate-fade-in" : ""
            }`}
          >
            <ChatMessage message={msg} />
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-center p-4">
            <LoadingSpinner />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative p-4 border-t border-white/30 bg-white/20 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your thoughts or ask for guidance..."
              className="w-full p-3 pl-4 pr-12 rounded-full border border-white/50 focus:ring-2 focus:ring-purple-400 focus:outline-none transition duration-200 bg-white/70 shadow-sm text-gray-800 placeholder-gray-500/70"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={startListening}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full transition-all duration-200 ${
                isListening
                  ? "text-red-500 animate-pulse"
                  : "text-gray-500 hover:text-purple-600"
              }`}
              disabled={isLoading}
            >
              <MicrophoneIcon />
            </button>
          </div>
          <button
            type="submit"
            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-full hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-200 shadow-lg hover:shadow-purple-400/30 flex items-center justify-center"
            disabled={isLoading || !userInput.trim()}
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </form>
        <div className="text-xs text-center text-gray-500/70 mt-2">
          Press Enter to send or click the mic to speak
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
