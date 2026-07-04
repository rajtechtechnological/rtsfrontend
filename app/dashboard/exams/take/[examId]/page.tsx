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

            // Calculate time remaining from the server-authoritative deadline
            const deadline = new Date(data.deadline ?? data.end_time).getTime();
            const now = Date.now();
            const remaining = Math.max(0, Math.floor((deadline - now) / 1000));
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
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p className="text-ink-muted">Loading exam...</p>
            </div>
        );
    }

    if (!examData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <AlertTriangle className="h-12 w-12 text-danger mb-4" />
                <p className="text-ink-muted">Failed to load exam</p>
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
        <div className="min-h-screen bg-paper pb-24">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-surface border-b border-line px-4 py-3">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <div>
                        <h1 className="text-lg font-semibold text-ink">{examData.exam_title}</h1>
                        <p className="text-sm text-ink-muted">
                            Question {currentIndex + 1} of {examData.total_questions}
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {isSaving && (
                            <span className="text-xs text-ink-muted flex items-center gap-1">
                                <Loader2 className="h-3 w-3 animate-spin" />
                                Saving...
                            </span>
                        )}
                        <Badge
                            className={`flex items-center gap-1 px-3 py-1.5 ${
                                timeRemaining <= 300
                                    ? 'bg-danger/10 text-danger border-line'
                                    : 'bg-accent-soft text-primary border-line'
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
                        <span className="text-sm text-ink-muted">
                            {answeredCount} of {examData.total_questions} answered
                        </span>
                        <span className="text-sm text-ink-muted">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Question Card */}
                <Card className="bg-surface border-line mb-6">
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-ink-muted border-line">
                                    Q{currentIndex + 1}
                                </Badge>
                                <Badge className="bg-accent-soft text-primary border-line">
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
                                        : 'text-ink-muted hover:text-ink'
                                }`}
                            >
                                <Flag className="h-4 w-4 mr-1" />
                                {markedForReview.has(currentQuestion.id) ? 'Marked' : 'Mark for Review'}
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg text-ink mb-6 whitespace-pre-wrap">
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
                                                ? 'bg-accent-soft border-primary text-ink'
                                                : 'bg-muted border-line text-ink hover:border-primary/40 hover:bg-muted'
                                        }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span
                                                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                                    isSelected
                                                        ? 'bg-primary text-primary-foreground'
                                                        : 'bg-muted text-ink'
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
                <Card className="bg-surface border-line mb-6">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm text-ink-muted">Question Palette</CardTitle>
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
                                                ? 'ring-2 ring-primary'
                                                : ''
                                        } ${
                                            status === 'answered'
                                                ? 'bg-accent-soft text-primary border border-line'
                                                : status === 'review'
                                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                                : 'bg-muted text-ink-muted border border-line'
                                        }`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex flex-wrap gap-4 text-xs text-ink-muted">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-accent-soft border border-line" />
                                <span>Answered</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/30" />
                                <span>Marked for Review</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-muted border border-line" />
                                <span>Not Answered</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Footer Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-line px-4 py-4">
                <div className="max-w-4xl mx-auto flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={() => goToQuestion(currentIndex - 1)}
                        disabled={currentIndex === 0}
                        className="border-line text-ink"
                    >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                    </Button>

                    <Button
                        onClick={() => setShowSubmitDialog(true)}
                        className="bg-primary text-primary-foreground"
                    >
                        <Send className="h-4 w-4 mr-2" />
                        Submit Exam
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => goToQuestion(currentIndex + 1)}
                        disabled={currentIndex === examData.total_questions - 1}
                        className="border-line text-ink"
                    >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </div>
            </div>

            {/* Submit Confirmation Dialog */}
            <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
                <AlertDialogContent className="bg-surface border-line">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-ink">Submit Exam?</AlertDialogTitle>
                        <AlertDialogDescription className="text-ink-muted">
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
                        <AlertDialogCancel className="border-line text-ink hover:bg-muted">
                            Continue Exam
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={submitExam}
                            disabled={isSubmitting}
                            className="bg-primary text-primary-foreground"
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
