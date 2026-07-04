'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { examsApi } from '@/lib/api/endpoints';
import type { ExamAttempt } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    CheckCircle,
    XCircle,
    Loader2,
    ArrowLeft,
    Eye,
    RefreshCw,
    Search,
    ClipboardCheck,
    Users,
    TrendingUp,
    Award,
} from 'lucide-react';
import Link from 'next/link';

interface VerificationStats {
    pending_verification: number;
    verified_today: number;
    total_verified: number;
    pass_rate: number;
    average_score: number;
}

export default function ExamVerificationPage() {
    const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
    const [stats, setStats] = useState<VerificationStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedAttempt, setSelectedAttempt] = useState<any>(null);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [attemptsRes, statsRes] = await Promise.all([
                examsApi.getPendingVerifications(),
                examsApi.getVerificationStats()
            ]);
            setAttempts(attemptsRes.data || []);
            setStats(statsRes.data);
        } catch (error) {
            toast.error('Failed to fetch verification data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReview = async (attemptId: string) => {
        try {
            const response = await examsApi.reviewAttempt(attemptId);
            setSelectedAttempt(response.data);
            setIsReviewOpen(true);
        } catch (error) {
            toast.error('Failed to load attempt details');
        }
    };

    const handleVerify = async (attemptId: string) => {
        setIsVerifying(true);
        try {
            await examsApi.verifyAttempt(attemptId);
            toast.success('Result verified and released to student');
            fetchData();
            setIsReviewOpen(false);
        } catch (error) {
            toast.error('Failed to verify result');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleAllowRetake = async (attemptId: string) => {
        setIsVerifying(true);
        try {
            await examsApi.allowRetake(attemptId);
            toast.success('Retake allowed for student');
            fetchData();
            setIsReviewOpen(false);
        } catch (error) {
            toast.error('Failed to allow retake');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleBulkVerify = async () => {
        if (attempts.length === 0) return;

        const ids = attempts.map(a => a.id);
        try {
            const response = await examsApi.verifyBulk(ids);
            toast.success(`Verified ${response.data.verified_count} results`);
            fetchData();
        } catch (error) {
            toast.error('Failed to verify results');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const filteredAttempts = attempts.filter((attempt) =>
        (attempt.student_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (attempt.exam_title?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
                        <ClipboardCheck className="h-7 w-7 text-primary" />
                        Exam Verification
                    </h1>
                    <p className="text-ink-muted mt-1">Review and verify student exam results</p>
                </div>
                <Button onClick={fetchData} variant="outline" className="border-line">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card className="bg-surface border-line">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-yellow-500/10">
                                    <ClipboardCheck className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-ink-muted">Pending</p>
                                    <p className="text-2xl font-bold text-ink">{stats.pending_verification}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-surface border-line">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-accent-soft">
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-ink-muted">Today</p>
                                    <p className="text-2xl font-bold text-ink">{stats.verified_today}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-surface border-line">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-accent-soft">
                                    <Users className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-ink-muted">Total</p>
                                    <p className="text-2xl font-bold text-ink">{stats.total_verified}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-surface border-line">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-accent-soft">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-ink-muted">Pass Rate</p>
                                    <p className="text-2xl font-bold text-ink">{stats.pass_rate}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-surface border-line">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-accent-soft">
                                    <Award className="h-5 w-5 text-success" />
                                </div>
                                <div>
                                    <p className="text-xs text-ink-muted">Avg Score</p>
                                    <p className="text-2xl font-bold text-ink">{stats.average_score}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Search and Bulk Actions */}
            <Card className="bg-surface border-line">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                            <Input
                                placeholder="Search by student or exam..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-muted border-line text-ink"
                            />
                        </div>
                        {filteredAttempts.length > 0 && (
                            <Button
                                onClick={handleBulkVerify}
                                className="bg-primary text-primary-foreground"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Verify All ({filteredAttempts.length})
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Pending Verifications */}
            {filteredAttempts.length === 0 ? (
                <Card className="bg-surface border-line">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <CheckCircle className="h-12 w-12 text-primary mb-4" />
                        <p className="text-ink-muted text-center">All caught up! No pending verifications.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredAttempts.map((attempt) => (
                        <Card key={attempt.id} className="bg-surface border-line">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-ink">{attempt.student_name}</h3>
                                            <Badge variant="outline" className="text-ink-muted border-line text-xs">
                                                Attempt #{attempt.attempt_number}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-ink-muted">{attempt.exam_title}</p>
                                        <p className="text-xs text-ink-muted mt-1">
                                            Submitted: {formatDate(attempt.end_time || attempt.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className={`text-2xl font-bold ${attempt.passed ? 'text-primary' : 'text-danger'}`}>
                                                {attempt.percentage?.toFixed(1)}%
                                            </p>
                                            <p className="text-xs text-ink-muted">
                                                {attempt.obtained_marks}/{attempt.total_marks} marks
                                            </p>
                                        </div>
                                        <Badge
                                            className={`${
                                                attempt.passed
                                                    ? 'bg-accent-soft text-primary border-line'
                                                    : 'bg-danger/10 text-danger border-line'
                                            }`}
                                        >
                                            {attempt.passed ? 'Passed' : 'Failed'}
                                        </Badge>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleReview(attempt.id)}
                                            className="border-line text-ink"
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            Review
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleVerify(attempt.id)}
                                            className=""
                                        >
                                            <CheckCircle className="h-4 w-4 mr-1" />
                                            Verify
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Review Dialog */}
            <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
                <DialogContent className="bg-surface border-line max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-ink">
                            Review Exam Attempt
                        </DialogTitle>
                    </DialogHeader>

                    {selectedAttempt && (
                        <div className="space-y-6">
                            {/* Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-muted rounded-lg p-3">
                                    <p className="text-xs text-ink-muted mb-1">Student</p>
                                    <p className="font-medium text-ink">{selectedAttempt.attempt.student_name}</p>
                                </div>
                                <div className="bg-muted rounded-lg p-3">
                                    <p className="text-xs text-ink-muted mb-1">Score</p>
                                    <p className={`font-bold text-xl ${selectedAttempt.attempt.passed ? 'text-primary' : 'text-danger'}`}>
                                        {selectedAttempt.attempt.percentage?.toFixed(1)}%
                                    </p>
                                </div>
                                <div className="bg-muted rounded-lg p-3">
                                    <p className="text-xs text-ink-muted mb-1">Correct</p>
                                    <p className="font-medium text-ink">
                                        {selectedAttempt.attempt.correct_answers}/{selectedAttempt.attempt.total_questions}
                                    </p>
                                </div>
                                <div className="bg-muted rounded-lg p-3">
                                    <p className="text-xs text-ink-muted mb-1">Time Taken</p>
                                    <p className="font-medium text-ink">
                                        {selectedAttempt.attempt.time_taken_minutes} min
                                    </p>
                                </div>
                            </div>

                            {/* Questions Review */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-ink">Questions & Answers</h3>
                                {selectedAttempt.questions?.map((q: any, idx: number) => (
                                    <Card key={q.question_id} className={`border ${q.is_correct ? 'border-line bg-accent-soft' : 'border-line bg-danger/10'}`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <Badge variant="outline" className="text-ink-muted">Q{idx + 1}</Badge>
                                                {q.is_correct ? (
                                                    <Badge className="bg-accent-soft text-primary border-line">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Correct
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-danger/10 text-danger border-line">
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Incorrect
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-ink mb-3">{q.question_text}</p>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                {['A', 'B', 'C', 'D'].map((opt) => {
                                                    const optKey = `option_${opt.toLowerCase()}`;
                                                    const isCorrect = q.correct_option === opt;
                                                    const isSelected = q.selected_option === opt;

                                                    return (
                                                        <div
                                                            key={opt}
                                                            className={`p-2 rounded ${
                                                                isCorrect
                                                                    ? 'bg-accent-soft border border-line'
                                                                    : isSelected && !isCorrect
                                                                    ? 'bg-danger/10 border border-line'
                                                                    : 'bg-muted'
                                                            }`}
                                                        >
                                                            <span className="font-medium mr-2">{opt}.</span>
                                                            <span className={isCorrect ? 'text-primary' : isSelected ? 'text-danger' : 'text-ink'}>
                                                                {q[optKey]}
                                                            </span>
                                                            {isCorrect && <CheckCircle className="h-3 w-3 inline ml-2 text-primary" />}
                                                            {isSelected && !isCorrect && <XCircle className="h-3 w-3 inline ml-2 text-danger" />}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2">
                        {selectedAttempt && !selectedAttempt.attempt.passed && (
                            <Button
                                variant="outline"
                                onClick={() => handleAllowRetake(selectedAttempt.attempt.id)}
                                disabled={isVerifying}
                                className="border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/10"
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                Allow Retake
                            </Button>
                        )}
                        <Button
                            onClick={() => selectedAttempt && handleVerify(selectedAttempt.attempt.id)}
                            disabled={isVerifying}
                            className="bg-primary text-primary-foreground"
                        >
                            {isVerifying ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                                <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            Verify & Release
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
