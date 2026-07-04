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
    ArrowLeft,
    BookOpen,
    ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { PortalNav } from '@/components/layouts/portal-nav';

interface Student {
    id: string;
    student_id: string;
    user?: {
        full_name: string;
        email: string;
        phone: string | null;
    };
    enrollment_date: string;
    batch_id: string;
}

interface BatchInfo {
    id: string;
    name: string;
}

export default function StaffStudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [batches, setBatches] = useState<BatchInfo[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setIsLoading(true);
            const [studentsRes, batchesRes] = await Promise.all([
                apiClient.get('/api/students'),
                apiClient.get('/api/batches'),
            ]);
            setStudents(studentsRes.data.items || studentsRes.data || []);
            setBatches(batchesRes.data || []);
        } catch (error) {
            console.error('Failed to fetch students:', error);
            toast.error('Failed to load students');
        } finally {
            setIsLoading(false);
        }
    };

    const batchNameFor = (student: Student) =>
        batches.find((b) => b.id === student.batch_id)?.name || null;

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
        <div className="min-h-screen bg-paper">
            <PortalNav
                title="Staff Portal"
                links={[
                    { href: '/staff', label: 'Dashboard' },
                    { href: '/staff/students', label: 'Students' },
                ]}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Link href="/staff">
                            <Button variant="ghost" size="icon" className="text-ink-muted hover:text-ink">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
                                <GraduationCap className="h-7 w-7 text-primary" />
                                Student Progress Management
                            </h1>
                            <p className="text-ink-muted">View and update student module progress</p>
                        </div>
                    </div>
                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                        <Input
                            placeholder="Search students..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-muted border-line text-ink placeholder:text-ink-muted"
                        />
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <Card className="bg-surface border-line">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-accent-soft">
                                <Users className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-ink">{students.length}</p>
                                <p className="text-sm text-ink-muted">Total Students</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-surface border-line">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-accent-soft">
                                <BookOpen className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-ink">{filteredStudents.length}</p>
                                <p className="text-sm text-ink-muted">Showing</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-surface border-line">
                        <CardContent className="p-4 flex items-center gap-4">
                            <div className="p-3 rounded-xl bg-warning/10">
                                <GraduationCap className="h-6 w-6 text-warning" />
                            </div>
                            <div>
                                <p className="text-sm text-ink-muted">Click on a student</p>
                                <p className="text-sm text-ink">to manage their progress</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Student List */}
                <Card className="bg-surface border-line">
                    <CardHeader>
                        <CardTitle className="text-ink">Students</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredStudents.length === 0 ? (
                            <div className="text-center py-12">
                                <Users className="h-12 w-12 text-ink-muted mx-auto mb-4" />
                                <p className="text-ink-muted">
                                    {searchQuery ? 'No students match your search' : 'No students found'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredStudents.map((student) => (
                                    <Link key={student.id} href={`/staff/students/${student.id}`}>
                                        <Card className="bg-muted border-line hover:border-primary/40 transition-all cursor-pointer group">
                                            <CardContent className="p-4">
                                                <div className="flex items-start gap-4">
                                                    <Avatar className="h-12 w-12 ring-2 ring-line group-hover:ring-primary/20">
                                                        <AvatarFallback className="bg-accent-soft text-ink text-sm">
                                                            {getInitials(student.user?.full_name || 'ST')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="font-semibold text-ink truncate">
                                                            {student.user?.full_name || 'Unknown'}
                                                        </p>
                                                        <p className="text-sm text-ink-muted font-mono">
                                                            {student.student_id}
                                                        </p>
                                                        <p className="text-sm text-ink-muted truncate">
                                                            {student.user?.email}
                                                        </p>
                                                    </div>
                                                    <ChevronRight className="h-5 w-5 text-ink-muted group-hover:text-primary transition-colors" />
                                                </div>
                                                {batchNameFor(student) && (
                                                    <div className="mt-3 pt-3 border-t border-line">
                                                        <Badge className="bg-muted text-ink text-xs">
                                                            Batch: {batchNameFor(student)}
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
