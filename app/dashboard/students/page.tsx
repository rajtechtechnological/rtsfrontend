'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { studentsApi, coursesApi } from '@/lib/api/endpoints';
import type { Student } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    GraduationCap,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    Eye,
    Edit,
    Trash2,
    Loader2,
    BookOpen,
    Users,
} from 'lucide-react';
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
    batch_time: z.string().optional(),
    batch_month: z.string().optional(),
    batch_year: z.string().optional(),
    batch_identifier: z.string().optional(),
});

// Predefined batch time slots
const BATCH_TIME_SLOTS = [
    '9AM-10AM',
    '10AM-11AM',
    '11AM-12PM',
    '12PM-1PM',
    '2PM-3PM',
    '3PM-4PM',
    '4PM-5PM',
    '5PM-6PM',
    '6PM-7PM',
];

// Generate months for dropdown
const MONTHS = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

// Generate years (current year and next 2 years)
const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1, currentYear + 2].map(y => y.toString());

type StudentFormData = z.infer<typeof studentSchema>;

function AddStudentDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [courses, setCourses] = useState<any[]>([]);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<StudentFormData>({
        resolver: zodResolver(studentSchema),
        defaultValues: {
            batch_year: String(currentYear),
        },
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
                batch_time: data.batch_time,
                batch_month: data.batch_month,
                batch_year: data.batch_year,
                batch_identifier: data.batch_identifier,
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
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 sm:max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-400" />
                        Add New Student
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Personal Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full_name" className="text-slate-300">Full Name *</Label>
                                <Input
                                    id="full_name"
                                    className="bg-slate-800/50 border-slate-700 text-white"
                                    placeholder="Enter student name"
                                    {...register('full_name')}
                                />
                                {errors.full_name && (
                                    <p className="text-sm text-red-400">{errors.full_name.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="father_name" className="text-slate-300">Father's Name *</Label>
                                <Input
                                    id="father_name"
                                    className="bg-slate-800/50 border-slate-700 text-white"
                                    placeholder="Enter father's name"
                                    {...register('father_name')}
                                />
                                {errors.father_name && (
                                    <p className="text-sm text-red-400">{errors.father_name.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="date_of_birth" className="text-slate-300">Date of Birth</Label>
                                <Input
                                    id="date_of_birth"
                                    type="date"
                                    className="bg-slate-800/50 border-slate-700 text-white"
                                    {...register('date_of_birth')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="aadhar_number" className="text-slate-300">Aadhar Number</Label>
                                <Input
                                    id="aadhar_number"
                                    className="bg-slate-800/50 border-slate-700 text-white"
                                    placeholder="Enter 12-digit Aadhar number"
                                    maxLength={12}
                                    {...register('aadhar_number')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="apaar_id" className="text-slate-300">APAAR ID</Label>
                                <Input
                                    id="apaar_id"
                                    className="bg-slate-800/50 border-slate-700 text-white"
                                    placeholder="Enter APAAR ID (optional)"
                                    {...register('apaar_id')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="last_qualification" className="text-slate-300">Last Qualification</Label>
                                <Input
                                    id="last_qualification"
                                    className="bg-slate-800/50 border-slate-700 text-white"
                                    placeholder="e.g., 12th, Graduate, etc."
                                    {...register('last_qualification')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Contact Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-slate-300">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    className="bg-slate-800/50 border-slate-700 text-white"
                                    placeholder="student@email.com"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-400">{errors.email.message}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                                <Input
                                    id="phone"
                                    className="bg-slate-800/50 border-slate-700 text-white"
                                    placeholder="+91 98765 43210"
                                    {...register('phone')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="guardian_name" className="text-slate-300">Guardian Name (if different)</Label>
                                <Input
                                    id="guardian_name"
                                    className="bg-slate-800/50 border-slate-700 text-white"
                                    placeholder="Enter guardian name"
                                    {...register('guardian_name')}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="guardian_phone" className="text-slate-300">Guardian Phone</Label>
                                <Input
                                    id="guardian_phone"
                                    className="bg-slate-800/50 border-slate-700 text-white"
                                    placeholder="+91 98765 43210"
                                    {...register('guardian_phone')}
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <Label htmlFor="address" className="text-slate-300">Address</Label>
                                <Input
                                    id="address"
                                    className="bg-slate-800/50 border-slate-700 text-white"
                                    placeholder="Enter full address"
                                    {...register('address')}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Course Selection */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white border-b border-slate-700 pb-2">Course Enrollment</h3>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Select Course</Label>
                            <Select onValueChange={(value) => setValue('course_id', value)}>
                                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white w-full">
                                    <SelectValue placeholder="Select a course (optional)" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
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
                    <div className="bg-slate-800/30 rounded-lg p-4 space-y-4">
                        <h3 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Target Batch
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs">Batch Time *</Label>
                                <Select onValueChange={(value) => setValue('batch_time', value)}>
                                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        {BATCH_TIME_SLOTS.map((slot) => (
                                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs">Batch (A/B)</Label>
                                <Select onValueChange={(value) => setValue('batch_identifier', value)}>
                                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        <SelectItem value="A">Batch A</SelectItem>
                                        <SelectItem value="B">Batch B</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs">Month *</Label>
                                <Select onValueChange={(value) => setValue('batch_month', value)}>
                                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                        <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        {MONTHS.map((month) => (
                                            <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-xs">Year *</Label>
                                <Select defaultValue={String(currentYear)} onValueChange={(value) => setValue('batch_year', value)}>
                                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-900 border-slate-700">
                                        {YEARS.map((year) => (
                                            <SelectItem key={year} value={year}>{year}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        >
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

export default function StudentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Filter states
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [selectedBatchMonth, setSelectedBatchMonth] = useState<string>('');
    const [selectedBatchYear, setSelectedBatchYear] = useState<string>('');
    const [selectedBatchIdentifier, setSelectedBatchIdentifier] = useState<string>('');

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [studentsResponse, coursesResponse] = await Promise.all([
                studentsApi.list(),
                coursesApi.list()
            ]);
            setStudents(studentsResponse.data || []);
            setCourses(coursesResponse.data || []);
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

    // Get unique batches for selected course
    const getUniqueBatches = () => {
        if (!selectedCourse) return [];

        const courseStudents = students.filter(s =>
            s.course_enrollments?.some((e: any) => e.course_id === selectedCourse)
        );

        const batches = new Map<string, { month: string; year: string; identifier: string; count: number }>();

        courseStudents.forEach(student => {
            if (student.batch_month && student.batch_year) {
                const key = `${student.batch_month}/${student.batch_year}${student.batch_identifier || ''}`;
                if (!batches.has(key)) {
                    batches.set(key, {
                        month: student.batch_month,
                        year: student.batch_year,
                        identifier: student.batch_identifier || '',
                        count: 1
                    });
                } else {
                    batches.get(key)!.count++;
                }
            }
        });

        return Array.from(batches.values());
    };

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

        // Batch filters
        const matchesBatchMonth = !selectedBatchMonth || student.batch_month === selectedBatchMonth;
        const matchesBatchYear = !selectedBatchYear || student.batch_year === selectedBatchYear;
        const matchesBatchIdentifier = !selectedBatchIdentifier || student.batch_identifier === selectedBatchIdentifier;

        return matchesSearch && matchesCourse && matchesBatchMonth && matchesBatchYear && matchesBatchIdentifier;
    });

    const selectedCourseName = courses.find(c => c.id === selectedCourse)?.name;

    const clearFilters = () => {
        setSelectedCourse(null);
        setSelectedBatchMonth('');
        setSelectedBatchYear('');
        setSelectedBatchIdentifier('');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <GraduationCap className="h-7 w-7 text-blue-400" />
                        Students
                    </h1>
                    <p className="text-slate-400 mt-1">Manage student records and enrollments</p>
                </div>
                <AddStudentDialog />
            </div>

            {/* Course Selection - Step 1 */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="pb-3">
                    <CardTitle className="text-white text-lg">Select Course</CardTitle>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-blue-400" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                            {courses.map((course) => (
                                <button
                                    key={course.id}
                                    onClick={() => {
                                        setSelectedCourse(selectedCourse === course.id ? null : course.id);
                                        setSelectedBatchMonth('');
                                        setSelectedBatchYear('');
                                        setSelectedBatchIdentifier('');
                                    }}
                                    className={`p-4 rounded-lg border transition-all text-left ${
                                        selectedCourse === course.id
                                            ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/50'
                                            : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                                    }`}
                                >
                                    <BookOpen className={`h-5 w-5 mb-2 ${selectedCourse === course.id ? 'text-blue-400' : 'text-slate-400'}`} />
                                    <p className="font-medium text-white text-sm truncate">{course.name}</p>
                                    <p className="text-xs text-slate-400 mt-1">
                                        {students.filter(s => s.course_enrollments?.some((e: any) => e.course_id === course.id)).length} students
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Batch Selection - Step 2 (shows when course is selected) */}
            {selectedCourse && (
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white text-lg">
                                Filter by Batch - {selectedCourseName}
                            </CardTitle>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                                className="text-slate-400 hover:text-white"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">Month</Label>
                                <select
                                    value={selectedBatchMonth}
                                    onChange={(e) => setSelectedBatchMonth(e.target.value)}
                                    className="bg-slate-800/50 border border-slate-700 text-white rounded-md px-3 py-2 min-w-[140px]"
                                >
                                    <option value="">All Months</option>
                                    {MONTHS.map((month) => (
                                        <option key={month.value} value={month.value}>
                                            {month.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">Year</Label>
                                <select
                                    value={selectedBatchYear}
                                    onChange={(e) => setSelectedBatchYear(e.target.value)}
                                    className="bg-slate-800/50 border border-slate-700 text-white rounded-md px-3 py-2 min-w-[100px]"
                                >
                                    <option value="">All Years</option>
                                    {YEARS.map((year) => (
                                        <option key={year} value={year}>
                                            {year}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-400 text-sm">Batch</Label>
                                <select
                                    value={selectedBatchIdentifier}
                                    onChange={(e) => setSelectedBatchIdentifier(e.target.value)}
                                    className="bg-slate-800/50 border border-slate-700 text-white rounded-md px-3 py-2 min-w-[100px]"
                                >
                                    <option value="">All (A/B)</option>
                                    <option value="A">Batch A</option>
                                    <option value="B">Batch B</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Search & Students Table */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <CardTitle className="text-white">
                            {selectedCourse ? `Students - ${selectedCourseName}` : 'All Students'}
                            <Badge variant="secondary" className="ml-2 bg-slate-800 text-slate-300">
                                {filteredStudents.length}
                            </Badge>
                        </CardTitle>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                        </div>
                    ) : filteredStudents.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <GraduationCap className="h-12 w-12 text-slate-600 mb-4" />
                            <p className="text-slate-400 text-center">
                                {searchQuery || selectedCourse ? 'No students found matching your filters' : 'No students enrolled yet. Add your first student!'}
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-800 hover:bg-transparent">
                                        <TableHead className="text-slate-400">Student</TableHead>
                                        <TableHead className="text-slate-400">Contact</TableHead>
                                        <TableHead className="text-slate-400">Batch</TableHead>
                                        <TableHead className="text-slate-400">Enrolled Date</TableHead>
                                        <TableHead className="text-slate-400">Status</TableHead>
                                        <TableHead className="text-slate-400 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredStudents.map((student) => (
                                    <TableRow
                                        key={student.id}
                                        className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                        {student.user?.full_name
                                                            ?.split(' ')
                                                            .map((n) => n[0])
                                                            .join('') || '?'}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-white">{student.user?.full_name || 'N/A'}</p>
                                                    <p className="text-sm text-slate-400">{student.student_id}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1 text-sm text-slate-300">
                                                    <Mail className="h-3 w-3" /> {student.user?.email || 'N/A'}
                                                </span>
                                                <span className="flex items-center gap-1 text-sm text-slate-400">
                                                    <Phone className="h-3 w-3" /> {student.user?.phone || 'N/A'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {student.batch_time ? (
                                                <div className="space-y-1">
                                                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                                                        {student.batch_time}
                                                    </Badge>
                                                    {student.batch_month && student.batch_year && (
                                                        <p className="text-xs text-slate-400">
                                                            {MONTHS.find(m => m.value === student.batch_month)?.label} {student.batch_year}
                                                            {student.batch_identifier && ` (${student.batch_identifier})`}
                                                        </p>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-slate-500 text-sm">Not assigned</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            {new Date(student.enrollment_date).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                                                Active
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                                                    <Link href={`/dashboard/students/${student.id}`}>
                                                        <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer">
                                                            <Eye className="h-4 w-4 mr-2" /> View Profile
                                                        </DropdownMenuItem>
                                                    </Link>
                                                    <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
                                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
