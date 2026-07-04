'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Building2,
    ArrowLeft,
    MapPin,
    Mail,
    Phone,
    Users,
    GraduationCap,
    Edit,
    Trash2,
    UserPlus,
    Calendar,
    IndianRupee,
} from 'lucide-react';
import { toast } from 'sonner';

// Mock institution data
const mockInstitution = {
    id: '1',
    name: 'TechEdu Institute - Mumbai',
    address: '123 Learning Street, Andheri West, Mumbai 400053',
    contact_email: 'mumbai@techedu.in',
    contact_phone: '+91 22 1234 5678',
    director_name: 'Dr. Arun Verma',
    director_email: 'arun@techedu.in',
    director_phone: '+91 98765 43210',
    staff_count: 12,
    student_count: 156,
    active_courses: 8,
    monthly_revenue: '₹3.2L',
    status: 'active',
    created_at: '15 Jan 2024',
};

// Mock staff data
const mockStaff = [
    { id: '1', name: 'Priya Sharma', role: 'Senior Instructor', email: 'priya@techedu.in', phone: '+91 98765 11111' },
    { id: '2', name: 'Raj Kumar', role: 'Instructor', email: 'raj@techedu.in', phone: '+91 98765 22222' },
    { id: '3', name: 'Anjali Patel', role: 'Admin Staff', email: 'anjali@techedu.in', phone: '+91 98765 33333' },
];

// Mock students data
const mockStudents = [
    { id: '1', name: 'Amit Singh', course: 'Web Development', enrollment_date: '01 Feb 2024' },
    { id: '2', name: 'Neha Gupta', course: 'Python Programming', enrollment_date: '05 Feb 2024' },
    { id: '3', name: 'Rohit Verma', course: 'Data Science', enrollment_date: '10 Feb 2024' },
];

export default function InstitutionDetailPage() {
    const params = useParams();
    const router = useRouter();
    const institutionId = params.id;

    const [institution] = useState(mockInstitution);
    const [hasAdmin, setHasAdmin] = useState(!!institution.director_email);

    const handleDeleteInstitution = () => {
        if (confirm(`Are you sure you want to delete "${institution.name}"?`)) {
            toast.success('Institution deleted successfully!');
            router.push('/dashboard/institutions');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/institutions">
                        <Button variant="ghost" size="icon" className="text-ink-muted hover:text-ink">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-ink flex items-center gap-3">
                            {institution.name}
                            <Badge
                                className={
                                    institution.status === 'active'
                                        ? 'bg-accent-soft text-success border-success/30'
                                        : 'bg-warning/10 text-warning border-line'
                                }
                            >
                                {institution.status}
                            </Badge>
                        </h1>
                        <p className="text-ink-muted mt-1">Created on {institution.created_at}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="border-line text-ink hover:bg-muted"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Details
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleDeleteInstitution}
                        className="border-line text-danger hover:bg-danger/10 hover:border-line"
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-surface border-line">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-accent-soft">
                            <GraduationCap className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-ink">{institution.student_count}</p>
                            <p className="text-sm text-ink-muted">Students</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-surface border-line">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-accent-soft">
                            <Users className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-ink">{institution.staff_count}</p>
                            <p className="text-sm text-ink-muted">Staff</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-surface border-line">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-accent-soft">
                            <Calendar className="h-6 w-6 text-success" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-ink">{institution.active_courses}</p>
                            <p className="text-sm text-ink-muted">Courses</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-surface border-line">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-warning/10">
                            <IndianRupee className="h-6 w-6 text-warning" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-ink">{institution.monthly_revenue}</p>
                            <p className="text-sm text-ink-muted">Revenue</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Institution Details & Admin */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Contact Details */}
                <Card className="bg-surface border-line">
                    <CardHeader>
                        <CardTitle className="text-ink flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            Institution Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                                <MapPin className="h-5 w-5 text-ink-muted flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-ink-muted mb-1">Address</p>
                                    <p className="text-sm text-ink">{institution.address}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                                <Mail className="h-5 w-5 text-ink-muted flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-ink-muted mb-1">Email</p>
                                    <p className="text-sm text-ink">{institution.contact_email}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
                                <Phone className="h-5 w-5 text-ink-muted flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-xs text-ink-muted mb-1">Phone</p>
                                    <p className="text-sm text-ink">{institution.contact_phone}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Franchise Admin */}
                <Card className="bg-surface border-line">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-ink flex items-center gap-2">
                                <UserPlus className="h-5 w-5 text-primary" />
                                Franchise Admin
                            </CardTitle>
                            {!hasAdmin && (
                                <Button
                                    onClick={() => {
                                        // Will open create admin dialog
                                        toast.info('Create admin dialog will open here');
                                    }}
                                    className="bg-primary"
                                >
                                    <UserPlus className="h-4 w-4 mr-2" />
                                    Create Admin
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {hasAdmin ? (
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 rounded-lg bg-accent-soft border border-line">
                                    <div className="h-12 w-12 rounded-full bg-accent-soft flex items-center justify-center text-ink font-semibold text-lg">
                                        {institution.director_name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold text-ink">{institution.director_name}</p>
                                        <p className="text-sm text-ink-muted">Franchise Administrator</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-ink-muted" />
                                        <span className="text-ink">{institution.director_email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-ink-muted" />
                                        <span className="text-ink">{institution.director_phone}</span>
                                    </div>
                                </div>
                                <div className="pt-2 flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-line text-ink hover:bg-muted"
                                    >
                                        Edit Admin
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-line text-danger hover:bg-danger/10"
                                    >
                                        Remove Admin
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="py-8 text-center">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                                    <UserPlus className="h-8 w-8 text-ink-muted" />
                                </div>
                                <p className="text-ink-muted mb-4">
                                    No franchise admin assigned yet
                                </p>
                                <p className="text-sm text-ink-muted">
                                    Create an admin account to manage this institution
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Staff & Students Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Staff List */}
                <Card className="bg-surface border-line">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-ink flex items-center gap-2">
                                <Users className="h-5 w-5 text-primary" />
                                Staff Members ({mockStaff.length})
                            </CardTitle>
                            <Link href={`/dashboard/staff?institution=${institutionId}`}>
                                <Button variant="ghost" size="sm" className="text-ink-muted hover:text-ink">
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mockStaff.map((staff) => (
                                <div
                                    key={staff.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-accent-soft flex items-center justify-center text-ink font-medium">
                                            {staff.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-ink">{staff.name}</p>
                                            <p className="text-xs text-ink-muted">{staff.role}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Students */}
                <Card className="bg-surface border-line">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-ink flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-primary" />
                                Recent Students ({mockStudents.length})
                            </CardTitle>
                            <Link href={`/dashboard/students?institution=${institutionId}`}>
                                <Button variant="ghost" size="sm" className="text-ink-muted hover:text-ink">
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {mockStudents.map((student) => (
                                <div
                                    key={student.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-accent-soft flex items-center justify-center text-ink font-medium">
                                            {student.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-ink">{student.name}</p>
                                            <p className="text-xs text-ink-muted">{student.course}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-ink-muted">{student.enrollment_date}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
