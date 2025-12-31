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
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ClipboardCheck className="h-7 w-7 text-green-400" />
                        Exam Verification
                    </h1>
                    <p className="text-slate-400 mt-1">Review and verify student exam results</p>
                </div>
                <Button onClick={fetchData} variant="outline" className="border-slate-700">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-yellow-500/10">
                                    <ClipboardCheck className="h-5 w-5 text-yellow-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Pending</p>
                                    <p className="text-2xl font-bold text-white">{stats.pending_verification}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-green-500/10">
                                    <CheckCircle className="h-5 w-5 text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Today</p>
                                    <p className="text-2xl font-bold text-white">{stats.verified_today}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-blue-500/10">
                                    <Users className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Total</p>
                                    <p className="text-2xl font-bold text-white">{stats.total_verified}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-purple-500/10">
                                    <TrendingUp className="h-5 w-5 text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Pass Rate</p>
                                    <p className="text-2xl font-bold text-white">{stats.pass_rate}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-emerald-500/10">
                                    <Award className="h-5 w-5 text-emerald-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-400">Avg Score</p>
                                    <p className="text-2xl font-bold text-white">{stats.average_score}%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Search and Bulk Actions */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search by student or exam..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                            />
                        </div>
                        {filteredAttempts.length > 0 && (
                            <Button
                                onClick={handleBulkVerify}
                                className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
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
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <CheckCircle className="h-12 w-12 text-green-400 mb-4" />
                        <p className="text-slate-400 text-center">All caught up! No pending verifications.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-3">
                    {filteredAttempts.map((attempt) => (
                        <Card key={attempt.id} className="bg-slate-900/50 border-slate-800">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="font-semibold text-white">{attempt.student_name}</h3>
                                            <Badge variant="outline" className="text-slate-400 border-slate-600 text-xs">
                                                Attempt #{attempt.attempt_number}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-slate-400">{attempt.exam_title}</p>
                                        <p className="text-xs text-slate-500 mt-1">
                                            Submitted: {formatDate(attempt.end_time || attempt.created_at)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className={`text-2xl font-bold ${attempt.passed ? 'text-green-400' : 'text-red-400'}`}>
                                                {attempt.percentage?.toFixed(1)}%
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {attempt.obtained_marks}/{attempt.total_marks} marks
                                            </p>
                                        </div>
                                        <Badge
                                            className={`${
                                                attempt.passed
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/30'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/30'
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
                                            className="border-slate-700 text-slate-300"
                                        >
                                            <Eye className="h-4 w-4 mr-1" />
                                            Review
                                        </Button>
                                        <Button
                                            size="sm"
                                            onClick={() => handleVerify(attempt.id)}
                                            className="bg-green-600 hover:bg-green-500 text-white"
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
                <DialogContent className="bg-slate-900 border-slate-800 max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-white">
                            Review Exam Attempt
                        </DialogTitle>
                    </DialogHeader>

                    {selectedAttempt && (
                        <div className="space-y-6">
                            {/* Summary */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <p className="text-xs text-slate-400 mb-1">Student</p>
                                    <p className="font-medium text-white">{selectedAttempt.attempt.student_name}</p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <p className="text-xs text-slate-400 mb-1">Score</p>
                                    <p className={`font-bold text-xl ${selectedAttempt.attempt.passed ? 'text-green-400' : 'text-red-400'}`}>
                                        {selectedAttempt.attempt.percentage?.toFixed(1)}%
                                    </p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <p className="text-xs text-slate-400 mb-1">Correct</p>
                                    <p className="font-medium text-white">
                                        {selectedAttempt.attempt.correct_answers}/{selectedAttempt.attempt.total_questions}
                                    </p>
                                </div>
                                <div className="bg-slate-800/50 rounded-lg p-3">
                                    <p className="text-xs text-slate-400 mb-1">Time Taken</p>
                                    <p className="font-medium text-white">
                                        {selectedAttempt.attempt.time_taken_minutes} min
                                    </p>
                                </div>
                            </div>

                            {/* Questions Review */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white">Questions & Answers</h3>
                                {selectedAttempt.questions?.map((q: any, idx: number) => (
                                    <Card key={q.question_id} className={`border ${q.is_correct ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'}`}>
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-3">
                                                <Badge variant="outline" className="text-slate-400">Q{idx + 1}</Badge>
                                                {q.is_correct ? (
                                                    <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Correct
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-red-500/10 text-red-400 border-red-500/30">
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        Incorrect
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-white mb-3">{q.question_text}</p>
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
                                                                    ? 'bg-green-500/20 border border-green-500/30'
                                                                    : isSelected && !isCorrect
                                                                    ? 'bg-red-500/20 border border-red-500/30'
                                                                    : 'bg-slate-800/50'
                                                            }`}
                                                        >
                                                            <span className="font-medium mr-2">{opt}.</span>
                                                            <span className={isCorrect ? 'text-green-400' : isSelected ? 'text-red-400' : 'text-slate-300'}>
                                                                {q[optKey]}
                                                            </span>
                                                            {isCorrect && <CheckCircle className="h-3 w-3 inline ml-2 text-green-400" />}
                                                            {isSelected && !isCorrect && <XCircle className="h-3 w-3 inline ml-2 text-red-400" />}
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
                            className="bg-gradient-to-r from-green-600 to-emerald-600 text-white"
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
