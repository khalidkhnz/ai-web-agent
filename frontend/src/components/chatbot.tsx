"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  X,
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Minimize2,
  Maximize2,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { io, Socket } from "socket.io-client";

// Socket.IO event interfaces
interface ServerToClientEvents {
  agentResponse: (data: { message: string; timestamp: string }) => void;
  streamStart: (data: { messageId: string; timestamp: string }) => void;
  streamChunk: (data: {
    messageId: string;
    chunk: string;
    timestamp: string;
  }) => void;
  streamEnd: (data: {
    messageId: string;
    fullMessage: string;
    timestamp: string;
  }) => void;
  navigate: (data: { path: string; page: string; timestamp: string }) => void;
  notification: (data: {
    message: string;
    type: string;
    duration?: number;
  }) => void;
  uiAction: (data: { uiAction: string; payload?: unknown }) => void;
  error: (data: { message: string; timestamp: string }) => void;
}

interface ClientToServerEvents {
  userMessage: (data: { message: string; timestamp: string }) => void;
}

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  isStreaming?: boolean;
}

interface ChatbotProps {
  isOpen: boolean;
  onToggle: () => void;
}

const initialMessages: Message[] = [
  {
    id: "1",
    type: "bot",
    content:
      '👋 Hi there! I\'m your AI assistant. I can help you with:\n\n• Navigating around the application\n• Analyzing your dashboard data\n• Managing users and clients\n• Generating reports\n• Controlling UI elements\n\nJust tell me what you\'d like to do in natural language. For example: "take me to the dashboard" or "show me user analytics". How can I assist you today?',
    timestamp: new Date(),
  },
];

const suggestedPrompts = [
  "Take me to the dashboard",
  "Show me user analytics summary",
  "Navigate to the clients page",
  "How many active users do I have?",
  "Generate a performance report",
  "Show me a success notification",
];

// Backend API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export function Chatbot({ isOpen, onToggle }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Socket.IO connection for real-time features
  const [socket, setSocket] = useState<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Stable initialization function
  const initializeSocketIO = useCallback(() => {
    try {
      const socketConnection: Socket<
        ServerToClientEvents,
        ClientToServerEvents
      > = io("http://localhost:3001", {
        transports: ["websocket", "polling"],
        timeout: 5000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketConnection.on("connect", () => {
        console.log("🔌 Connected to AI Agent via Socket.IO");
        setIsConnected(true);
        setSocket(socketConnection);
      });

      // Handle all the different event types from the backend
      socketConnection.on("agentResponse", (data) => {
        handleSocketMessage({ action: "agentResponse", ...data });
      });

      socketConnection.on("streamStart", (data) => {
        handleSocketMessage({ action: "streamStart", ...data });
      });

      socketConnection.on("streamChunk", (data) => {
        handleSocketMessage({ action: "streamChunk", ...data });
      });

      socketConnection.on("streamEnd", (data) => {
        handleSocketMessage({ action: "streamEnd", ...data });
      });

      socketConnection.on("navigate", (data) => {
        handleSocketMessage({ action: "navigate", ...data });
      });

      socketConnection.on("notification", (data) => {
        handleSocketMessage({ action: "notification", ...data });
      });

      socketConnection.on("uiAction", (data) => {
        handleSocketMessage({ action: "uiAction", ...data });
      });

      socketConnection.on("error", (data) => {
        handleSocketMessage({ action: "error", ...data });
      });

      socketConnection.on("disconnect", (reason) => {
        console.log("🔌 Disconnected from AI Agent:", reason);
        setIsConnected(false);
        setSocket(null);
      });

      socketConnection.on("connect_error", (error) => {
        console.error("Socket.IO connection error:", error);
        setIsConnected(false);
      });

      return socketConnection;
    } catch (error) {
      console.error("Failed to connect to AI Agent:", error);
      setIsConnected(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      // Focus input when chat opens
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);

      // Initialize Socket.IO connection for real-time features
      const socketConnection = initializeSocketIO();

      return () => {
        if (socketConnection) {
          socketConnection.disconnect();
        }
      };
    }
  }, [isOpen, initializeSocketIO]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSocketMessage = useCallback(
    (data: {
      action: string;
      message?: string;
      messageId?: string;
      chunk?: string;
      path?: string;
      type?: string;
      [key: string]: unknown;
    }) => {
      switch (data.action) {
        case "agentResponse":
          // Add bot response message
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              type: "bot",
              content: data.message || "",
              timestamp: new Date(),
            },
          ]);
          setIsTyping(false);
          break;

        case "streamStart":
          // Start streaming response
          setIsTyping(true);
          break;

        case "streamChunk":
          // Update streaming message - fix flickering by using functional update
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (lastMessage && lastMessage.isStreaming) {
              // Update existing streaming message
              return prev.map((msg, index) =>
                index === prev.length - 1
                  ? { ...msg, content: msg.content + (data.chunk || "") }
                  : msg
              );
            } else {
              // Create new streaming message
              return [
                ...prev,
                {
                  id: data.messageId || Date.now().toString(),
                  type: "bot",
                  content: data.chunk || "",
                  timestamp: new Date(),
                  isStreaming: true,
                },
              ];
            }
          });
          break;

        case "streamEnd":
          // Finalize streaming message
          setMessages((prev) =>
            prev.map((msg) => ({ ...msg, isStreaming: false }))
          );
          setIsTyping(false);
          break;

        case "navigate":
          // Handle navigation actions
          if (data.path) {
            router.push(data.path);
            toast.success(`Navigated to ${data.path}`);
          }
          break;

        case "notification":
          // Handle notification actions
          if (data.type === "success") {
            toast.success(data.message || "Success");
          } else if (data.type === "error") {
            toast.error(data.message || "Error");
          } else {
            toast(data.message || "Notification");
          }
          break;

        case "error":
          console.error("Agent error:", data.message);
          toast.error("AI Assistant encountered an error");
          setIsTyping(false);
          break;
      }
    },
    [router]
  );

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue("");
    setIsTyping(true);

    try {
      if (socket && socket.connected) {
        // Use Socket.IO for real-time features
        socket.emit("userMessage", {
          message: messageToSend,
          timestamp: new Date().toISOString(),
        });
      } else {
        // Fallback to HTTP API or offline mode
        try {
          await sendMessageViaHTTP(messageToSend);
        } catch {
          // If HTTP also fails, use offline mode
          handleOfflineMessage(messageToSend);
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(false);
      toast.error("Failed to send message to AI Assistant");
    }
  }, [inputValue, socket]);

  const handleOfflineMessage = useCallback(
    (message: string) => {
      setIsTyping(false);

      // Simple offline responses based on keywords
      const input = message.toLowerCase();
      let response = "";

      if (input.includes("dashboard") || input.includes("take me to")) {
        if (input.includes("dashboard")) {
          router.push("/dashboard");
          response =
            "🔄 Navigated to dashboard! The AI backend is offline, but I can still help with basic navigation.";
        } else if (input.includes("user")) {
          router.push("/users");
          response =
            "🔄 Navigated to users page! The AI backend is offline, but I can still help with basic navigation.";
        } else if (input.includes("client")) {
          router.push("/clients");
          response =
            "🔄 Navigated to clients page! The AI backend is offline, but I can still help with basic navigation.";
        } else {
          response =
            "🔄 I can help with basic navigation even in offline mode. Try: 'take me to dashboard', 'go to users', or 'open clients page'.";
        }
      } else if (
        input.includes("user") &&
        (input.includes("how many") || input.includes("analytics"))
      ) {
        response =
          "📊 **User Analytics Summary:**\n\n• Total Users: 248\n• Active Users: 186 (75% active rate)\n• New Signups: 23 this week\n• Top Department: Engineering (45%)\n\n💡 For real-time AI analysis, please start the backend server.";
      } else if (
        input.includes("client") &&
        (input.includes("how many") || input.includes("analytics"))
      ) {
        response =
          "👥 **Client Overview:**\n\n• Total Clients: 156 active clients\n• Monthly Revenue: $125,400\n• Top Performing: Creative Agency\n• Recent Activity: 12 new proposals\n\n💡 For real-time AI analysis, please start the backend server.";
      } else {
        response =
          '🤖 I\'m running in offline mode. I can help with:\n\n• Basic navigation ("take me to dashboard")\n• Show user stats ("how many users")\n• Show client stats ("client analytics")\n\n🔧 To enable full AI capabilities, please start the backend server and refresh.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "bot",
          content: response,
          timestamp: new Date(),
        },
      ]);
    },
    [router]
  );

  const sendMessageViaHTTP = async (message: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const streamingMessage: Message = {
        id: Date.now().toString(),
        type: "bot",
        content: "",
        timestamp: new Date(),
        isStreaming: true,
      };

      setMessages((prev) => [...prev, streamingMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === "chunk") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingMessage.id
                      ? { ...msg, content: msg.content + data.chunk }
                      : msg
                  )
                );
              } else if (data.type === "end") {
                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === streamingMessage.id
                      ? { ...msg, isStreaming: false }
                      : msg
                  )
                );
                setIsTyping(false);
              }
            } catch {
              // Ignore JSON parse errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error("HTTP streaming error:", error);
      setIsTyping(false);

      // Add error message
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          type: "bot",
          content:
            "Sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleSuggestedPrompt = useCallback((prompt: string) => {
    setInputValue(prompt);
    // Ensure input focus is maintained
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  const copyMessage = useCallback((content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Message copied to clipboard");
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage]
  );

  const ChatContent = () => (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">
              AI Assistant
            </h3>
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full ${
                  isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
                }`}
              />
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {isConnected ? "Connected (Socket.IO)" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {!isFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-2"
            >
              {isMinimized ? (
                <Maximize2 className="w-4 h-4" />
              ) : (
                <Minimize2 className="w-4 h-4" />
              )}
            </Button>
          )}
          {!isFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              className="p-2"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={onToggle} className="p-2">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {(!isMinimized || isFullscreen) && (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.type === "bot" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">
                      {message.content}
                      {message.isStreaming && (
                        <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1" />
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2 gap-2">
                      <span className="text-xs opacity-60">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {message.type === "bot" && !message.isStreaming && (
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyMessage(message.content)}
                            className="p-1 h-6 w-6 opacity-60 hover:opacity-100"
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-6 w-6 opacity-60 hover:opacity-100"
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="p-1 h-6 w-6 opacity-60 hover:opacity-100"
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {message.type === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3">
                    <div className="flex items-center gap-1">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        AI is thinking...
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Suggested Prompts */}
          {messages.length === 1 && (
            <div className="px-4 pb-4 flex-shrink-0">
              <div className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                Try asking:
              </div>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="text-xs h-7 px-2"
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <Separator className="flex-shrink-0" />

          {/* Input */}
          <div className="p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1"
                disabled={isTyping}
                autoComplete="off"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                size="sm"
                className="px-3"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>

            <div className="flex items-center justify-between mt-2 text-xs text-slate-500">
              <span>Powered by AI Agent</span>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                <span>
                  {isConnected ? "Socket.IO Real-time" : "Offline Mode"}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );

  if (!isOpen) return null;

  // Fullscreen Modal
  if (isFullscreen) {
    return (
      <Dialog open={isFullscreen} onOpenChange={() => setIsFullscreen(false)}>
        <DialogContent className="max-w-4xl w-full h-[80vh] p-0 gap-0 overflow-hidden">
          <ChatContent />
        </DialogContent>
      </Dialog>
    );
  }

  // Side Panel
  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed right-0 top-0 h-full w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl z-50 overflow-hidden"
      >
        <ChatContent />
      </motion.div>
    </AnimatePresence>
  );
}
