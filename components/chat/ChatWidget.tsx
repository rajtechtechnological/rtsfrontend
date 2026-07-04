"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import apiClient from "@/lib/api/client";

export interface ChatChip {
  label: string;
  intent: string;
  entity?: Record<string, unknown> | null;
}

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  source?: string;
  chips?: ChatChip[];
}

const WELCOME_MESSAGE =
  "Welcome to Rajtech Technological Systems! I'm Raj, your assistant. Pick a topic below or type a question.";

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: WELCOME_MESSAGE,
      sender: "assistant",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [menuChips, setMenuChips] = useState<ChatChip[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load the role-specific menu chips for the empty state
    if (isOpen && menuChips.length === 0) {
      loadMenu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const loadMenu = async () => {
    try {
      const response = await apiClient.get("/api/chatbot/menu");
      setMenuChips(response.data.chips ?? []);
    } catch (error) {
      console.error("Failed to load chatbot menu:", error);
    }
  };

  const postMessage = async (
    body: { text: string } | { intent: string; entity?: Record<string, unknown> | null },
    displayText: string
  ) => {
    if (isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: displayText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await apiClient.post("/api/chatbot/message", body);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.reply,
        sender: "assistant",
        timestamp: new Date(),
        source: response.data.source,
        chips: response.data.chips ?? [],
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "I'm having trouble connecting right now. Please try again or contact your institution support.",
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendText = (text?: string) => {
    const textToSend = (text ?? inputValue).trim();
    if (!textToSend) return;
    postMessage({ text: textToSend }, textToSend);
  };

  // Chip clicks send {intent, entity} — they bypass text matching entirely.
  const handleChipClick = (chip: ChatChip) => {
    postMessage({ intent: chip.intent, entity: chip.entity ?? undefined }, chip.label);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  const lastMessage = messages[messages.length - 1];
  const activeChips: ChatChip[] =
    messages.length === 1
      ? menuChips
      : lastMessage.sender === "assistant" && lastMessage.chips
        ? lastMessage.chips
        : [];

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 group">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full shadow-lg bg-primary transition-all duration-300 hover:scale-110"
            aria-label="Chat with Raj"
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          <div className="absolute bottom-16 right-0 bg-muted text-ink text-xs px-3 py-2 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
            Ask Raj anything
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-96 h-[600px] shadow-2xl flex flex-col z-50 border border-line bg-surface ">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-line bg-accent-soft">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10 bg-primary flex items-center justify-center">
                  <MessageCircle className="h-5 w-5 text-ink" />
                </Avatar>
                <span className="absolute bottom-0 right-0 h-3 w-3 bg-primary rounded-full border-2 border-line"></span>
              </div>
              <div>
                <h3 className="font-semibold text-ink">Raj</h3>
                <p className="text-xs text-ink-muted">RTS Assistant</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-muted rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.sender === "assistant" && (
                  <Avatar className="h-8 w-8 bg-primary flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="h-4 w-4 text-ink" />
                  </Avatar>
                )}
                <div
                  className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-ink border border-line"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8 bg-muted flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold">You</span>
                  </Avatar>
                )}
              </div>
            ))}

            {/* Chips: role menu for the empty state, follow-ups after a reply */}
            {!isLoading && activeChips.length > 0 && (
              <div className="space-y-2">
                {messages.length === 1 && (
                  <p className="text-xs text-ink-muted text-center">I can help with:</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {activeChips.map((chip, index) => (
                    <button
                      key={`${chip.intent}-${index}`}
                      onClick={() => handleChipClick(chip)}
                      className="px-3 py-2 text-xs bg-muted hover:bg-muted border border-line rounded-full text-ink transition-colors duration-200"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex items-center gap-2 text-ink-muted">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Looking that up...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-line bg-surface">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 bg-muted border-line focus:border-ring text-ink placeholder:text-ink-muted"
              />
              <Button
                onClick={() => handleSendText()}
                disabled={!inputValue.trim() || isLoading}
                className="bg-primary disabled:opacity-50 disabled:cursor-not-allowed"
                size="icon"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-ink-muted mt-2 text-center">
              Press Enter to send • Answers come from your institution&apos;s records
            </p>
          </div>
        </Card>
      )}
    </>
  );
}
