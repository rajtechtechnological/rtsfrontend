"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle, X, Send } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

const SUGGESTIONS = [
  "How do I enroll a student?",
  "How to mark attendance?",
  "Generate payroll",
  "Issue certificate",
  "View payment history",
];

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (messageText?: string) => {
    const textToSend = messageText || inputValue;
    if (!textToSend.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: textToSend,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setShowSuggestions(false);

    // Simulate assistant response (will be replaced with backend integration)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Thanks for your message! I'm still learning. Backend integration coming soon, and I'll be able to help you better!",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
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
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-slate-900"></span>
              </div>
              <div>
                <h3 className="font-semibold text-white">Raj</h3>
                <p className="text-xs text-slate-400">AI Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-slate-800 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
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
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 bg-slate-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold">You</span>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Suggestions */}
            {showSuggestions && messages.length === 1 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-400 text-center">Quick suggestions:</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="px-3 py-2 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-full text-slate-200 transition-colors duration-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
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
                placeholder="Type your message..."
                className="flex-1 bg-slate-800 border-slate-700 focus:border-purple-600 focus:ring-purple-600 text-white placeholder:text-slate-400"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-slate-500 mt-2 text-center">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
