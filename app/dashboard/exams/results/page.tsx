'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { studentExamsApi } from '@/lib/api/endpoints';
import type { ExamResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Award,
    Clock,
    CheckCircle,
    XCircle,
    Loader2,
    ArrowLeft,
    Trophy,
    Target,
    FileText,
    Calendar,
} from 'lucide-react';
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

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
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
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Award className="h-7 w-7 text-yellow-400" />
                        My Exam Results
                    </h1>
                    <p className="text-slate-400 mt-1">View your verified exam results</p>
                </div>
            </div>

            {results.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileText className="h-12 w-12 text-slate-600 mb-4" />
                        <p className="text-slate-400 text-center">No verified results yet</p>
                        <p className="text-sm text-slate-500 mt-2">Results will appear here after verification by your instructor</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {results.map((result) => (
                        <Card key={result.attempt_id} className="bg-slate-900/50 border-slate-800">
                            <CardHeader className="pb-3">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                    <div>
                                        <CardTitle className="text-lg text-white flex items-center gap-2">
                                            {result.passed ? (
                                                <Trophy className="h-5 w-5 text-yellow-400" />
                                            ) : (
                                                <Target className="h-5 w-5 text-slate-400" />
                                            )}
                                            {result.exam_title}
                                        </CardTitle>
                                        <p className="text-sm text-slate-400 mt-1">
                                            {result.course_name} - {result.module_name}
                                        </p>
                                    </div>
                                    <Badge
                                        className={`${
                                            result.passed
                                                ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                                : 'bg-red-500/10 text-red-400 border-red-500/30'
                                        }`}
                                    >
                                        {result.passed ? (
                                            <>
                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                Passed
                                            </>
                                        ) : (
                                            <>
                                                <XCircle className="h-3 w-3 mr-1" />
                                                Failed
                                            </>
                                        )}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                    <div className="bg-slate-800/50 rounded-lg p-3">
                                        <p className="text-xs text-slate-400 mb-1">Score</p>
                                        <p className={`text-2xl font-bold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                                            {result.percentage.toFixed(1)}%
                                        </p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-3">
                                        <p className="text-xs text-slate-400 mb-1">Marks</p>
                                        <p className="text-2xl font-bold text-white">
                                            {result.obtained_marks}/{result.total_marks}
                                        </p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-3">
                                        <p className="text-xs text-slate-400 mb-1">Correct</p>
                                        <p className="text-2xl font-bold text-blue-400">
                                            {result.correct_answers}/{result.total_questions}
                                        </p>
                                    </div>
                                    <div className="bg-slate-800/50 rounded-lg p-3">
                                        <p className="text-xs text-slate-400 mb-1">Duration</p>
                                        <p className="text-2xl font-bold text-purple-400">
                                            {result.duration_taken_minutes || '-'} min
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        <span>Taken: {formatDate(result.start_time)}</span>
                                    </div>
                                    {result.verified_at && (
                                        <div className="flex items-center gap-1">
                                            <CheckCircle className="h-4 w-4 text-green-400" />
                                            <span>Verified: {formatDate(result.verified_at)}</span>
                                        </div>
                                    )}
                                    {result.attempt_number > 1 && (
                                        <Badge variant="outline" className="text-slate-400 border-slate-600">
                                            Attempt #{result.attempt_number}
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
