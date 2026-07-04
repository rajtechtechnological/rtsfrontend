'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { studentsApi, coursesApi, batchesApi } from '@/lib/api/endpoints';
import { batchLabel } from '@/lib/batches';
import type { Student, Batch } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { LedgerTable, type LedgerColumn } from '@/components/ui/ledger-table';
import { Stamp } from '@/components/ui/stamp';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, MoreHorizontal } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Removed mock data - fetching from API

const studentSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().optional(),
    date_of_birth: z.string().optional(),
    father_name: z.string().min(2, 'Father name is required'),
    guardian_name: z.string().optional(),
    guardian_phone: z.string().optional(),
    address: z.string().optional(),
    aadhar_number: z.string().optional(),
    apaar_id: z.string().optional(),
    last_qualification: z.string().optional(),
    course_id: z.string().optional(),
    batch_id: z.string().min(1, 'Please select a batch'),
});

type StudentFormData = z.infer<typeof studentSchema>;

const fieldLabelClass = 'text-xs uppercase tracking-wide text-ink-muted';

function AddStudentDialog({ batches }: { batches: Batch[] }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);

    const activeBatches = batches.filter((b) => b.is_active);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<StudentFormData>({
        resolver: zodResolver(studentSchema),
    });

    useEffect(() => {
        if (open) {
            fetchCourses();
        }
    }, [open]);

    const fetchCourses = async () => {
        try {
            const response = await coursesApi.list();
            setCourses(response.data || []);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
        }
    };

    const onSubmit = async (data: StudentFormData) => {
        setIsLoading(true);
        try {
            await studentsApi.register({
                full_name: data.full_name,
                email: data.email,
                phone: data.phone,
                date_of_birth: data.date_of_birth,
                father_name: data.father_name,
                guardian_name: data.guardian_name,
                guardian_phone: data.guardian_phone,
                address: data.address,
                aadhar_number: data.aadhar_number,
                apaar_id: data.apaar_id,
                last_qualification: data.last_qualification,
                batch_id: data.batch_id,
                course_id: data.course_id,
            });
            toast.success('Student added successfully!');
            reset();
            setOpen(false);
            // Refresh the students list
            window.location.reload();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to add student');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add Student</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-serif text-ink">Add New Student</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-base text-ink border-b border-line pb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name" className={fieldLabelClass}>Full Name (required)</Label>
                                <Input
                                    id="full_name"
                                    placeholder="Enter student name"
                                    {...register('full_name')}
                                />
                                {errors.full_name && (
                                    <p className="text-sm text-danger">{errors.full_name.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="father_name" className={fieldLabelClass}>Father's Name (required)</Label>
                                <Input
                                    id="father_name"
                                    placeholder="Enter father's name"
                                    {...register('father_name')}
                                />
                                {errors.father_name && (
                                    <p className="text-sm text-danger">{errors.father_name.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth" className={fieldLabelClass}>Date of Birth</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    {...register('date_of_birth')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="aadhar_number" className={fieldLabelClass}>Aadhar Number</Label>
                                <Input
                                    id="aadhar_number"
                                    placeholder="Enter 12-digit Aadhar number"
                                    maxLength={12}
                                    {...register('aadhar_number')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="apaar_id" className={fieldLabelClass}>APAAR ID</Label>
                                <Input
                                    id="apaar_id"
                                    placeholder="Enter APAAR ID (optional)"
                                    {...register('apaar_id')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_qualification" className={fieldLabelClass}>Last Qualification</Label>
                                <Input
                                    id="last_qualification"
                                    placeholder="e.g., 12th, Graduate, etc."
                                    {...register('last_qualification')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-base text-ink border-b border-line pb-2">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className={fieldLabelClass}>Email (required)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="student@email.com"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-sm text-danger">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className={fieldLabelClass}>Phone</Label>
                                <Input
                                    id="phone"
                                    placeholder="+91 98765 43210"
                                    {...register('phone')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="guardian_name" className={fieldLabelClass}>Guardian Name (if different)</Label>
                                <Input
                                    id="guardian_name"
                                    placeholder="Enter guardian name"
                                    {...register('guardian_name')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="guardian_phone" className={fieldLabelClass}>Guardian Phone</Label>
                                <Input
                                    id="guardian_phone"
                                    placeholder="+91 98765 43210"
                                    {...register('guardian_phone')}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address" className={fieldLabelClass}>Address</Label>
                                <Input
                                    id="address"
                                    placeholder="Enter full address"
                                    {...register('address')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Course Selection */}
                    <div className="space-y-4">
                        <h3 className="font-serif text-base text-ink border-b border-line pb-2">Course Enrollment</h3>
                        <div className="space-y-2">
                            <Label className={fieldLabelClass}>Select Course</Label>
                            <Select onValueChange={(value) => setValue('course_id', value)}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a course (optional)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => (
                                        <SelectItem key={course.id} value={course.id}>
                                            {course.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Target Batch Section */}
                    <div className="rounded-md border border-line p-4 space-y-4">
                        <h3 className={fieldLabelClass}>Target Batch</h3>
                        <div className="space-y-2">
                            <Label className={fieldLabelClass}>Batch (required)</Label>
                            <Select onValueChange={(value) => setValue('batch_id', value, { shouldValidate: true })}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a batch" />
                                </SelectTrigger>
                                <SelectContent>
                                    {activeBatches.map((batch) => (
                                        <SelectItem key={batch.id} value={batch.id}>
                                            {batchLabel(batch)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.batch_id && (
                                <p className="text-sm text-danger">{errors.batch_id.message}</p>
                            )}
                            {activeBatches.length === 0 && (
                                <p className="text-xs text-warning">
                                    No active batches. Create one under Batches first.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-line">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                'Add Student'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

const toolbarSelectClass =
    'h-9 rounded-md border border-line bg-surface px-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-ring';

export default function StudentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [batches, setBatches] = useState<Batch[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [selectedBatch, setSelectedBatch] = useState<string>('');

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [studentsResponse, coursesResponse, batchesResponse] = await Promise.all([
                studentsApi.list(),
                coursesApi.list(),
                batchesApi.list(),
            ]);
            setStudents(studentsResponse.data || []);
            setCourses(coursesResponse.data || []);
            setBatches(batchesResponse.data || []);
        } catch (error: any) {
            console.error('Failed to fetch data:', error);
            toast.error('Failed to load data');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Filter students based on all criteria
    const filteredStudents = students.filter((student) => {
        // Search filter
        const matchesSearch = !searchQuery ||
            student.user?.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.student_id?.toLowerCase().includes(searchQuery.toLowerCase());

        // Course filter - check if student is enrolled in selected course
        const matchesCourse = !selectedCourse ||
            student.course_enrollments?.some((e: any) => e.course_id === selectedCourse);

        // Batch filter
        const matchesBatch = !selectedBatch || student.batch_id === selectedBatch;

        return matchesSearch && matchesCourse && matchesBatch;
    });

    const selectedCourseName = courses.find(c => c.id === selectedCourse)?.name;

    const clearFilters = () => {
        setSelectedCourse(null);
        setSelectedBatch('');
    };

    const hasFilters = !!(selectedCourse || selectedBatch);

    const courseNameFor = (student: Student) => {
        const enrollment: any = student.course_enrollments?.[0];
        if (!enrollment) return null;
        return enrollment.course?.name || courses.find(c => c.id === enrollment.course_id)?.name || null;
    };

    const batchLabelFor = (student: Student) => {
        const batch = batches.find((b) => b.id === student.batch_id);
        return batch?.name ?? null;
    };

    const columns: LedgerColumn<Student>[] = [
        {
            key: 'photo',
            header: '',
            headerClassName: 'w-10',
            cell: (student) => (
                <Avatar className="h-6 w-6 rounded-sm">
                    {student.photo_url && <AvatarImage src={student.photo_url} alt="" />}
                    <AvatarFallback className="rounded-sm bg-muted text-[10px] text-ink-muted">
                        {student.user?.full_name
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .slice(0, 2) || '?'}
                    </AvatarFallback>
                </Avatar>
            ),
        },
        {
            key: 'student_id',
            header: 'Student ID',
            cell: (student) => (
                <span className="font-mono tabular-nums text-ink">{student.student_id}</span>
            ),
        },
        {
            key: 'name',
            header: 'Name',
            cell: (student) => (
                <Link
                    href={`/dashboard/students/${student.id}`}
                    className="font-medium text-ink hover:underline"
                >
                    {student.user?.full_name || 'N/A'}
                </Link>
            ),
        },
        {
            key: 'batch',
            header: 'Batch',
            cell: (student) =>
                batchLabelFor(student) ?? <span className="text-ink-muted">Not assigned</span>,
        },
        {
            key: 'course',
            header: 'Course',
            cell: (student) =>
                courseNameFor(student) ?? <span className="text-ink-muted">—</span>,
        },
        {
            // The list API does not return a fee status; show the student's
            // enrollment status (active/completed/dropped), which it does return.
            key: 'status',
            header: 'Status',
            cell: (student) => <Stamp status={student.status || 'active'} />,
        },
        {
            key: 'actions',
            header: '',
            align: 'right',
            headerClassName: 'w-12',
            cell: (student) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="text-ink-muted hover:text-ink">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <Link href={`/dashboard/students/${student.id}`}>
                            <DropdownMenuItem className="cursor-pointer">View Profile</DropdownMenuItem>
                        </Link>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-serif text-2xl font-semibold text-ink">Students</h1>
                    <p className="text-sm text-ink-muted mt-1">Student records and enrollments</p>
                </div>
                <AddStudentDialog batches={batches} />
            </div>

            {/* Toolbar: search + plain select filters */}
            <div className="flex flex-wrap items-center gap-3">
                <Input
                    placeholder="Search by name, email or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-full sm:w-64"
                />
                <select
                    value={selectedCourse ?? ''}
                    onChange={(e) => {
                        setSelectedCourse(e.target.value || null);
                        setSelectedBatch('');
                    }}
                    className={toolbarSelectClass}
                >
                    <option value="">All courses</option>
                    {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                            {course.name}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className={toolbarSelectClass}
                >
                    <option value="">All batches</option>
                    {batches.map((batch) => (
                        <option key={batch.id} value={batch.id}>
                            {batch.name}
                        </option>
                    ))}
                </select>
                {hasFilters && (
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="text-ink-muted">
                        Clear filters
                    </Button>
                )}
            </div>

            {/* Register */}
            <section className="rounded-md border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <h2 className="font-serif text-lg text-ink">
                        {selectedCourse ? `Students — ${selectedCourseName}` : 'All Students'}
                    </h2>
                    <span className="font-mono text-xs tabular-nums text-ink-muted">
                        {filteredStudents.length} records
                    </span>
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
                    </div>
                ) : (
                    <LedgerTable
                        columns={columns}
                        rows={filteredStudents}
                        rowKey={(student) => student.id}
                        emptyMessage={
                            searchQuery || hasFilters
                                ? 'No students match the current filters.'
                                : 'No students are enrolled yet.'
                        }
                    />
                )}
            </section>
        </div>
    );
}
