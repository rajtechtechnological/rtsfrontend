'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { studentExamsApi } from '@/lib/api/endpoints';
import type { ExamAttemptStart, ExamQuestion } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    Flag,
    CheckCircle,
    Send,
    Loader2,
    AlertTriangle,
} from 'lucide-react';

export default function TakeExamPage() {
    const params = useParams();
    const router = useRouter();
    const examId = params.examId as string;

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [examData, setExamData] = useState<ExamAttemptStart | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | null>>({});
    const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
    const [timeRemaining, setTimeRemaining] = useState(0);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [showTimeWarning, setShowTimeWarning] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const attemptIdRef = useRef<string | null>(null);
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Start exam on mount
    useEffect(() => {
        startExam();
        return () => {
            if (saveTimeoutRef.current) {
                clearTimeout(saveTimeoutRef.current);
            }
        };
    }, [examId]);

    // Timer countdown
    useEffect(() => {
        if (timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeUp();
                    return 0;
                }
                // Show warning at 5 minutes
                if (prev === 300 && !showTimeWarning) {
                    setShowTimeWarning(true);
                    toast.warning('5 minutes remaining!');
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining]);

    const startExam = async () => {
        try {
            setIsLoading(true);
            const response = await studentExamsApi.startExam(examId);
            const data = response.data;
            setExamData(data);
            attemptIdRef.current = data.attempt_id;

            // Calculate time remaining
            const endTime = new Date(data.end_time).getTime();
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
            setTimeRemaining(remaining);

            // Initialize answers
            const initialAnswers: Record<string, string | null> = {};
            data.questions.forEach((q: ExamQuestion) => {
                initialAnswers[q.id] = null;
            });
            setAnswers(initialAnswers);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to start exam');
            router.push('/dashboard/exams');
        } finally {
            setIsLoading(false);
        }
    };

    const handleTimeUp = async () => {
        toast.error('Time is up! Submitting your exam...');
        await submitExam();
    };

    const saveAnswer = useCallback(async (questionId: string, option: string | null, forReview: boolean) => {
        if (!attemptIdRef.current) return;

        setIsSaving(true);
        try {
            await studentExamsApi.submitAnswer(
                attemptIdRef.current,
                questionId,
                option,
                forReview
            );
        } catch (error) {
            console.error('Failed to save answer:', error);
            // Don't show error toast for auto-save to avoid spamming
        } finally {
            setIsSaving(false);
        }
    }, []);

    const handleOptionSelect = (option: string) => {
        if (!examData) return;

        const question = examData.questions[currentIndex];
        const newAnswer = answers[question.id] === option ? null : option;

        setAnswers((prev) => ({
            ...prev,
            [question.id]: newAnswer,
        }));

        // Debounced save
        if (saveTimeoutRef.current) {
            clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = setTimeout(() => {
            saveAnswer(question.id, newAnswer, markedForReview.has(question.id));
        }, 300);
    };

    const handleMarkForReview = () => {
        if (!examData) return;

        const question = examData.questions[currentIndex];
        const newMarked = new Set(markedForReview);

        if (newMarked.has(question.id)) {
            newMarked.delete(question.id);
        } else {
            newMarked.add(question.id);
        }

        setMarkedForReview(newMarked);
        saveAnswer(question.id, answers[question.id], newMarked.has(question.id));
    };

    const goToQuestion = (index: number) => {
        if (index >= 0 && examData && index < examData.questions.length) {
            setCurrentIndex(index);
        }
    };

    const submitExam = async () => {
        if (!attemptIdRef.current) return;

        setIsSubmitting(true);
        try {
            await studentExamsApi.submitExam(attemptIdRef.current);
            toast.success('Exam submitted successfully!');
            router.push('/dashboard/exams/results');
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to submit exam');
        } finally {
            setIsSubmitting(false);
            setShowSubmitDialog(false);
        }
    };

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getQuestionStatus = (questionId: string) => {
        if (markedForReview.has(questionId)) return 'review';
        if (answers[questionId]) return 'answered';
        return 'unanswered';
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-blue-400 mb-4" />
                <p className="text-slate-400">Loading exam...</p>
            </div>
        );
    }

    if (!examData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
                <p className="text-slate-400">Failed to load exam</p>
                <Button onClick={() => router.push('/dashboard/exams')} className="mt-4">
                    Go Back
                </Button>
            </div>
        );
    }

    const currentQuestion = examData.questions[currentIndex];
    const answeredCount = Object.values(answers).filter(Boolean).length;
    const progress = (answeredCount / examData.total_questions) * 100;

    return (
        <div className="min-h-screen bg-slate-950 pb-24">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800 px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-white">{examData.exam_title}</h1>
                        <p className="text-sm text-slate-400">
                            Question {currentIndex + 1} of {examData.total_questions}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {isSaving && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Saving...
                            </span>
                        )}
                        <Badge
                            className={`flex items-center gap-1 px-3 py-1.5 ${
                                timeRemaining <= 300
                                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                            }`}
                        >
                            <Clock className="h-4 w-4" />
                            {formatTime(timeRemaining)}
                        </Badge>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 py-6">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">
                            {answeredCount} of {examData.total_questions} answered
                        </span>
                        <span className="text-sm text-slate-400">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Question Card */}
                <Card className="bg-slate-900 border-slate-800 mb-6">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-slate-400 border-slate-600">
                                    Q{currentIndex + 1}
                                </Badge>
                                <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                                    {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
                                </Badge>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleMarkForReview}
                                className={`${
                                    markedForReview.has(currentQuestion.id)
                                        ? 'text-yellow-400 hover:text-yellow-300'
                                        : 'text-slate-400 hover:text-white'
                                }`}
                            >
                                <Flag className="h-4 w-4 mr-1" />
                                {markedForReview.has(currentQuestion.id) ? 'Marked' : 'Mark for Review'}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-white mb-6 whitespace-pre-wrap">
                            {currentQuestion.question_text}
                        </p>

                        <div className="space-y-3">
                            {(['A', 'B', 'C', 'D'] as const).map((option) => {
                                const optionKey = `option_${option.toLowerCase()}` as keyof ExamQuestion;
                                const optionText = currentQuestion[optionKey] as string;
                                const isSelected = answers[currentQuestion.id] === option;

                                return (
                                    <button
                                        key={option}
                                        onClick={() => handleOptionSelect(option)}
                                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                                            isSelected
                                                ? 'bg-blue-500/20 border-blue-500 text-white'
                                                : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600 hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span
                                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                                    isSelected
                                                        ? 'bg-blue-500 text-white'
                                                        : 'bg-slate-700 text-slate-300'
                                                }`}
                                            >
                                                {option}
                                            </span>
                                            <span className="pt-1">{optionText}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Question Palette */}
                <Card className="bg-slate-900 border-slate-800 mb-6">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-slate-400">Question Palette</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2 mb-4">
                            {examData.questions.map((q, idx) => {
                                const status = getQuestionStatus(q.id);
                                return (
                                    <button
                                        key={q.id}
                                        onClick={() => goToQuestion(idx)}
                                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                                            idx === currentIndex
                                                ? 'ring-2 ring-blue-500'
                                                : ''
                                        } ${
                                            status === 'answered'
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : status === 'review'
                                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                : 'bg-slate-800 text-slate-400 border border-slate-700'
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/30" />
                                <span>Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30" />
                                <span>Marked for Review</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-slate-800 border border-slate-700" />
                                <span>Not Answered</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Footer Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 px-4 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => goToQuestion(currentIndex - 1)}
                        disabled={currentIndex === 0}
                        className="border-slate-700 text-slate-300"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>

                    <Button
                        onClick={() => setShowSubmitDialog(true)}
                        className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                    >
                        <Send className="h-4 w-4 mr-2" />
                        Submit Exam
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => goToQuestion(currentIndex + 1)}
                        disabled={currentIndex === examData.total_questions - 1}
                        className="border-slate-700 text-slate-300"
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>

            {/* Submit Confirmation Dialog */}
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <AlertDialogContent className="bg-slate-900 border-slate-800">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Submit Exam?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400">
                            <div className="space-y-2 mt-2">
                                <p>You have answered {answeredCount} of {examData.total_questions} questions.</p>
                                {examData.total_questions - answeredCount > 0 && (
                                    <p className="text-yellow-400">
                                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                                        {examData.total_questions - answeredCount} questions are unanswered.
                                    </p>
                                )}
                                {markedForReview.size > 0 && (
                                    <p className="text-yellow-400">
                                        <Flag className="h-4 w-4 inline mr-1" />
                                        {markedForReview.size} questions marked for review.
                                    </p>
                                )}
                                <p className="pt-2">Are you sure you want to submit?</p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="border-slate-700 text-slate-300 hover:bg-slate-800">
                            Continue Exam
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={submitExam}
                            disabled={isSubmitting}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Submit
                                </>
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
