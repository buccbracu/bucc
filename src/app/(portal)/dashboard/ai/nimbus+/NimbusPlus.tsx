"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import myAI from  "/public/images/nimbus_plus.png"; 
import headerBall from  "/public/images/ball.gif"; 
import {
  CircleStopIcon,
  Send,
  User,
  Sparkles,
  Zap,
  Shield,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
import { Outfit } from "next/font/google";
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const extractDocumentIds = (content: string) => {
  const regex = /Download ID: ([\w-]+)/g;
  const matches = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  return matches;
};
const extractDocumentIdsFromToolInvocations = (toolInvocations: any[]) => {
  const ids: string[] = [];
  if (!toolInvocations) return ids;
  for (const invocation of toolInvocations) {
    if (invocation.toolName === "generateDocument" && invocation.result) {
      const resultRegex = /Download ID: ([\w-]+)/g;
      let match;
      while ((match = resultRegex.exec(invocation.result)) !== null) {
        ids.push(match[1]);
      }
    }
  }
  return ids;
};
const extractDocumentFormatFromToolInvocations = (
  toolInvocations: any[],
  id: string,
) => {
  if (!toolInvocations) return null;
  for (const invocation of toolInvocations) {
    if (invocation.toolName === "generateDocument" && invocation.result) {
      const resultRegex = /Download ID: ([\w-]+)/g;
      let match;
      while ((match = resultRegex.exec(invocation.result)) !== null) {
        if (match[1] === id) {
          return invocation.args?.format || "unknown";
        }
      }
    }
  }
  return null;
};
export default function NimbusPlus() {
  const router = useRouter();

  const [toolCall, setToolCall] = useState<string>();
  const [particles, setParticles] = useState<
    Array<{ x: number; y: number; size: number }>
  >([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
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
    api: "/api/nimbus-plus",
    maxSteps: 5,
    onToolCall({ toolCall }) {
      setToolCall(toolCall.toolName);
    },
    initialMessages: [
      {
        role: "assistant",
        id: "1",
        content:
          "Welcome to **Nimbus+** - your advanced agentic AI assistant. I'm equipped with multiple specialized tools to help you accomplish complex tasks efficiently. \n\nI can assist with research, data analysis, scheduling, document management, and more. What would you like to work on today?",
      },
    ],
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto";
      // Calculate new height (with max of 4 rows)
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(scrollHeight, 96); // 96px ≈ 4 rows (24px per row)
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [input]);

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
          // Only process final results to avoid repetition
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + " ";
            }
          }
          // Only update input if there's a final transcript
          if (finalTranscript) {
            setInput((prev) => prev + finalTranscript);
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
  }, [setInput]);

  // Add this function to handle speech recognition
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

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  useEffect(() => {
    if (status === "streaming" || status === "ready") {
      setToolCall(undefined);
    }
  }, [status]);
  useEffect(() => {
    const newParticles = [];
    for (let i = 0; i < 50; i++) {
      newParticles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 2 + 1,
      });
    }
    setParticles(newParticles);
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resizeCanvas = () => {
      if (containerRef.current) {
        canvas.width = containerRef.current.clientWidth;
        canvas.height = containerRef.current.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
      particles.forEach((particle, index) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59, 130, 246, 0.5)";
        ctx.fill();
        particle.y += 0.5;
        if (particle.y > canvas.height) {
          particle.y = 0;
          particle.x = Math.random() * canvas.width;
        }
      });
      requestAnimationFrame(animate);
    };
    animate();
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [particles]);
  useEffect(() => {
    const updateMessagesContainerHeight = () => {
      if (messagesContainerRef.current && containerRef.current) {
        const inputHeight =
          document.getElementById("input-area")?.clientHeight || 80;
        const headerHeight = 80;
        messagesContainerRef.current.style.height = `${containerRef.current.clientHeight - inputHeight - headerHeight}px`;
      }
    };
    updateMessagesContainerHeight();
    window.addEventListener("resize", updateMessagesContainerHeight);
    return () => {
      window.removeEventListener("resize", updateMessagesContainerHeight);
    };
  }, []);

  // Handle form submission with input clearing
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (input.trim()) {
      handleSubmit(e);
      // Clear input after submission
      setInput("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    }
  };

  // Handle input changes with auto-resize
  const handleInputChangeWithResize = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    handleInputChange(e);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(scrollHeight, 96); // Max 4 rows (24px per row)
    textarea.style.height = `${newHeight}px`;
  };

  return (
    <div
      ref={containerRef}
      className={`${outfit.className} relative flex h-full w-full flex-col overflow-hidden bg-[#0a0a0a] text-gray-300`}
    >
      {/* Futuristic Background */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/10 to-transparent" />
      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Header */}
<div className="flex items-center justify-between border-b border-blue-900/30 bg-gradient-to-r from-blue-900/20 to-purple-900/20 py-1 px-3 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <button
    onClick={() => router.back()}
    className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 transition-all"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className="h-5 w-5"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  </button>
            <Image
                              src={headerBall}
                              alt="My AVIF Image"
                              width={80}
                              height={80}
                            />
            <div>
              <h1 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-bold text-transparent">
                Nimbus+
              </h1>
              <p className="text-xs text-blue-400/70">
                Advanced Agentic AI Assistant
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-green-500/30 bg-green-900/20 px-3 py-1">
              <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              <span className="text-xs text-green-400">ONLINE</span>
            </div>
            <button className="rounded-lg border border-gray-700/50 bg-gray-800/50 p-2 backdrop-blur-sm transition-all hover:bg-gray-700/50">
              <User size={18} />
            </button>
          </div>
        </div>
        {/* Messages Area */}
        <div
  ref={messagesContainerRef}
  className="flex-1 overflow-y-auto bg-transparent"
>

          <div className="mx-auto max-w-4xl px-4 py-8">
            {messages.map((msg, index) => {
              const contentDocIds =
                msg.role === "assistant" ? extractDocumentIds(msg.content) : [];
              const toolDocIds =
                msg.role === "assistant" && msg.toolInvocations
                  ? extractDocumentIdsFromToolInvocations(msg.toolInvocations)
                  : [];
              const allDocIds = [...contentDocIds, ...toolDocIds];
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`mb-8 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="mr-4 flex flex-col items-center">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="relative"
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/20">
                          <Image
                              src={myAI}
                              alt="My AVIF Image"
                              width={500}
                              height={300}
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1">
                          <Shield size={16} className="text-green-400" />
                        </div>
                      </motion.div>
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-5 py-4 backdrop-blur-sm ${
                      msg.role === "user"
                        ? "border border-blue-500/30 bg-gradient-to-br from-blue-900/30 to-purple-900/30 text-gray-200"
                        : "border border-gray-700/50 bg-gradient-to-br from-gray-800/50 to-gray-900/50 text-gray-300"
                    }`}
                  >
                    {msg.role === "assistant" ? (
                      <div className="prose prose-invert max-w-none prose-headings:my-3 prose-headings:text-blue-300 prose-p:my-2 prose-strong:text-blue-300 prose-li:my-1">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                    {/* Document download buttons */}
                    {allDocIds.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-3">
                        {allDocIds.map((id, idx) => {
                          const format = msg.toolInvocations
                            ? extractDocumentFormatFromToolInvocations(
                                msg.toolInvocations,
                                id,
                              )
                            : "unknown";
                          return (
                            <div key={id} className="flex gap-2">
                              {/* Only show PDF button if format is pdf or unknown */}
                              {(format === "pdf" || format === "unknown") && (
                                <a
                                  href={`/api/download-document/${id}/pdf`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-900/20 px-4 py-2 text-sm text-red-300 transition-all hover:bg-red-800/30 hover:text-red-200"
                                >
                                  <Download size={16} />
                                  Download PDF
                                </a>
                              )}
                              {/* Only show DOCX button if format is docx or unknown */}
                              {(format === "docx" || format === "unknown") && (
                                <a
                                  href={`/api/download-document/${id}/docx`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-900/20 px-4 py-2 text-sm text-green-300 transition-all hover:bg-green-800/30 hover:text-green-200"
                                >
                                  <Download size={16} />
                                  Download DOCX
                                </a>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="ml-4 flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-600 bg-gradient-to-br from-gray-700 to-gray-800 text-gray-300">
                        <User size={20} />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
            {/* Status Indicators */}
            {status === "submitted" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 flex max-w-md items-center gap-3 rounded-xl border border-blue-500/30 bg-blue-900/20 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <div className="flex space-x-1">
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <span className="text-blue-400">Processing...</span>
                </div>
                <button
                  type="button"
                  onClick={() => stop()}
                  className="ml-auto rounded-full bg-red-500/20 p-2 text-red-400 transition-all hover:bg-red-500/30 hover:text-red-300"
                >
                  <CircleStopIcon size={16} />
                </button>
              </motion.div>
            )}
            {toolCall && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 flex max-w-md items-center gap-3 rounded-xl border border-blue-500/30 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <Zap size={16} className="animate-pulse text-blue-400" />
                  <span className="text-blue-400">Using {toolCall}...</span>
                </div>
              </motion.div>
            )}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 flex max-w-md items-center gap-3 rounded-xl border border-red-500/30 bg-red-900/20 p-4 backdrop-blur-sm"
              >
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-red-400"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span className="text-red-400">An error occurred.</span>
                </div>
                <button
                  type="button"
                  onClick={() => reload()}
                  className="ml-auto text-sm text-red-400 underline hover:text-red-300"
                >
                  Retry
                </button>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {/* Fixed Input Area */}
        <div
          id="input-area"
          className="border-t border-blue-900/30 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-4 backdrop-blur-sm"
        >
          <div className="mx-auto max-w-4xl">
            <form onSubmit={handleFormSubmit} className="flex items-end gap-3">
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  style={{
                    minHeight: "48px",
                    maxHeight: "96px",
                    paddingLeft: "3rem",
                  }}
                  autoComplete="off"
                  name="input-message"
                  value={input}
                  placeholder="Ask Nimbus+... (Try: 'Generate a proposal letter for our upcoming event')"
                  onChange={handleInputChangeWithResize}
                  autoFocus={true}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim()) {
                        handleSubmit(e);
                        setInput("");
                        if (textareaRef.current) {
                          textareaRef.current.style.height = "auto";
                        }
                      }
                    }
                  }}
                  rows={1}
                  className="w-full resize-none overflow-x-hidden rounded-xl border border-blue-500/30 bg-gray-900/50 px-4 py-3 pr-16 text-gray-300 placeholder-gray-500 backdrop-blur-sm transition-all focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
                <div className="absolute left-2 top-1/2 flex -translate-y-1/2 transform items-center">
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={`rounded-lg p-2 transition-all ${
                      isListening
                        ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
                        : "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                    }`}
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
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={
                  status == "submitted" ||
                  status === "streaming" ||
                  !input.trim()
                }
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={18} />
              </motion.button>
            </form>
            <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Shield size={12} className="text-green-400" />
                End-to-end encrypted • Shift + Enter for new line
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
