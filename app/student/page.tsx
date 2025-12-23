'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    GraduationCap,
    BookOpen,
    Award,
    CreditCard,
    MessageSquare,
    Calendar,
    LogOut,
    ChevronRight,
    Download,
    Clock,
    CheckCircle2,
    Play,
} from 'lucide-react';

// Mock student data
const studentData = {
    name: 'Rahul Sharma',
    email: 'rahul.sharma@email.com',
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
    payments: [
        { id: 1, date: '2024-11-15', amount: 15000, status: 'paid', description: 'Web Dev - Installment 2' },
        { id: 2, date: '2024-10-01', amount: 15000, status: 'paid', description: 'Web Dev - Installment 1' },
    ],
    certificates: [
        { id: 1, course: 'HTML & CSS Fundamentals', date: '2024-09-20', status: 'issued' },
    ],
    pendingAmount: 15000,
};

function StudentNav() {
    return (
        <nav className="bg-slate-900 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-green-700">
                            <GraduationCap className="h-5 w-5 text-white" />
                        </div>
                        <span className="text-lg font-bold text-white">Student Portal</span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-9 w-9 ring-2 ring-green-600/20">
                            <AvatarFallback className="bg-gradient-to-br from-green-600 to-green-700 text-white text-sm">
                                RS
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

export default function StudentPortal() {
    return (
        <div className="min-h-screen bg-slate-950">
            <StudentNav />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-white mb-1">Welcome back, {studentData.name}! 👋</h1>
                    <p className="text-slate-400">Track your courses, payments, and certificates</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-600/10">
                                <BookOpen className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{studentData.enrolledCourses.length}</p>
                                <p className="text-sm text-slate-400">Active Courses</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-600/10">
                                <Award className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{studentData.certificates.length}</p>
                                <p className="text-sm text-slate-400">Certificates</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-amber-500/10">
                                <CreditCard className="h-6 w-6 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">₹{studentData.pendingAmount.toLocaleString()}</p>
                                <p className="text-sm text-slate-400">Due Amount</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-red-600/10">
                                <Calendar className="h-6 w-6 text-red-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">2</p>
                                <p className="text-sm text-slate-400">Classes Today</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Enrolled Courses */}
                    <div className="lg:col-span-2">
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-green-500" />
                                    My Courses
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {studentData.enrolledCourses.map((course) => (
                                    <div key={course.id} className="p-4 rounded-xl bg-slate-800/50 border border-slate-700">
                                        <div className="flex items-start justify-between mb-3">
                                            <div>
                                                <h3 className="font-semibold text-white">{course.name}</h3>
                                                <p className="text-sm text-slate-400">Instructor: {course.instructor}</p>
                                            </div>
                                            <Badge className="bg-green-600/10 text-green-400 border-green-600/30">
                                                {course.progress}% Complete
                                            </Badge>
                                        </div>
                                        <div className="mb-3">
                                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-green-600 to-green-500 rounded-full"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <Clock className="h-4 w-4" />
                                                Next: {course.nextClass}
                                            </div>
                                            <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white">
                                                <Play className="h-4 w-4 mr-1" />
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
                        {/* Payments */}
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-base flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-amber-400" />
                                    Payment History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {studentData.payments.map((payment) => (
                                    <div key={payment.id} className="flex items-center justify-between py-2 border-b border-slate-800 last:border-0">
                                        <div>
                                            <p className="text-sm text-white">{payment.description}</p>
                                            <p className="text-xs text-slate-400">{payment.date}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-emerald-400 font-medium">₹{payment.amount.toLocaleString()}</span>
                                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                        </div>
                                    </div>
                                ))}
                                <Button variant="outline" size="sm" className="w-full mt-2 border-slate-700 text-slate-300">
                                    Pay Pending Amount
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Certificates */}
                        <Card className="bg-slate-900/50 border-slate-800">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-white text-base flex items-center gap-2">
                                    <Award className="h-5 w-5 text-emerald-400" />
                                    Certificates
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {studentData.certificates.map((cert) => (
                                    <div key={cert.id} className="flex items-center justify-between py-2">
                                        <div>
                                            <p className="text-sm text-white">{cert.course}</p>
                                            <p className="text-xs text-slate-400">{cert.date}</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300">
                                            <Download className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* AI Help */}
                        <Card className="bg-gradient-to-br from-green-600/10 to-red-600/5 border-slate-800">
                            <CardContent className="p-4 text-center">
                                <MessageSquare className="h-8 w-8 text-green-500 mx-auto mb-2" />
                                <h3 className="font-semibold text-white mb-1">Need Help?</h3>
                                <p className="text-sm text-slate-400 mb-3">Chat with our AI assistant</p>
                                <Link href="/dashboard/chatbot">
                                    <Button size="sm" className="bg-green-600 hover:bg-green-500 text-white">
                                        Start Chat
                                        <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
