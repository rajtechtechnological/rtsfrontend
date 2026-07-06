"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { ChatPanel, type ChatChip } from "./ChatPanel";

export type { ChatChip };

const WELCOME_MESSAGE =
  "Welcome to Rajtech Technological Systems! I'm Raj, your assistant. Pick a topic below or type a question.";

export function ChatWidget() {
  return (
    <ChatPanel
      menuEndpoint="/api/chatbot/menu"
      messageEndpoint="/api/chatbot/message"
      welcomeMessage={WELCOME_MESSAGE}
      assistantName="Raj"
      assistantSubtitle="RTS Assistant"
      footerHint="Press Enter to send • Answers come from your institution's records"
      renderToggle={(onClick) => (
        <div className="fixed bottom-6 right-6 z-50 group">
          <Button
            onClick={onClick}
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
    />
  );
}
