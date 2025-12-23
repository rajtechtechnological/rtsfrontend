'use client';

import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

const suggestedQuestions = [
    'What courses are available?',
    'How do I enroll a new student?',
    'How is payroll calculated?',
    'How to generate certificates?',
];

export default function ChatbotPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Hello! I'm your AI assistant for EduManage. I can help you with questions about courses, students, staff management, payroll, and more. How can I assist you today?",
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (message?: string) => {
        const messageText = message || input;
        if (!messageText.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Simulate AI response (in production, this would call the API)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Mock responses based on question
            let responseContent = '';
            const lowerMessage = messageText.toLowerCase();

            if (lowerMessage.includes('course')) {
                responseContent = "We offer a variety of courses including:\n\n• **Web Development Bootcamp** (6 months) - ₹45,000\n• **Python Programming** (3 months) - ₹25,000\n• **Data Science Essentials** (6 months) - ₹55,000\n• **Mobile App Development** (4 months) - ₹40,000\n• **UI/UX Design** (3 months) - ₹30,000\n\nYou can view all courses in the Courses section or enroll students through the Students page.";
            } else if (lowerMessage.includes('student') || lowerMessage.includes('enroll')) {
                responseContent = "To enroll a new student:\n\n1. Go to the **Students** section from the sidebar\n2. Click the **Add Student** button\n3. Fill in the student details (name, email, phone, etc.)\n4. After adding, you can enroll them in courses from their profile\n5. Record fee payments as they are received\n\nNeed help with anything else?";
            } else if (lowerMessage.includes('payroll')) {
                responseContent = "Payroll is calculated based on attendance:\n\n• **Formula**: `(Days Present × Daily Rate) + (Half Days × Daily Rate × 0.5)`\n• Daily rates are set per staff member\n• Deductions can be applied as needed\n\nTo generate payroll:\n1. Ensure attendance is marked for the month\n2. Go to the **Payroll** section\n3. Select the month and year\n4. Review calculations and generate payslips\n\nWould you like more details?";
            } else if (lowerMessage.includes('certificate')) {
                responseContent = "Certificates are generated for students who complete their courses:\n\n1. Go to the **Certificates** section\n2. Students with 'eligible' status can have certificates generated\n3. Click **Generate** to create the certificate\n4. Each certificate has a unique number (e.g., INST-WEB-2024-001)\n5. Download or share the PDF certificate\n\nIs there anything specific about certificates you'd like to know?";
            } else {
                responseContent = "I can help you with various aspects of the EduManage platform:\n\n• **Students**: Adding, enrolling, and managing student records\n• **Staff**: Managing staff members and their daily rates\n• **Attendance**: Marking and tracking staff attendance\n• **Payroll**: Calculating salaries and generating payslips\n• **Courses**: Creating and managing course offerings\n• **Certificates**: Generating completion certificates\n\nWhat would you like to know more about?";
            }

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: responseContent,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch {
            toast.error('Failed to get response');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col">
            {/* Header */}
            <div className="mb-4">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <MessageSquare className="h-7 w-7 text-blue-400" />
                    AI Assistant
                </h1>
                <p className="text-slate-400 mt-1">Get help with platform features and questions</p>
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
                                    <span className="text-sm">Thinking...</span>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </CardContent>

                {/* Suggested Questions */}
                {messages.length === 1 && (
                    <div className="px-4 pb-4">
                        <p className="text-sm text-slate-400 mb-2 flex items-center gap-1">
                            <Sparkles className="h-4 w-4" />
                            Suggested questions
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {suggestedQuestions.map((question) => (
                                <Button
                                    key={question}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleSend(question)}
                                    className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                                >
                                    {question}
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
                            placeholder="Ask me anything about EduManage..."
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
