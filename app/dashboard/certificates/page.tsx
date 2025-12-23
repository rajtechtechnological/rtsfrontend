'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Award,
    Search,
    Download,
    Eye,
    FileText,
    Calendar,
    GraduationCap,
    Loader2,
} from 'lucide-react';

// Mock data for certificates
const mockCertificates = [
    {
        id: '1',
        student_name: 'Rahul Sharma',
        course_name: 'Web Development Bootcamp',
        certificate_number: 'INST-WEB-2024-001',
        issue_date: '2024-11-15',
        status: 'issued',
    },
    {
        id: '2',
        student_name: 'Priya Patel',
        course_name: 'Python Programming',
        certificate_number: 'INST-PY-2024-002',
        issue_date: '2024-11-20',
        status: 'issued',
    },
    {
        id: '3',
        student_name: 'Sneha Reddy',
        course_name: 'UI/UX Design',
        certificate_number: 'INST-UX-2024-003',
        issue_date: '2024-12-01',
        status: 'issued',
    },
    {
        id: '4',
        student_name: 'Amit Kumar',
        course_name: 'Mobile App Development',
        certificate_number: null,
        issue_date: null,
        status: 'pending',
    },
    {
        id: '5',
        student_name: 'Vikram Singh',
        course_name: 'Data Science Essentials',
        certificate_number: null,
        issue_date: null,
        status: 'eligible',
    },
];

export default function CertificatesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    const filteredCertificates = mockCertificates.filter(
        (cert) =>
            cert.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.certificate_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGenerate = async (id: string) => {
        setGeneratingId(id);
        try {
            await new Promise((resolve) => setTimeout(resolve, 2000));
            toast.success('Certificate generated successfully!');
        } catch {
            toast.error('Failed to generate certificate');
        } finally {
            setGeneratingId(null);
        }
    };

    const issuedCount = mockCertificates.filter((c) => c.status === 'issued').length;
    const eligibleCount = mockCertificates.filter((c) => c.status === 'eligible').length;
    const pendingCount = mockCertificates.filter((c) => c.status === 'pending').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Award className="h-7 w-7 text-amber-400" />
                    Certificates
                </h1>
                <p className="text-slate-400 mt-1">Generate and manage course completion certificates</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-500/10">
                            <Award className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{issuedCount}</p>
                            <p className="text-sm text-slate-400">Issued</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10">
                            <GraduationCap className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{eligibleCount}</p>
                            <p className="text-sm text-slate-400">Eligible</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/10">
                            <FileText className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{pendingCount}</p>
                            <p className="text-sm text-slate-400">Pending</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by student, course, or certificate number..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Certificates Table */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">All Certificates</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400">Student</TableHead>
                                    <TableHead className="text-slate-400">Course</TableHead>
                                    <TableHead className="text-slate-400">Certificate No.</TableHead>
                                    <TableHead className="text-slate-400">Issue Date</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                    <TableHead className="text-slate-400 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCertificates.map((cert) => (
                                    <TableRow
                                        key={cert.id}
                                        className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 ring-2 ring-amber-500/20">
                                                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                                                        {cert.student_name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <p className="font-medium text-white">{cert.student_name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">{cert.course_name}</TableCell>
                                        <TableCell className="text-slate-300 font-mono text-sm">
                                            {cert.certificate_number || '-'}
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            {cert.issue_date ? (
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(cert.issue_date).toLocaleDateString('en-IN', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    cert.status === 'issued'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                        : cert.status === 'eligible'
                                                            ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                                                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                                }
                                            >
                                                {cert.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {cert.status === 'issued' ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-slate-400 hover:text-white"
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-400 hover:text-blue-300"
                                                    >
                                                        <Download className="h-4 w-4 mr-1" />
                                                        Download
                                                    </Button>
                                                </div>
                                            ) : cert.status === 'eligible' ? (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleGenerate(cert.id)}
                                                    disabled={generatingId === cert.id}
                                                    className="text-emerald-400 hover:text-emerald-300"
                                                >
                                                    {generatingId === cert.id ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                            Generating...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Award className="h-4 w-4 mr-1" />
                                                            Generate
                                                        </>
                                                    )}
                                                </Button>
                                            ) : (
                                                <span className="text-sm text-slate-500">Course in progress</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
