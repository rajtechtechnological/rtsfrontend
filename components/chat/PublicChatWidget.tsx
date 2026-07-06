"use client";

import { ChatPanel } from "./ChatPanel";
import { ChatMascot } from "./ChatMascot";

const WELCOME_MESSAGE =
  "Hi, I'm Raj! Ask me about our courses, fees, or how to enrol — no login needed.";

/**
 * Public (no-login) chatbot for the marketing homepage. Talks to the
 * /api/chatbot/public/* endpoints, which only answer general FAQ + live
 * course/fee lookups — never account-specific data (see
 * app/config_data/intents.py `public=True` in the backend).
 */
export function PublicChatWidget() {
  return (
    <ChatPanel
      menuEndpoint="/api/chatbot/public/menu"
      messageEndpoint="/api/chatbot/public/message"
      welcomeMessage={WELCOME_MESSAGE}
      assistantName="Raj"
      assistantSubtitle="RTS Assistant"
      footerHint="Press Enter to send • Ask about courses, fees, or admissions"
      rateLimitMessage="Too many messages — please wait a moment before sending another."
      renderToggle={(onClick) => <ChatMascot onClick={onClick} />}
    />
  );
}
