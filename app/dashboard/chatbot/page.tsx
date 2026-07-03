'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    MessageSquare,
    Send,
    Bot,
    User,
    Loader2,
    Sparkles,
} from 'lucide-react';
import apiClient from '@/lib/api/client';

interface ChatChip {
    label: string;
    intent: string;
    entity?: Record<string, unknown> | null;
}

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    source?: string;
    chips?: ChatChip[];
}

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content:
                "Hello! I'm Raj, your RTS assistant. I answer from your institution's records — fees, exams, results, courses and more. Pick a topic below or type a question.",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [menuChips, setMenuChips] = useState<ChatChip[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        // Role-specific menu chips for the empty state
        const loadMenu = async () => {
            try {
                const response = await apiClient.get('/api/chatbot/menu');
                setMenuChips(response.data.chips ?? []);
            } catch (error) {
                console.error('Failed to load chatbot menu:', error);
            }
        };
        loadMenu();
    }, []);

    const postMessage = async (
        body: { text: string } | { intent: string; entity?: Record<string, unknown> | null },
        displayText: string
    ) => {
        if (isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: displayText,
            timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await apiClient.post('/api/chatbot/message', body);
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.data.reply,
                timestamp: new Date(),
                source: response.data.source,
                chips: response.data.chips ?? [],
            };
            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chatbot error:', error);
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content:
                    "I couldn't reach the server. Please try again or contact your institution support.",
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSend = (message?: string) => {
        const messageText = (message ?? input).trim();
        if (!messageText) return;
        postMessage({ text: messageText }, messageText);
    };

    // Chip clicks send {intent, entity} — no free-text matching involved.
    const handleChipClick = (chip: ChatChip) => {
        postMessage({ intent: chip.intent, entity: chip.entity ?? undefined }, chip.label);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const lastMessage = messages[messages.length - 1];
    const followupChips: ChatChip[] =
        messages.length > 1 && lastMessage.role === 'assistant' && lastMessage.chips
            ? lastMessage.chips
            : [];

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="h-7 w-7 text-blue-400" />
                    Assistant
                </h1>
                <p className="text-slate-400 mt-1">
                    Instant answers from your institution&apos;s records
                </p>
            </div>

            {/* Chat Container */}
            <Card className="flex-1 flex flex-col bg-slate-900/50 border-slate-800 overflow-hidden">
                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <Avatar className="h-8 w-8 ring-2 ring-blue-500/20 flex-shrink-0">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                                        : 'bg-slate-800 text-slate-100'
                                    }`}
                            >
                                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {message.content.split('\n').map((line, i) => {
                                        // Simple markdown-like formatting for bold text
                                        const formattedLine = line.replace(
                                            /\*\*(.*?)\*\*/g,
                                            '<strong>$1</strong>'
                                        );
                                        return (
                                            <span
                                                key={i}
                                                dangerouslySetInnerHTML={{ __html: formattedLine + (i < message.content.split('\n').length - 1 ? '<br/>' : '') }}
                                            />
                                        );
                                    })}
                                </div>
                                <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                                    {message.timestamp.toLocaleTimeString('en-IN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            {message.role === 'user' && (
                                <Avatar className="h-8 w-8 ring-2 ring-purple-500/20 flex-shrink-0">
                                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                                        <User className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <Avatar className="h-8 w-8 ring-2 ring-blue-500/20">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                    <Bot className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="bg-slate-800 rounded-2xl px-4 py-3">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">Looking that up...</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Follow-up chips from the last reply */}
                    {!isLoading && followupChips.length > 0 && (
                        <div className="flex flex-wrap gap-2 pl-11">
                            {followupChips.map((chip, index) => (
                                <Button
                                    key={`${chip.intent}-${index}`}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleChipClick(chip)}
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                                >
                                    {chip.label}
                                </Button>
                            ))}
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>

                {/* Role-specific menu chips (empty state) */}
                {messages.length === 1 && menuChips.length > 0 && (
                    <div className="px-4 pb-4">
                        <p className="text-sm text-slate-400 mb-2 flex items-center gap-1">
                            <Sparkles className="h-4 w-4" />
                            I can help with
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {menuChips.map((chip, index) => (
                                <Button
                                    key={`${chip.intent}-${index}`}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleChipClick(chip)}
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                                >
                                    {chip.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="border-t border-slate-800 p-4">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask about fees, exams, results, courses..."
                            disabled={isLoading}
                            className="flex-1 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-blue-500"
                        />
                        <Button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-4"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
