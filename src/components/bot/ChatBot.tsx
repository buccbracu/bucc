"use client";
import { useState, useRef, useEffect } from "react";
import { X, CircleStopIcon, BotMessageSquare, Send, Mic } from "lucide-react";
import { motion } from "framer-motion";
import botIcon from "/public/images/bot.png";
import { useChat } from "@ai-sdk/react";
import Image from "next/image";
import { Spinner } from "../ui/spinner";
import ReactMarkdown from "react-markdown";
import { Open_Sans } from "next/font/google";
const inter = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600"],
});
const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [toolCall, setToolCall] = useState<string>();
  // Speech recognition states
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [interimTranscript, setInterimTranscript] = useState("");

  const {
    messages,
    input,
    setInput,
    handleInputChange,
    handleSubmit,
    error,
    reload,
    status,
    stop,
  } = useChat({
    maxSteps: 3,
    onToolCall({ toolCall }) {
      setToolCall(toolCall.toolName);
    },
    initialMessages: [
      {
        role: "assistant",
        id: "1",
        content:
          "Hey there! I'm Nimbus, your go-to chatbot from the BRAC University Computer Club (BUCC)! 🤖✨ Got questions? I've got answers! Whether it's about our club's awesome events, real time campus updates, or just random BUCC fun facts, hit me up! I'm here to make your life easier and a little more fun. 😎🎉 Ask away! 🚀",
      },
    ],
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const toggleChat = () => setIsOpen(!isOpen);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const handleResize = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    const maxHeight = 4 * 24;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = "en-US";

        recognitionInstance.onresult = (event: any) => {
          let finalTranscript = "";
          let interimTranscript = "";

          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " ";
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript) {
            setInput((prev) => prev + finalTranscript);
            setInterimTranscript("");
          } else if (interimTranscript) {
            setInterimTranscript(interimTranscript);
          }
        };

        recognitionInstance.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
        };

        recognitionInstance.onend = () => {
          setIsListening(false);
        };

        setRecognition(recognitionInstance);
      }
    }

    // Cleanup function
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [recognition, setInput]);

  // Toggle speech recognition
  const toggleListening = () => {
    if (!recognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  // Scroll to bottom when interim transcript changes (while speaking)
  useEffect(() => {
    if (isListening && interimTranscript) {
      scrollToBottom();
    }
  }, [interimTranscript, isListening]);

  // Scroll textarea to bottom when input changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [input, interimTranscript]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (status === "streaming" || status === "ready") {
      setToolCall(undefined);
    }
  }, [status]);
  return (
    <div className="fixed bottom-4 right-4 z-40 sm:bottom-6 sm:right-6">
      {!isOpen ? (
        <button
          onClick={toggleChat}
          className="rounded-full bg-gray-800 p-3 text-white shadow-lg transition-all hover:scale-105 hover:bg-gray-700"
        >
          <BotMessageSquare size={24} />
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className={`${inter.className} fixed bottom-0 left-0 right-0 flex max-h-[80vh] flex-col overflow-hidden rounded-t-xl bg-gray-900 text-white shadow-2xl sm:bottom-4 sm:left-auto sm:right-4 sm:w-[22rem] sm:rounded-xl`}
        >
          {/* Header */}
          <div className="bg-gray-850 flex items-center justify-between border-b border-gray-800 px-4 py-3">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Image
                  src={botIcon}
                  width={24}
                  height={24}
                  alt="Nimbus"
                  className="h-6 w-6 rounded-full object-cover"
                  unoptimized={true}
                />
                <div className="ring-gray-850 absolute bottom-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-1"></div>
              </div>
              <h2 className="text-base font-semibold">Nimbus</h2>
            </div>
            <button
              onClick={toggleChat}
              className="rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
          {/* Messages Container */}
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 text-sm">
            {messages.map((msg, index) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <Image
                    src={botIcon}
                    width={28}
                    height={28}
                    alt="Nimbus"
                    className="mr-2 h-7 w-7 rounded-full object-cover"
                    unoptimized={true}
                  />
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "rounded-br-none bg-blue-600 text-white"
                      : "rounded-bl-none bg-gray-800 text-gray-200"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <ReactMarkdown
                      components={{
                        div: ({ node, ...props }) => (
                          <div
                            {...props}
                            className="prose prose-invert prose-headings:my-1 prose-headings:text-white prose-p:my-1 prose-strong:text-white prose-li:my-0"
                          />
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          {/* Status Indicators */}
          {status === "submitted" && (
            <div className="bg-gray-850 flex items-center justify-center space-x-2 border-t border-gray-800 px-4 py-2 text-sm text-gray-400">
              <Spinner className="h-4 w-4" />
              <span>Thinking...</span>
              <button
                type="button"
                onClick={() => stop()}
                className="ml-2 rounded-full p-1 hover:bg-gray-800 hover:text-red-400"
              >
                <CircleStopIcon size={16} />
              </button>
            </div>
          )}
          {toolCall && (
            <div className="bg-gray-850 flex items-center justify-center space-x-2 border-t border-gray-800 px-4 py-2 text-sm text-blue-400">
              <Spinner className="h-4 w-4" />
              <span>
                {toolCall === "getInformation"
                  ? "Getting information..."
                  : `Running ${toolCall}...`}
              </span>
            </div>
          )}
          {error && (
            <div className="bg-gray-850 flex items-center justify-center space-x-2 border-t border-gray-800 px-4 py-2 text-sm text-red-400">
              <span>An error occurred.</span>
              <button
                type="button"
                onClick={() => reload()}
                className="font-medium underline hover:text-red-300"
              >
                Retry
              </button>
            </div>
          )}
          {/* Input Area */}
          <div className="bg-gray-850 sticky bottom-0 border-t border-gray-800 p-3">
            <form onSubmit={handleSubmit} className="flex items-end space-x-2">
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  autoComplete="off"
                  name="input-message"
                  value={input}
                  placeholder={interimTranscript || "Type a message..."}
                  onChange={handleInputChange}
                  onInput={handleResize}
                  autoFocus={true}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit(e);
                    }
                  }}
                  rows={1}
                  className="w-full resize-none overflow-hidden rounded-xl border border-gray-700 bg-gray-800 px-4 py-3 pl-12 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`absolute bottom-2.5 left-2 rounded-full p-1.5 ${
                    isListening
                      ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  }`}
                  aria-label={
                    isListening ? "Stop listening" : "Start voice input"
                  }
                  aria-pressed={isListening}
                >
                  {isListening ? (
                    <div className="relative">
                      <div className="h-5 w-5">
                        <svg
                          className="h-5 w-5"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="6" y="4" width="4" height="16" />
                          <rect x="14" y="4" width="4" height="16" />
                        </svg>
                      </div>
                      <div className="absolute inset-0 animate-ping rounded-full bg-red-400 opacity-30"></div>
                    </div>
                  ) : (
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <button
                type="submit"
                disabled={status == "submitted" || status === "streaming"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};
export default ChatBot;
