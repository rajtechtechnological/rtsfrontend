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
    Languages,
} from 'lucide-react';
import apiClient from '@/lib/api/client';

type Lang = 'hi' | 'en';

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

// ---------------------------------------------------------------------------
// UI strings for each language
// ---------------------------------------------------------------------------
const UI = {
    hi: {
        title: 'सहायक',
        subtitle: 'आपकी संस्था के रिकॉर्ड से तुरंत जवाब',
        greeting:
            'नमस्ते! मैं राज हूँ, आपका RTS सहायक। मैं आपकी संस्था के रिकॉर्ड से फ़ीस, परीक्षाएं, परिणाम, कोर्स और अधिक के बारे में जवाब देता हूँ। नीचे कोई विषय चुनें या अपना प्रश्न टाइप करें।',
        placeholder: 'फ़ीस, परीक्षा, परिणाम, कोर्स के बारे में पूछें...',
        lookingUp: 'जानकारी खोज रहा हूँ...',
        canHelpWith: 'मैं इनमें मदद कर सकता हूँ',
        switchLang: 'English',
        serverError:
            'सर्वर से संपर्क नहीं हो सका। कृपया दोबारा कोशिश करें या अपनी संस्था के सहायता से संपर्क करें।',
    },
    en: {
        title: 'Assistant',
        subtitle: "Instant answers from your institution's records",
        greeting:
            "Hello! I'm Raj, your RTS assistant. I answer from your institution's records — fees, exams, results, courses and more. Pick a topic below or type a question.",
        placeholder: 'Ask about fees, exams, results, courses...',
        lookingUp: 'Looking that up...',
        canHelpWith: 'I can help with',
        switchLang: 'हिंदी',
        serverError:
            "I couldn't reach the server. Please try again or contact your institution support.",
    },
};

export default function ChatbotPage() {
    const [lang, setLang] = useState<Lang>('hi');
    const t = UI[lang];

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: UI['hi'].greeting,
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

    // Reload menu chips when language changes
    useEffect(() => {
        const loadMenu = async () => {
            try {
                const response = await apiClient.get(`/api/chatbot/menu?lang=${lang}`);
                setMenuChips(response.data.chips ?? []);
            } catch (error) {
                console.error('Failed to load chatbot menu:', error);
            }
        };
        loadMenu();
    }, [lang]);

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
            const response = await apiClient.post('/api/chatbot/message', {
                ...body,
                lang,
            });
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
                content: t.serverError,
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

    // Switch language: update state and append a new greeting in the new language
    const toggleLang = () => {
        const next: Lang = lang === 'hi' ? 'en' : 'hi';
        setLang(next);
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now().toString(),
                role: 'assistant',
                content: UI[next].greeting,
                timestamp: new Date(),
            },
        ]);
    };

    const lastMessage = messages[messages.length - 1];
    const followupChips: ChatChip[] =
        messages.length > 1 && lastMessage.role === 'assistant' && lastMessage.chips
            ? lastMessage.chips
            : [];

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
                        <MessageSquare className="h-7 w-7 text-primary" />
                        {t.title}
                    </h1>
                    <p className="text-ink-muted mt-1">{t.subtitle}</p>
                </div>
                {/* Language toggle */}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleLang}
                    className="flex items-center gap-1.5 border-line text-ink hover:bg-muted mt-1"
                    title={lang === 'hi' ? 'Switch to English' : 'हिंदी में बदलें'}
                >
                    <Languages className="h-4 w-4" />
                    {t.switchLang}
                </Button>
            </div>

            {/* Chat Container */}
            <Card className="flex-1 flex flex-col bg-surface border-line overflow-hidden">
                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            {message.role === 'assistant' && (
                                <Avatar className="h-8 w-8 ring-2 ring-primary/20 flex-shrink-0">
                                    <AvatarFallback className="bg-accent-soft text-ink">
                                        <Bot className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-3 ${message.role === 'user'
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-muted text-ink'
                                    }`}
                            >
                                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                    {/* **bold** rendered as elements, never as raw HTML
                                        (message content may echo user input — XSS). */}
                                    {message.content.split('\n').map((line, i, lines) => (
                                        <span key={i}>
                                            {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) =>
                                                part.startsWith('**') && part.endsWith('**') ? (
                                                    <strong key={j}>{part.slice(2, -2)}</strong>
                                                ) : (
                                                    part
                                                )
                                            )}
                                            {i < lines.length - 1 && <br />}
                                        </span>
                                    ))}
                                </div>
                                <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-primary' : 'text-ink-muted'}`}>
                                    {message.timestamp.toLocaleTimeString('en-IN', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </p>
                            </div>
                            {message.role === 'user' && (
                                <Avatar className="h-8 w-8 ring-2 ring-primary/20 flex-shrink-0">
                                    <AvatarFallback className="bg-accent-soft text-ink">
                                        <User className="h-4 w-4" />
                                    </AvatarFallback>
                                </Avatar>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex gap-3">
                            <Avatar className="h-8 w-8 ring-2 ring-primary/20">
                                <AvatarFallback className="bg-accent-soft text-ink">
                                    <Bot className="h-4 w-4" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="bg-muted rounded-2xl px-4 py-3">
                                <div className="flex items-center gap-2 text-ink-muted">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-sm">{t.lookingUp}</span>
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
                                    className="border-line text-ink hover:bg-muted hover:text-ink"
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
                        <p className="text-sm text-ink-muted mb-2 flex items-center gap-1">
                            <Sparkles className="h-4 w-4" />
                            {t.canHelpWith}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {menuChips.map((chip, index) => (
                                <Button
                                    key={`${chip.intent}-${index}`}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleChipClick(chip)}
                                    className="border-line text-ink hover:bg-muted hover:text-ink"
                                >
                                    {chip.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input */}
                <div className="border-t border-line p-4">
                    <div className="flex gap-2">
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={t.placeholder}
                            disabled={isLoading}
                            className="flex-1 bg-muted border-line text-ink placeholder:text-ink-muted focus:border-ring"
                        />
                        <Button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className="bg-primary text-primary-foreground px-4"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}
