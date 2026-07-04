'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth/auth-context';
import { paymentsApi, institutionsApi } from '@/lib/api/endpoints';
import { PortalNav } from '@/components/layouts/portal-nav';
import { ChatWidget } from '@/components/chat/ChatWidget';
import { UpiQr } from '@/components/payments/upi-qr';
import type { MyPaymentSummary, Institution } from '@/types';
import {
    BookOpen,
    Award,
    CreditCard,
    MessageSquare,
    Calendar,
    Download,
    Clock,
    Play,
} from 'lucide-react';

// Placeholder data until courses/certificates are wired to the API
// (payments ARE wired — see paymentsApi.getMySummary below).
const studentData = {
    enrolledCourses: [
        {
            id: 1,
            name: 'Web Development Bootcamp',
            progress: 75,
            nextClass: 'React Hooks Deep Dive',
            instructor: 'Priya Patel',
        },
        {
            id: 2,
            name: 'Python Programming',
            progress: 40,
            nextClass: 'Object Oriented Python',
            instructor: 'Amit Kumar',
        },
    ],
    certificates: [
        { id: 1, course: 'HTML & CSS Fundamentals', date: '2024-09-20', status: 'issued' },
    ],
};

function StatCard({
    icon: Icon,
    value,
    label,
}: {
    icon: React.ElementType;
    value: string | number;
    label: string;
}) {
    return (
        <Card className="rounded-md border-line bg-surface shadow-sm">
            <CardContent className="flex items-center gap-4 p-4">
                <div className="rounded-md bg-accent-soft p-3">
                    <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                    <p className="font-mono text-2xl font-semibold tabular-nums text-ink">{value}</p>
                    <p className="text-xs uppercase tracking-wide text-ink-muted">{label}</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function StudentPortal() {
    const { user } = useAuth();

    const [summary, setSummary] = useState<MyPaymentSummary | null>(null);
    const [institution, setInstitution] = useState<Institution | null>(null);
    const [payDialogOpen, setPayDialogOpen] = useState(false);

    useEffect(() => {
        if (!user) return;
        paymentsApi.getMySummary().then((res) => setSummary(res.data)).catch(() => setSummary(null));
        if (user.institution_id) {
            institutionsApi
                .get(user.institution_id)
                .then((res) => setInstitution(res.data))
                .catch(() => setInstitution(null));
        }
    }, [user]);

    const pendingAmount = summary?.total_balance ?? 0;

    return (
        <div className="min-h-screen bg-paper">
            <PortalNav title="Student Portal" />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome */}
                <div className="mb-8 border-b border-line pb-6">
                    <h1 className="font-serif text-2xl font-semibold text-ink">
                        Welcome back, {user?.full_name}
                    </h1>
                    <p className="mt-1 text-sm text-ink-muted">
                        Your courses, payments, and certificates at a glance.
                    </p>
                </div>

                {/* Quick stats */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatCard icon={BookOpen} value={studentData.enrolledCourses.length} label="Active courses" />
                    <StatCard icon={Award} value={studentData.certificates.length} label="Certificates" />
                    <StatCard
                        icon={CreditCard}
                        value={summary ? `₹${pendingAmount.toLocaleString('en-IN')}` : '—'}
                        label="Amount due"
                    />
                    <StatCard icon={Calendar} value={2} label="Classes today" />
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Enrolled courses */}
                    <div className="lg:col-span-2">
                        <Card className="rounded-md border-line bg-surface shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 font-serif text-lg text-ink">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    My Courses
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {studentData.enrolledCourses.map((course) => (
                                    <div key={course.id} className="rounded-md border border-line p-4">
                                        <div className="mb-3 flex items-start justify-between">
                                            <div>
                                                <h3 className="font-medium text-ink">{course.name}</h3>
                                                <p className="text-sm text-ink-muted">
                                                    Instructor: {course.instructor}
                                                </p>
                                            </div>
                                            <span className="font-mono text-sm tabular-nums text-ink-muted">
                                                {course.progress}%
                                            </span>
                                        </div>
                                        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="h-full rounded-full bg-primary transition-all duration-700"
                                                style={{ width: `${course.progress}%` }}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-ink-muted">
                                                <Clock className="h-4 w-4" />
                                                Next: {course.nextClass}
                                            </div>
                                            <Button size="sm">
                                                <Play className="mr-1 h-4 w-4" />
                                                Continue
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Payments — ledger style */}
                        <Card className="rounded-md border-line bg-surface shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 font-serif text-base text-ink">
                                    <CreditCard className="h-4 w-4 text-primary" />
                                    Payment History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {summary && summary.recent_payments.length === 0 && (
                                    <p className="py-2 font-serif text-sm text-ink-muted">
                                        No payments recorded yet.
                                    </p>
                                )}
                                {summary?.recent_payments.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between border-b border-line py-2 last:border-0"
                                    >
                                        <div>
                                            <p className="text-sm text-ink">
                                                {payment.course_name || 'Course fee'}
                                            </p>
                                            <p className="text-xs text-ink-muted">
                                                {payment.paid_at || '—'} · {payment.receipt_number}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-mono text-sm font-medium tabular-nums text-ink">
                                                ₹{payment.amount.toLocaleString('en-IN')}
                                            </p>
                                            <p className="text-[10px] font-medium uppercase tracking-widest text-success">
                                                {payment.payment_method.replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="mt-3 w-full"
                                    disabled={!summary || pendingAmount <= 0}
                                    onClick={() => setPayDialogOpen(true)}
                                >
                                    {pendingAmount > 0
                                        ? `Pay pending amount (₹${pendingAmount.toLocaleString('en-IN')})`
                                        : 'No amount pending'}
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Certificates */}
                        <Card className="rounded-md border-line bg-surface shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 font-serif text-base text-ink">
                                    <Award className="h-4 w-4 text-gold" />
                                    Certificates
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1">
                                {studentData.certificates.map((cert) => (
                                    <div key={cert.id} className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="text-sm text-ink">{cert.course}</p>
                                            <p className="text-xs text-ink-muted">{cert.date}</p>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-primary hover:text-primary"
                                        >
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Help */}
                        <Card className="rounded-md border-line bg-accent-soft shadow-sm">
                            <CardContent className="p-4 text-center">
                                <MessageSquare className="mx-auto mb-2 h-6 w-6 text-primary" />
                                <h3 className="font-serif text-base font-semibold text-ink">Need help?</h3>
                                <p className="mt-1 text-sm text-ink-muted">
                                    Use the chat assistant in the corner of this page for fees, batches,
                                    exams, and certificate queries.
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>

            {/* Pay-by-UPI dialog: student scans the institution's QR; the
                office confirms the credit and records the UTR. */}
            <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
                <DialogContent className="border-line bg-surface sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="font-serif text-ink">Pay your pending fee</DialogTitle>
                        <DialogDescription className="text-ink-muted">
                            Pay via any UPI app, then show the payment confirmation at your
                            center&apos;s office — they will verify it and issue your receipt.
                        </DialogDescription>
                    </DialogHeader>
                    {institution?.upi_vpa ? (
                        <UpiQr
                            vpa={institution.upi_vpa}
                            payeeName={institution.name}
                            amount={pendingAmount}
                            note={`Fee ${summary?.student_code ?? ''}`.trim()}
                            hint="Keep the payment confirmation — the office will verify it and issue your receipt."
                        />
                    ) : (
                        <p className="rounded-md border border-line bg-muted p-3 text-sm text-ink-muted">
                            Online payment is not set up for your institution yet. Please pay at
                            the office counter.
                        </p>
                    )}
                    {summary && summary.courses.filter((c) => c.balance > 0).length > 0 && (
                        <div className="rounded-md border border-line">
                            {summary.courses
                                .filter((c) => c.balance > 0)
                                .map((c) => (
                                    <div
                                        key={c.course_id}
                                        className="flex items-center justify-between border-b border-line p-3 text-sm last:border-0"
                                    >
                                        <span className="text-ink">{c.course_name}</span>
                                        <span className="font-mono font-medium tabular-nums text-ink">
                                            ₹{c.balance.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <ChatWidget />
        </div>
    );
}
