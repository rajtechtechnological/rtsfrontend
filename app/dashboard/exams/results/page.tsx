'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { studentExamsApi } from '@/lib/api/endpoints';
import type { AttemptReview, ExamResult } from '@/types';
import { Button } from '@/components/ui/button';
import { LedgerTable, type LedgerColumn } from '@/components/ui/ledger-table';
import { Stamp } from '@/components/ui/stamp';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { Loader2, ArrowLeft, Eye, CheckCircle, XCircle } from 'lucide-react';
import Link from 'next/link';

/** One reviewed question: the four options with the student's recorded
 *  answer and the correct answer both marked. */
function ReviewQuestionCard({ q }: { q: AttemptReview['questions'][number] }) {
    const answered = q.selected_option !== null;
    return (
        <div className="rounded-md border border-line bg-paper p-4">
            <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-medium text-ink">
                    {q.position}. {q.question_text}
                </p>
                <span
                    className={cn(
                        'shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium',
                        !answered
                            ? 'bg-muted text-ink-muted'
                            : q.is_correct
                              ? 'bg-accent-soft text-primary'
                              : 'bg-danger/10 text-danger'
                    )}
                >
                    {!answered
                        ? `Not answered · 0/${q.marks}`
                        : q.is_correct
                          ? `Correct · ${q.marks_obtained}/${q.marks}`
                          : `Incorrect · ${q.marks_obtained}/${q.marks}`}
                </span>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                    const isCorrect = q.correct_option === opt;
                    const isSelected = q.selected_option === opt;
                    return (
                        <div
                            key={opt}
                            className={cn(
                                'flex items-center gap-2 rounded border p-2 text-sm',
                                isCorrect
                                    ? 'border-primary/50 bg-accent-soft text-primary'
                                    : isSelected
                                      ? 'border-danger/50 bg-danger/5 text-danger'
                                      : 'border-line bg-muted text-ink'
                            )}
                        >
                            <span className="font-medium">{opt}.</span>
                            <span className="flex-1">{q[`option_${opt.toLowerCase()}` as 'option_a']}</span>
                            {isSelected && (
                                <span className="text-[10px] font-medium uppercase tracking-wide">
                                    Your answer
                                </span>
                            )}
                            {isCorrect && <CheckCircle className="h-4 w-4 shrink-0" />}
                            {isSelected && !isCorrect && <XCircle className="h-4 w-4 shrink-0" />}
                        </div>
                    );
                })}
            </div>

            {q.explanation && (
                <p className="mt-3 rounded border border-line bg-accent-soft p-2 text-xs text-primary">
                    <strong>Explanation:</strong> {q.explanation}
                </p>
            )}
        </div>
    );
}

export default function ExamResultsPage() {
    const [results, setResults] = useState<ExamResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [review, setReview] = useState<AttemptReview | null>(null);
    const [reviewOpen, setReviewOpen] = useState(false);
    const [isLoadingReview, setIsLoadingReview] = useState(false);

    useEffect(() => {
        fetchResults();
    }, []);

    const openReview = async (attemptId: string) => {
        setReviewOpen(true);
        setIsLoadingReview(true);
        setReview(null);
        try {
            const response = await studentExamsApi.getAttemptReview(attemptId);
            setReview(response.data);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to load answers');
            setReviewOpen(false);
        } finally {
            setIsLoadingReview(false);
        }
    };

    const fetchResults = async () => {
        try {
            setIsLoading(true);
            const response = await studentExamsApi.getResults();
            setResults(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch results');
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const columns: LedgerColumn<ExamResult>[] = [
        {
            key: 'exam',
            header: 'Exam',
            cell: (result) => (
                <span className="font-medium">
                    {result.exam_title}
                    {result.attempt_number > 1 && (
                        <span className="ml-2 text-xs text-ink-muted">
                            Attempt {result.attempt_number}
                        </span>
                    )}
                </span>
            ),
        },
        {
            key: 'course',
            header: 'Course / Module',
            cell: (result) => (
                <span className="text-ink-muted">
                    {result.course_name} — {result.module_name}
                </span>
            ),
        },
        {
            key: 'marks',
            header: 'Marks',
            numeric: true,
            cell: (result) => `${result.obtained_marks}/${result.total_marks}`,
        },
        {
            key: 'correct',
            header: 'Correct',
            numeric: true,
            cell: (result) => `${result.correct_answers}/${result.total_questions}`,
        },
        {
            key: 'score',
            header: 'Score',
            numeric: true,
            cell: (result) => `${result.percentage.toFixed(1)}%`,
        },
        {
            key: 'duration',
            header: 'Duration',
            numeric: true,
            cell: (result) =>
                result.duration_taken_minutes ? `${result.duration_taken_minutes} min` : '—',
        },
        {
            key: 'taken',
            header: 'Taken',
            cell: (result) => formatDate(result.start_time),
        },
        {
            key: 'verified',
            header: 'Verified',
            cell: (result) =>
                result.verified_at ? (
                    formatDate(result.verified_at)
                ) : (
                    <span className="text-ink-muted">—</span>
                ),
        },
        {
            key: 'result',
            header: 'Result',
            align: 'right',
            cell: (result) => <Stamp status={result.passed ? 'Passed' : 'Failed'} bordered />,
        },
        {
            key: 'answers',
            header: 'Answers',
            align: 'right',
            cell: (result) => (
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-ink-muted hover:text-ink"
                    onClick={() => openReview(result.attempt_id)}
                >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                </Button>
            ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/exams">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="font-serif text-2xl font-semibold text-ink">My Exam Results</h1>
                    <p className="text-sm text-ink-muted mt-1">Verified exam results</p>
                </div>
            </div>

            <section className="rounded-md border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <h2 className="font-serif text-lg text-ink">Results Register</h2>
                    <span className="font-mono text-xs tabular-nums text-ink-muted">
                        {results.length} records
                    </span>
                </div>
                <LedgerTable
                    columns={columns}
                    rows={results}
                    rowKey={(result) => result.attempt_id}
                    emptyMessage="No verified results yet — results appear here after verification by your instructor."
                />
            </section>

            {/* Answer review — recorded answer vs correct answer, per question */}
            <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                <DialogContent className="bg-surface border-line max-h-[88vh] sm:max-w-3xl overflow-hidden p-0">
                    <DialogHeader className="border-b border-line px-6 pt-6 pb-4">
                        <DialogTitle className="font-serif text-xl text-ink">
                            {review ? review.attempt.exam_title : 'Answer review'}
                        </DialogTitle>
                        <DialogDescription className="text-ink-muted">
                            {review
                                ? `${review.attempt.course_name ?? ''} — ${review.attempt.module_name ?? ''} · ` +
                                  `${review.attempt.obtained_marks}/${review.attempt.total_marks} marks · ` +
                                  `${review.attempt.correct_answers}/${review.attempt.total_questions} correct`
                                : 'Your recorded answers next to the correct ones.'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
                        {isLoadingReview ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
                            </div>
                        ) : review ? (
                            <div className="space-y-3">
                                {review.questions.map((q) => (
                                    <ReviewQuestionCard key={q.position} q={q} />
                                ))}
                            </div>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
