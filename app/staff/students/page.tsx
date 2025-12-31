'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import apiClient from '@/lib/api/client';
import {
    Users,
    GraduationCap,
    Search,
    Loader2,
    LogOut,
    ArrowLeft,
    BookOpen,
    ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

interface Student {
    id: string;
    student_id: string;
    user?: {
        full_name: string;
        email: string;
        phone: string | null;
    };
    enrollment_date: string;
    batch_time: string | null;
    batch_month: string | null;
    batch_year: string | null;
}

function StaffNav() {
    return (
        <nav className="bg-slate-900 border-b border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center gap-4">
                        <Link href="/staff" className="flex items-center gap-2">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-600 to-red-700">
                                <Users className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-lg font-bold text-white">Staff Portal</span>
                        </Link>
                        <div className="hidden sm:flex items-center gap-2 ml-8">
                            <Link href="/staff">
                                <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                                    Dashboard
                                </Button>
                            </Link>
                            <Link href="/staff/students">
                                <Button variant="ghost" size="sm" className="text-white bg-slate-800">
                                    <GraduationCap className="h-4 w-4 mr-2" />
                                    Students
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <Link href="/">
                        <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default function StaffStudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            const response = await apiClient.get('/api/students');
            setStudents(response.data.items || response.data || []);
        } catch (error) {
            console.error('Failed to fetch students:', error);
            toast.error('Failed to load students');
        } finally {
            setIsLoading(false);
        }
    };

    const filteredStudents = students.filter(
        (student) =>
            student.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.student_id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-slate-950">
            <StaffNav />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/staff">
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <GraduationCap className="h-7 w-7 text-green-500" />
                                Student Progress Management
                            </h1>
                            <p className="text-slate-400">View and update student module progress</p>
                        </div>
                    </div>
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-green-600/10">
                                <Users className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{students.length}</p>
                                <p className="text-sm text-slate-400">Total Students</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-blue-600/10">
                                <BookOpen className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{filteredStudents.length}</p>
                                <p className="text-sm text-slate-400">Showing</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-amber-500/10">
                                <GraduationCap className="h-6 w-6 text-amber-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">Click on a student</p>
                                <p className="text-sm text-slate-300">to manage their progress</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Student List */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400">
                                    {searchQuery ? 'No students match your search' : 'No students found'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredStudents.map((student) => (
                                    <Link key={student.id} href={`/staff/students/${student.id}`}>
                                        <Card className="bg-slate-800/50 border-slate-700 hover:border-green-600/50 transition-all cursor-pointer group">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-4">
                                                    <Avatar className="h-12 w-12 ring-2 ring-slate-700 group-hover:ring-green-600/50">
                                                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm">
                                                            {getInitials(student.user?.full_name || 'ST')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-white truncate">
                                                            {student.user?.full_name || 'Unknown'}
                                                        </p>
                                                        <p className="text-sm text-slate-400 font-mono">
                                                            {student.student_id}
                                                        </p>
                                                        <p className="text-sm text-slate-500 truncate">
                                                            {student.user?.email}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-green-500 transition-colors" />
                                                </div>
                                                {student.batch_time && (
                                                    <div className="mt-3 pt-3 border-t border-slate-700">
                                                        <Badge className="bg-slate-700 text-slate-300 text-xs">
                                                            Batch: {student.batch_time} ({student.batch_month}/{student.batch_year})
                                                        </Badge>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
