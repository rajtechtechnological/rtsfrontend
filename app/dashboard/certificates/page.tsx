'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { certificatesApi } from '@/lib/api/endpoints';
import type { Certificate } from '@/types';
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

// Removed mock data - fetching from API

export default function CertificatesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [generatingId, setGeneratingId] = useState<string | null>(null);

    const fetchCertificates = async () => {
        try {
            setIsLoading(true);
            const response = await certificatesApi.list({});
            setCertificates(response.data || []);
        } catch (error: any) {
            console.error('Failed to fetch certificates:', error);
            toast.error('Failed to load certificates');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificates();
    }, []);

    const filteredCertificates = certificates.filter(
        (cert) =>
            cert.student?.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.course?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            cert.certificate_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleGenerate = async (studentId: string, courseId: string) => {
        setGeneratingId(studentId);
        try {
            await certificatesApi.generate(studentId, courseId);
            toast.success('Certificate generated successfully!');
            fetchCertificates(); // Refresh list
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to generate certificate');
        } finally {
            setGeneratingId(null);
        }
    };

    const issuedCount = certificates.filter((c) => c.certificate_number).length;
    const eligibleCount = 0; // This would need additional logic to determine eligibility
    const pendingCount = certificates.length - issuedCount;

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
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <Loader2 className="h-8 w-8 animate-spin text-amber-400 mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredCertificates.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-12">
                                            <Award className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                            <p className="text-slate-400">
                                                {searchQuery ? 'No certificates found matching your search' : 'No certificates issued yet'}
                                            </p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCertificates.map((cert) => (
                                    <TableRow
                                        key={cert.id}
                                        className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 ring-2 ring-amber-500/20">
                                                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                                                        {(cert.student?.user?.full_name || 'Unknown')
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <p className="font-medium text-white">{cert.student?.user?.full_name || 'Unknown'}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">{cert.course?.name || 'Unknown'}</TableCell>
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
                                                    cert.certificate_url
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                                }
                                            >
                                                {cert.certificate_url ? 'Issued' : 'Pending'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {cert.certificate_url ? (
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-slate-400 hover:text-white"
                                                        onClick={() => {
                                                            if (cert.certificate_url) {
                                                                window.open(cert.certificate_url, '_blank');
                                                            }
                                                        }}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-400 hover:text-blue-300"
                                                        onClick={() => {
                                                            if (cert.certificate_url) {
                                                                window.open(cert.certificate_url, '_blank');
                                                            }
                                                        }}
                                                    >
                                                        <Download className="h-4 w-4 mr-1" />
                                                        Download
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleGenerate(cert.student_id, cert.course_id)}
                                                    disabled={generatingId === cert.student_id}
                                                    className="text-emerald-400 hover:text-emerald-300"
                                                >
                                                    {generatingId === cert.student_id ? (
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
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
