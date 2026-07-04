'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth/auth-context';
import { PortalNav } from '@/components/layouts/portal-nav';
import {
    Users,
    CalendarCheck,
    Wallet,
    Download,
    Clock,
    Check,
    X,
    IndianRupee,
    Calendar,
    FileText,
    GraduationCap,
    ChevronRight,
} from 'lucide-react';

// Placeholder data until the staff portal is wired to the API
// (attendance and payroll endpoints exist backend-side).
const staffData = {
    dailyRate: 1200,
    attendance: {
        present: 22,
        absent: 2,
        halfDay: 1,
        leave: 1,
    },
    recentAttendance: [
        { date: '2024-12-22', status: 'present' },
        { date: '2024-12-21', status: 'present' },
        { date: '2024-12-20', status: 'present' },
        { date: '2024-12-19', status: 'half_day' },
        { date: '2024-12-18', status: 'present' },
    ],
    payroll: [
        { month: 'November 2024', gross: 27600, deductions: 1000, net: 26600, status: 'paid', payslip: true },
        { month: 'October 2024', gross: 26400, deductions: 800, net: 25600, status: 'paid', payslip: true },
        { month: 'September 2024', gross: 25200, deductions: 600, net: 24600, status: 'paid', payslip: true },
    ],
};

const statusIcons = {
    present: Check,
    absent: X,
    half_day: Clock,
    leave: Calendar,
};

// Stamped status text (docs/05 §2.4), colored by semantic token only.
const statusColors = {
    present: 'text-success',
    absent: 'text-danger',
    half_day: 'text-warning',
    leave: 'text-ink-muted',
};

export default function StaffPortal() {
    const { user } = useAuth();
    const currentMonth = 'December 2024';

    return (
        <div className="min-h-screen bg-paper">
            <PortalNav
                title="Staff Portal"
                links={[
                    { href: '/staff', label: 'Dashboard' },
                    { href: '/staff/students', label: 'Students' },
                ]}
            />

            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                {/* Welcome */}
                <div className="mb-8 border-b border-line pb-6">
                    <h1 className="font-serif text-2xl font-semibold text-ink">
                        Welcome, {user?.full_name}
                    </h1>
                    <p className="mt-1 text-sm text-ink-muted">
                        Student progress, attendance, and payroll.
                    </p>
                </div>

                {/* Student management */}
                <Link href="/staff/students" className="group mb-8 block">
                    <Card className="rounded-md border-line bg-surface shadow-sm transition-colors group-hover:border-primary/40">
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-md bg-accent-soft p-3">
                                    <GraduationCap className="h-7 w-7 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-serif text-lg font-semibold text-ink">
                                        Manage Student Progress
                                    </h3>
                                    <p className="text-sm text-ink-muted">
                                        View students, update module progress, and enter exam marks
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
                        </CardContent>
                    </Card>
                </Link>

                {/* Quick stats */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="rounded-md border-line bg-surface shadow-sm">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-md bg-accent-soft p-3">
                                <Users className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-ink-muted">Role</p>
                                <p className="text-lg font-medium capitalize text-ink">
                                    {user?.role?.replace('_', ' ')}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-md border-line bg-surface shadow-sm">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-md bg-accent-soft p-3">
                                <IndianRupee className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-ink-muted">Daily rate</p>
                                <p className="font-mono text-lg font-medium tabular-nums text-ink">
                                    ₹{staffData.dailyRate.toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-md border-line bg-surface shadow-sm">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-md bg-accent-soft p-3">
                                <CalendarCheck className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-ink-muted">
                                    Present this month
                                </p>
                                <p className="font-mono text-lg font-medium tabular-nums text-ink">
                                    {staffData.attendance.present} days
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="rounded-md border-line bg-surface shadow-sm">
                        <CardContent className="flex items-center gap-4 p-4">
                            <div className="rounded-md bg-accent-soft p-3">
                                <Wallet className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wide text-ink-muted">Last salary</p>
                                <p className="font-mono text-lg font-medium tabular-nums text-ink">
                                    ₹{staffData.payroll[0].net.toLocaleString()}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Attendance */}
                    <Card className="rounded-md border-line bg-surface shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-serif text-lg text-ink">
                                <CalendarCheck className="h-5 w-5 text-primary" />
                                Attendance — {currentMonth}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Summary */}
                            <div className="mb-6 grid grid-cols-4 gap-3">
                                <div className="rounded-md border border-line p-3 text-center">
                                    <p className="font-mono text-2xl font-semibold tabular-nums text-success">
                                        {staffData.attendance.present}
                                    </p>
                                    <p className="text-xs uppercase tracking-wide text-ink-muted">Present</p>
                                </div>
                                <div className="rounded-md border border-line p-3 text-center">
                                    <p className="font-mono text-2xl font-semibold tabular-nums text-danger">
                                        {staffData.attendance.absent}
                                    </p>
                                    <p className="text-xs uppercase tracking-wide text-ink-muted">Absent</p>
                                </div>
                                <div className="rounded-md border border-line p-3 text-center">
                                    <p className="font-mono text-2xl font-semibold tabular-nums text-warning">
                                        {staffData.attendance.halfDay}
                                    </p>
                                    <p className="text-xs uppercase tracking-wide text-ink-muted">Half day</p>
                                </div>
                                <div className="rounded-md border border-line p-3 text-center">
                                    <p className="font-mono text-2xl font-semibold tabular-nums text-ink-muted">
                                        {staffData.attendance.leave}
                                    </p>
                                    <p className="text-xs uppercase tracking-wide text-ink-muted">Leave</p>
                                </div>
                            </div>

                            {/* Recent attendance */}
                            <h4 className="mb-3 text-xs uppercase tracking-wide text-ink-muted">
                                Recent attendance
                            </h4>
                            <div className="space-y-0">
                                {staffData.recentAttendance.map((day, idx) => {
                                    const Icon = statusIcons[day.status as keyof typeof statusIcons];
                                    const colorClass =
                                        statusColors[day.status as keyof typeof statusColors];
                                    return (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between border-b border-line py-2 last:border-0"
                                        >
                                            <span className="text-sm text-ink">
                                                {new Date(day.date).toLocaleDateString('en-IN', {
                                                    weekday: 'short',
                                                    day: 'numeric',
                                                    month: 'short',
                                                })}
                                            </span>
                                            <div className={`flex items-center gap-1.5 ${colorClass}`}>
                                                <Icon className="h-3.5 w-3.5" />
                                                <span className="text-[11px] font-medium uppercase tracking-widest">
                                                    {day.status.replace('_', ' ')}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payroll — ledger style */}
                    <Card className="rounded-md border-line bg-surface shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 font-serif text-lg text-ink">
                                <Wallet className="h-5 w-5 text-primary" />
                                Payroll History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {staffData.payroll.map((pay, idx) => (
                                    <div key={idx} className="rounded-md border border-line p-4">
                                        <div className="mb-3 flex items-center justify-between">
                                            <h4 className="font-medium text-ink">{pay.month}</h4>
                                            <span className="text-[11px] font-medium uppercase tracking-widest text-success">
                                                {pay.status}
                                            </span>
                                        </div>
                                        <div className="mb-3 grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <p className="text-xs text-ink-muted">Gross</p>
                                                <p className="font-mono font-medium tabular-nums text-ink">
                                                    ₹{pay.gross.toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-ink-muted">Deductions</p>
                                                <p className="font-mono font-medium tabular-nums text-danger">
                                                    -₹{pay.deductions.toLocaleString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-ink-muted">Net pay</p>
                                                <p className="font-mono font-semibold tabular-nums text-ink">
                                                    ₹{pay.net.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                        {pay.payslip && (
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full"
                                            >
                                                <FileText className="mr-2 h-4 w-4" />
                                                Download Payslip
                                                <Download className="ml-2 h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
