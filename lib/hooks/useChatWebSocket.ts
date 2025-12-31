"use client";

import { useEffect, useRef, useState, useCallback } from "react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
  source?: string;
  relatedQuestions?: string[];
}

interface WebSocketMessage {
  type: string;
  message?: string;
  response?: string;
  source?: string;
  confidence?: number;
  related_questions?: string[];
  faq_id?: string;
  chunk?: string;
  error?: string;
}

interface UseChatWebSocketProps {
  token: string | null;
  onMessage?: (message: Message) => void;
  onError?: (error: string) => void;
  streaming?: boolean;
}

export function useChatWebSocket({
  token,
  onMessage,
  onError,
  streaming = false,
}: UseChatWebSocketProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [authFailed, setAuthFailed] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const streamingMessageRef = useRef<string>("");
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 3;

  // Use refs to avoid stale closures and prevent infinite re-renders
  const authFailedRef = useRef(false);
  const tokenRef = useRef<string | null>(null);
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  const isConnectingRef = useRef(false);

  // Keep refs in sync with props (without triggering re-renders)
  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
  }, [onMessage, onError]);

  // Handle token changes
  useEffect(() => {
    tokenRef.current = token;
    // Reset auth failed state when token changes (user logged in again)
    if (token && authFailedRef.current) {
      console.log("New token detected, resetting auth failed state");
      authFailedRef.current = false;
      setAuthFailed(false);
      reconnectAttempts.current = 0;
    }
  }, [token]);

  const getWebSocketUrl = useCallback(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    // Get base URL from env or use current host
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || `http://${window.location.hostname}:8000`;
    // Extract just the host:port part
    const url = new URL(apiUrl);
    const host = url.host;
    const endpoint = streaming ? "/api/chatbot/ws/chat/stream" : "/api/chatbot/ws/chat";
    return `${protocol}//${host}${endpoint}`;
  }, [streaming]);

  const connect = useCallback(() => {
    const currentToken = tokenRef.current;

    // Don't connect if no token
    if (!currentToken) {
      console.log("No token available, skipping WebSocket connection");
      return;
    }

    // Don't reconnect if auth already failed
    if (authFailedRef.current) {
      console.log("Auth previously failed, not reconnecting");
      return;
    }

    // Prevent multiple simultaneous connection attempts
    if (isConnectingRef.current) {
      console.log("Already connecting, skipping");
      return;
    }

    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("Already connected");
      return;
    }

    if (wsRef.current?.readyState === WebSocket.CONNECTING) {
      console.log("Connection in progress");
      return;
    }

    // Limit reconnection attempts
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      console.log("Max reconnection attempts reached");
      return;
    }

    isConnectingRef.current = true;
    setIsConnecting(true);

    let wsUrl: string;
    try {
      wsUrl = getWebSocketUrl();
    } catch (e) {
      console.error("Failed to construct WebSocket URL:", e);
      isConnectingRef.current = false;
      setIsConnecting(false);
      return;
    }

    console.log("Connecting to WebSocket:", wsUrl);
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected, sending auth...");
      // Send authentication using ref for current token
      ws.send(JSON.stringify({ type: "auth", token: tokenRef.current }));
    };

    ws.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);

        switch (data.type) {
          case "connected":
            isConnectingRef.current = false;
            setIsConnected(true);
            setIsConnecting(false);
            reconnectAttempts.current = 0; // Reset on successful connection
            console.log("Chatbot connected:", data.message);
            break;

          case "response":
            // Complete response received
            if (onMessageRef.current && data.response) {
              onMessageRef.current({
                id: Date.now().toString(),
                content: data.response,
                sender: "assistant",
                timestamp: new Date(),
                source: data.source,
                relatedQuestions: data.related_questions,
              });
            }
            break;

          case "stream_start":
            // Start of streaming response
            streamingMessageRef.current = "";
            break;

          case "stream_chunk":
            // Chunk of streaming response
            if (data.chunk) {
              streamingMessageRef.current += data.chunk;
              // Optionally call onMessage for each chunk to show real-time typing
              if (onMessageRef.current) {
                onMessageRef.current({
                  id: "streaming",
                  content: streamingMessageRef.current,
                  sender: "assistant",
                  timestamp: new Date(),
                  source: "gemini",
                });
              }
            }
            break;

          case "stream_end":
            // End of streaming response
            if (onMessageRef.current && streamingMessageRef.current) {
              onMessageRef.current({
                id: Date.now().toString(),
                content: streamingMessageRef.current,
                sender: "assistant",
                timestamp: new Date(),
                source: "gemini",
                relatedQuestions: data.related_questions,
              });
            }
            streamingMessageRef.current = "";
            break;

          case "error":
            console.error("WebSocket error from server:", data.error);
            // Check if it's an auth error
            if (data.error?.toLowerCase().includes("auth")) {
              authFailedRef.current = true;
              setAuthFailed(true);
            }
            if (onErrorRef.current) {
              onErrorRef.current(data.error || "Unknown error");
            }
            break;

          case "pong":
            // Heartbeat response
            break;

          default:
            console.log("Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onerror = (event) => {
      // WebSocket error event doesn't contain useful info, but we can log the state
      console.error("WebSocket connection error. ReadyState:", ws.readyState, "URL:", wsUrl);
      isConnectingRef.current = false;
      setIsConnecting(false);
      if (onErrorRef.current) {
        onErrorRef.current("Connection error - check if backend is running");
      }
    };

    ws.onclose = (event) => {
      console.log("WebSocket disconnected, code:", event.code, "reason:", event.reason);
      isConnectingRef.current = false;
      setIsConnected(false);
      setIsConnecting(false);
      wsRef.current = null;

      // Don't reconnect if auth failed or no token (use refs for current values)
      if (authFailedRef.current || !tokenRef.current) {
        console.log("Not reconnecting - auth failed or no token");
        return;
      }

      // Increment reconnect attempts
      reconnectAttempts.current++;

      // Only attempt to reconnect if under the limit
      if (reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(3000 * reconnectAttempts.current, 10000); // Exponential backoff, max 10s
        console.log(`Attempting to reconnect in ${delay}ms (attempt ${reconnectAttempts.current}/${maxReconnectAttempts})...`);
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, delay);
      } else {
        console.log("Max reconnection attempts reached, giving up");
        if (onErrorRef.current) {
          onErrorRef.current("Unable to connect to chat server. Please refresh the page.");
        }
      }
    };

    wsRef.current = ws;
  }, [getWebSocketUrl]); // Only depend on stable getWebSocketUrl

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "message", message }));
      return true;
    }
    return false;
  }, []);

  const sendPing = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: "ping" }));
    }
  }, []);

  // Store connect in a ref for stable reference
  const connectRef = useRef(connect);
  connectRef.current = connect;

  // Connect when token becomes available (only depends on token)
  useEffect(() => {
    if (token) {
      // Small delay to ensure refs are set
      const connectTimeout = setTimeout(() => {
        connectRef.current();
      }, 100);
      return () => clearTimeout(connectTimeout);
    }
  }, [token]); // eslint-disable-line react-hooks/exhaustive-deps

  // Heartbeat and cleanup (runs once on mount)
  useEffect(() => {
    const heartbeatInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000); // Every 30 seconds

    return () => {
      clearInterval(heartbeatInterval);
      // Cleanup on unmount
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, []);

  return {
    isConnected,
    isConnecting,
    authFailed,
    hasToken: !!token,
    sendMessage,
    disconnect,
    reconnect: connect,
  };
}

// Made with Bob
