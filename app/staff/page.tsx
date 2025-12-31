'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Users,
    CalendarCheck,
    Wallet,
    Download,
    LogOut,
    Clock,
    Check,
    X,
    IndianRupee,
    Calendar,
    FileText,
    GraduationCap,
    ChevronRight,
} from 'lucide-react';

// Mock staff data
const staffData = {
    name: 'Meera Iyer',
    email: 'meera.iyer@institute.com',
    role: 'Staff Manager',
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

const statusColors = {
    present: 'text-green-400 bg-green-600/10',
    absent: 'text-red-400 bg-red-600/10',
    half_day: 'text-amber-400 bg-amber-500/10',
    leave: 'text-slate-400 bg-slate-500/10',
};

function StaffNav() {
    return (
        <nav className="bg-slate-900 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-700">
                                <Users className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">Staff Portal</span>
                        </Link>
                        <div className="hidden sm:flex items-center gap-2 ml-8">
                            <Link href="/staff">
                                <Button variant="ghost" size="sm" className="text-white bg-slate-800">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/staff/students">
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    <GraduationCap className="h-4 w-4 mr-2" />
                                    Students
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-9 w-9 ring-2 ring-red-600/20">
                            <AvatarFallback className="bg-gradient-to-br from-red-600 to-red-700 text-white text-sm">
                                MI
                            </AvatarFallback>
                        </Avatar>
                        <Link href="/">
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default function StaffPortal() {
    const currentMonth = 'December 2024';

    return (
        <div className="min-h-screen bg-slate-950">
            <StaffNav />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-1">Welcome, {staffData.name}! 👋</h1>
                    <p className="text-slate-400">Manage student progress, attendance, and payroll</p>
                </div>

                {/* Student Management Card */}
                <Link href="/staff/students">
                    <Card className="bg-gradient-to-r from-green-600/10 to-emerald-600/5 border-green-600/30 mb-8 cursor-pointer hover:border-green-500/50 transition-all group">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-green-600/20">
                                    <GraduationCap className="h-8 w-8 text-green-400" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white">Manage Student Progress</h3>
                                    <p className="text-slate-400 text-sm">View students, update module progress, and enter exam marks</p>
                                </div>
                            </div>
                            <ChevronRight className="h-6 w-6 text-green-400 group-hover:translate-x-1 transition-transform" />
                        </CardContent>
                    </Card>
                </Link>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-red-600/10">
                                <Users className="h-6 w-6 text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Role</p>
                                <p className="text-lg font-semibold text-white">{staffData.role}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-600/10">
                                <IndianRupee className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Daily Rate</p>
                                <p className="text-lg font-semibold text-white">₹{staffData.dailyRate.toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-600/10">
                                <CalendarCheck className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Present This Month</p>
                                <p className="text-lg font-semibold text-white">{staffData.attendance.present} days</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-red-600/10">
                                <Wallet className="h-6 w-6 text-red-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Last Salary</p>
                                <p className="text-lg font-semibold text-white">₹{staffData.payroll[0].net.toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Attendance */}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <CalendarCheck className="h-5 w-5 text-green-500" />
                                Attendance - {currentMonth}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {/* Summary */}
                            <div className="grid grid-cols-4 gap-3 mb-6">
                                <div className="text-center p-3 rounded-xl bg-green-600/10 border border-green-600/20">
                                    <p className="text-2xl font-bold text-green-400">{staffData.attendance.present}</p>
                                    <p className="text-xs text-slate-400">Present</p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-red-600/10 border border-red-600/20">
                                    <p className="text-2xl font-bold text-red-400">{staffData.attendance.absent}</p>
                                    <p className="text-xs text-slate-400">Absent</p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                    <p className="text-2xl font-bold text-amber-400">{staffData.attendance.halfDay}</p>
                                    <p className="text-xs text-slate-400">Half Day</p>
                                </div>
                                <div className="text-center p-3 rounded-xl bg-slate-500/10 border border-slate-500/20">
                                    <p className="text-2xl font-bold text-slate-400">{staffData.attendance.leave}</p>
                                    <p className="text-xs text-slate-400">Leave</p>
                                </div>
                            </div>

                            {/* Recent Attendance */}
                            <h4 className="text-sm font-medium text-slate-400 mb-3">Recent Attendance</h4>
                            <div className="space-y-2">
                                {staffData.recentAttendance.map((day, idx) => {
                                    const Icon = statusIcons[day.status as keyof typeof statusIcons];
                                    const colorClass = statusColors[day.status as keyof typeof statusColors];
                                    return (
                                        <div key={idx} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/50">
                                            <span className="text-slate-300">{new Date(day.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</span>
                                            <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${colorClass}`}>
                                                <Icon className="h-4 w-4" />
                                                <span className="text-sm capitalize">{day.status.replace('_', ' ')}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payroll */}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2">
                                <Wallet className="h-5 w-5 text-red-400" />
                                Payroll History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {staffData.payroll.map((pay, idx) => (
                                    <div key={idx} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-medium text-white">{pay.month}</h4>
                                            <Badge className="bg-green-600/10 text-green-400 border-green-600/30">
                                                {pay.status}
                                            </Badge>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                                            <div>
                                                <p className="text-slate-400">Gross</p>
                                                <p className="text-white font-medium">₹{pay.gross.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400">Deductions</p>
                                                <p className="text-red-400 font-medium">-₹{pay.deductions.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-400">Net Pay</p>
                                                <p className="text-green-400 font-semibold">₹{pay.net.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        {pay.payslip && (
                                            <Button variant="ghost" size="sm" className="w-full text-green-400 hover:text-green-300 hover:bg-green-600/10">
                                                <FileText className="h-4 w-4 mr-2" />
                                                Download Payslip
                                                <Download className="h-4 w-4 ml-2" />
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
