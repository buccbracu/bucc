"use client";
import { useState, useRef, useEffect } from "react";
import { X, CircleStopIcon, BotMessageSquare, Send } from "lucide-react";
import { motion } from "framer-motion";
import botIcon from "/public/images/bot.png";
import { useChat } from "@ai-sdk/react";
import Image from "next/image";
// import { Spinner } from "./spinner";

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    error,
    reload,
    status,
    stop,
  } = useChat({
    maxSteps: 3,
    initialMessages: [
      {
        role: "assistant",
        id: "1",
        content:
          "Hey there! I’m Nebu, your go-to chatbot from the BRAC University Computer Club (BUCC)! 🤖✨ Got questions? I’ve got answers! Whether it’s about our club’s awesome events, juicy campus updates, or just random BUCC fun facts, hit me up! I’m here to make your life easier and a little more fun. 😎🎉 Ask away! 🚀",
      },
    ],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6">
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className="rounded-full bg-gray-800 p-2 text-white shadow-md transition hover:bg-gray-700"
        >
          <BotMessageSquare size={25} />
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 left-0 right-0 flex max-h-[75vh] flex-col overflow-hidden rounded-t-lg bg-gray-900 text-white shadow-xl sm:bottom-4 sm:left-auto sm:right-4 sm:w-96 sm:rounded-lg"
        >
          <div className="flex items-center justify-between border-b border-gray-700 p-3">
            <h2 className="text-base font-medium">Nebu (ChatBot) 🤖</h2>
            <button onClick={toggleChat} className="hover:text-gray-400">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-3 text-sm">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <Image
                    src={botIcon}
                    width={10}
                    height={10}
                    alt={"Icon"}
                    className="mr-2 h-10 w-10 rounded-full object-cover"
                    unoptimized={true}
                  />
                )}
                <div
                  className={`max-w-[75%] rounded-lg px-4 py-2 ${
                    msg.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-gray-300"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {status == "submitted" && (
            <div className="flex items-center justify-center space-x-2">
              <h3>Loading</h3>
              <button
                type="button"
                onClick={() => stop()}
                className="text-red-500 hover:text-red-700"
              >
                <CircleStopIcon size={20} />
              </button>
            </div>
          )}
          {error && (
            <div className="flex items-center justify-center space-x-2 text-sm text-red-500">
              <span>An error occurred.</span>
              <button
                type="button"
                onClick={() => reload()}
                className="text-sm font-medium underline hover:text-red-700"
              >
                Retry
              </button>
            </div>
          )}

          <div className="sticky bottom-0 border-t border-gray-700 bg-gray-900 p-3">
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-2"
            >
              <input
                autoComplete="off"
                type="text"
                name="input-message"
                value={input}
                placeholder="Type a message..."
                onChange={handleInputChange}
                autoFocus={true}
                disabled={status == "submitted"}
                className="flex-1 rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={status == "submitted"}
                className="rounded-full bg-blue-600 p-2 text-white transition hover:bg-blue-700"
              >
                <Send size={20} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default ChatBot;
