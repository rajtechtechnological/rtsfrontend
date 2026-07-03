'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { studentExamsApi } from '@/lib/api/endpoints';
import type { ExamResult } from '@/types';
import { Button } from '@/components/ui/button';
import { LedgerTable, type LedgerColumn } from '@/components/ui/ledger-table';
import { Stamp } from '@/components/ui/stamp';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ExamResultsPage() {
    const [results, setResults] = useState<ExamResult[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

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
        </div>
    );
}
