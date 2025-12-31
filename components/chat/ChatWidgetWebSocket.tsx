"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle, X, Send, Loader2, Wifi, WifiOff, RotateCcw } from "lucide-react";
import { useChatWebSocket } from "@/lib/hooks/useChatWebSocket";
import { useAuth } from "@/lib/auth/auth-context";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  source?: string;
  relatedQuestions?: string[];
}

interface QuickSuggestion {
  text: string;
  query: string;
}

const DEFAULT_SUGGESTIONS: QuickSuggestion[] = [
  { text: "How to register?", query: "How do I register as a student?" },
  { text: "Available courses", query: "What courses are available?" },
  { text: "Pay fees", query: "How do I pay my fees?" },
  { text: "Exam process", query: "How do exams work?" },
  { text: "Get certificate", query: "How do I get my certificate?" },
];

export function ChatWidgetWebSocket() {
  const { user } = useAuth();
  const [token, setToken] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Get token from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('access_token');
      setToken(storedToken);
    }
  }, [user]); // Re-check when user changes
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Welcome to Rajtech Technological Systems! I'm Raj, your AI assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestions] = useState<QuickSuggestion[]>(DEFAULT_SUGGESTIONS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Track if we've shown an error already to prevent duplicates
  const errorShownRef = useRef(false);

  // WebSocket connection - only connect if user is logged in
  const { isConnected, isConnecting, hasToken, authFailed, sendMessage: sendWebSocketMessage } = useChatWebSocket({
    token: token,
    streaming: true, // Enable streaming for better UX
    onMessage: (message) => {
      // Reset error flag when we receive a message
      errorShownRef.current = false;

      if (message.id === "streaming") {
        // Update streaming message in real-time
        setMessages((prev) => {
          const updated = [...prev];
          const lastIndex = updated.length - 1;

          // Check if last message is a streaming message
          if (lastIndex >= 0 && updated[lastIndex]?.id === "streaming") {
            // Update existing streaming message
            updated[lastIndex] = message;
          } else {
            // Add new streaming message
            updated.push(message);
          }

          return updated;
        });
      } else {
        // Complete message received - ensure unique ID
        const uniqueMessage = {
          ...message,
          id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        };
        setMessages((prev) => {
          // Remove any streaming message
          const filtered = prev.filter((m) => m.id !== "streaming");
          // Add the complete message
          return [...filtered, uniqueMessage];
        });
      }
    },
    onError: (error) => {
      console.error("Chat WebSocket error:", error);
      // Only add error message if we haven't shown one already
      if (!errorShownRef.current) {
        errorShownRef.current = true;
        const errorMessage: Message = {
          id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          content: error.includes("backend")
            ? "Unable to connect to chat server. Please ensure the backend is running."
            : "I'm having trouble connecting right now. Please try again later.",
          sender: "assistant",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      }
    },
  });

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    // Check if connected
    if (!isConnected) {
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "Not connected to chat server. Please wait a moment and try again.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    // Add user message to UI
    const newMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setShowSuggestions(false);

    // Send via WebSocket
    const sent = sendWebSocketMessage(textToSend);
    
    if (!sent) {
      // Failed to send
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Failed to send message. Please try again.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleRefreshChat = () => {
    // Reset messages to initial welcome message
    setMessages([
      {
        id: "1",
        content: "Welcome to Rajtech Technological Systems! I'm Raj, your AI assistant. How can I help you today?",
        sender: "assistant",
        timestamp: new Date(),
      },
    ]);
    setInputValue("");
    setShowSuggestions(true);
    errorShownRef.current = false;
  };

  // Get last message's related questions
  const lastMessage = messages[messages.length - 1];
  const relatedQuestions = lastMessage?.relatedQuestions || [];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 group">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-300 hover:scale-110"
            aria-label="Chat with Raj"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
              AI
            </span>
          </Button>
          <div className="absolute bottom-16 right-0 bg-slate-800 text-white text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Ask Raj anything
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl flex flex-col z-50 border border-slate-700 bg-slate-900/95 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-white" />
                </Avatar>
                <span
                  className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 ${
                    isConnected ? "bg-green-500" : isConnecting ? "bg-yellow-500" : "bg-red-500"
                  }`}
                  title={isConnected ? "Connected" : isConnecting ? "Connecting..." : "Disconnected"}
                ></span>
              </div>
              <div>
                <h3 className="font-semibold text-white flex items-center gap-2">
                  Raj
                  {isConnected ? (
                    <Wifi className="h-3 w-3 text-green-500" />
                  ) : (
                    <WifiOff className="h-3 w-3 text-red-500" />
                  )}
                </h3>
                <p className="text-xs text-slate-400">
                  {!hasToken ? "Please log in" : isConnected ? "AI Assistant • Online" : isConnecting ? "Connecting..." : authFailed ? "Auth failed" : "Offline"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefreshChat}
                className="hover:bg-slate-800 rounded-full"
                title="Reset chat"
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="hover:bg-slate-800 rounded-full"
                title="Close chat"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "assistant" && (
                  <Avatar className="h-8 w-8 bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                      : "bg-slate-800 text-slate-100 border border-slate-700"
                  }`}
                >
                  {message.sender === "assistant" ? (
                    <div className="text-sm leading-relaxed prose prose-invert prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-strong:text-white">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  )}
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {message.source && message.sender === "assistant" && (
                      <span className="ml-2">• {message.source === "faq" ? "FAQ" : message.source === "gemini" ? "AI" : "Info"}</span>
                    )}
                  </span>
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold">You</span>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Initial Suggestions */}
            {showSuggestions && messages.length === 1 && suggestions.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-400 text-center">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion.query)}
                      className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full text-slate-200 transition-colors duration-200"
                      disabled={!isConnected}
                    >
                      {suggestion.text}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Related Questions */}
            {!showSuggestions && relatedQuestions.length > 0 && (
              <div className="space-y-2 mt-4">
                <p className="text-xs text-slate-400 text-center">Related questions:</p>
                <div className="flex flex-wrap gap-2">
                  {relatedQuestions.slice(0, 3).map((question, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(question)}
                      className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full text-slate-200 transition-colors duration-200"
                      disabled={!isConnected}
                    >
                      {question}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Connection Status */}
            {!isConnected && !isConnecting && (
              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm py-2">
                <WifiOff className="h-4 w-4" />
                <span>Reconnecting...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-slate-700 bg-slate-900">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={!hasToken ? "Log in to chat..." : isConnected ? "Type your message..." : "Connecting..."}
                disabled={!isConnected || !hasToken}
                className="flex-1 bg-slate-800 border-slate-700 focus:border-purple-600 focus:ring-purple-600 text-white placeholder:text-slate-400 disabled:opacity-50"
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!inputValue.trim() || !isConnected}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                size="icon"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center flex items-center justify-center gap-2">
              {!hasToken ? (
                <span>Please log in to use chat</span>
              ) : isConnected ? (
                <>
                  <Wifi className="h-3 w-3 text-green-500" />
                  <span>Connected • Press Enter to send</span>
                </>
              ) : authFailed ? (
                <span className="text-red-400">Session expired. Please refresh the page.</span>
              ) : (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Connecting to chat server...</span>
                </>
              )}
            </p>
          </div>
        </Card>
      )}
    </>
  );
}

// Made with Bob
