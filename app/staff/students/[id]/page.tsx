'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import apiClient from '@/lib/api/client';
import { studentsApi } from '@/lib/api/endpoints';
import { toast } from 'sonner';
import {
    Users,
    GraduationCap,
    ArrowLeft,
    LogOut,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BookOpen,
    CheckCircle,
    XCircle,
    Clock,
    Loader2,
    Save,
    Edit3,
} from 'lucide-react';

interface Module {
    id: string;
    module_number: number;
    module_name: string;
    description: string;
    lesson_count: number;
    total_marks: number;
    passing_marks: number;
}

interface ModuleProgress {
    id: string;
    module_id: string;
    status: string;
    marks_obtained: number | null;
    exam_date: string | null;
    passed: boolean | null;
    notes: string | null;
    module: Module;
}

interface CourseProgress {
    student_id: string;
    course_id: string;
    course_name: string;
    total_modules: number;
    completed_modules: number;
    in_progress_modules: number;
    not_started_modules: number;
    overall_percentage: number;
    module_progress: ModuleProgress[];
}

interface Student {
    id: string;
    student_id: string;
    user?: {
        full_name: string;
        email: string;
        phone: string | null;
    };
    date_of_birth?: string | null;
    father_name?: string | null;
    address?: string | null;
    enrollment_date: string;
    batch_time?: string | null;
    batch_month?: string | null;
    batch_year?: string | null;
    photo_url?: string | null;
}

interface StudentCourse {
    id: string;
    course?: {
        id: string;
        name: string;
        duration_months: number;
        fee_amount: number;
    };
    enrollment_date: string;
    status: string;
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

export default function StaffStudentDetailPage() {
    const params = useParams();
    const studentId = params.id as string;

    const [student, setStudent] = useState<Student | null>(null);
    const [courses, setCourses] = useState<StudentCourse[]>([]);
    const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({});
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [savingMarks, setSavingMarks] = useState<string | null>(null);
    const [editingModule, setEditingModule] = useState<string | null>(null);
    const [marksInput, setMarksInput] = useState<Record<string, { marks: string; notes: string }>>({});

    useEffect(() => {
        fetchStudentData();
    }, [studentId]);

    const fetchStudentData = async () => {
        try {
            setIsLoading(true);

            // Fetch student details
            const studentResponse = await studentsApi.getById(studentId);
            setStudent(studentResponse.data);

            // Fetch enrolled courses
            const coursesResponse = await studentsApi.getCourses(studentId);
            const coursesData = coursesResponse.data || [];
            setCourses(coursesData);

            // Fetch progress for each course
            const progressData: Record<string, CourseProgress> = {};
            for (const enrollment of coursesData) {
                if (!enrollment.course) continue;
                try {
                    const progressResponse = await studentsApi.getCourseProgress(
                        studentId,
                        enrollment.course.id
                    );
                    progressData[enrollment.course.id] = progressResponse.data;
                } catch (error) {
                    console.error(
                        `Failed to fetch progress for course ${enrollment.course.id}:`,
                        error
                    );
                }
            }
            setCourseProgress(progressData);

            // Select first course by default
            if (coursesData.length > 0 && !selectedCourse && coursesData[0].course) {
                setSelectedCourse(coursesData[0].course.id);
            }
        } catch (error) {
            console.error('Failed to fetch student data:', error);
            toast.error('Failed to load student data');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveMarks = async (moduleId: string, moduleInfo: Module) => {
        const data = marksInput[moduleId];
        if (!data || !data.marks) {
            toast.error('Please enter marks');
            return;
        }

        const marks = parseFloat(data.marks);
        if (isNaN(marks) || marks < 0 || marks > moduleInfo.total_marks) {
            toast.error(`Marks must be between 0 and ${moduleInfo.total_marks}`);
            return;
        }

        try {
            setSavingMarks(moduleId);

            await apiClient.post('/api/progress/enter-marks', {
                student_id: studentId,
                module_id: moduleId,
                marks_obtained: marks,
                notes: data.notes || null,
                exam_date: new Date().toISOString(),
            });

            toast.success('Marks saved successfully!');
            setEditingModule(null);

            // Refresh progress data
            if (selectedCourse) {
                const progressResponse = await studentsApi.getCourseProgress(studentId, selectedCourse);
                setCourseProgress((prev) => ({
                    ...prev,
                    [selectedCourse]: progressResponse.data,
                }));
            }
        } catch (error: any) {
            console.error('Failed to save marks:', error);
            toast.error(error.response?.data?.detail || 'Failed to save marks');
        } finally {
            setSavingMarks(null);
        }
    };

    const startEditing = (progress: ModuleProgress) => {
        setEditingModule(progress.module_id);
        setMarksInput((prev) => ({
            ...prev,
            [progress.module_id]: {
                marks: progress.marks_obtained?.toString() || '',
                notes: progress.notes || '',
            },
        }));
    };

    const cancelEditing = () => {
        setEditingModule(null);
    };

    const getStatusBadge = (status: string, passed?: boolean | null) => {
        if (status === 'completed' && passed === true) {
            return (
                <Badge className="bg-green-500/10 text-green-400 border-green-500/30 border flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Passed
                </Badge>
            );
        }
        if (status === 'completed' && passed === false) {
            return (
                <Badge className="bg-red-500/10 text-red-400 border-red-500/30 border flex items-center gap-1">
                    <XCircle className="h-3 w-3" />
                    Failed
                </Badge>
            );
        }
        if (status === 'in_progress') {
            return (
                <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 border flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    In Progress
                </Badge>
            );
        }
        return (
            <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/30 border flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Not Started
            </Badge>
        );
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!student) {
        return (
            <div className="min-h-screen bg-slate-950">
                <StaffNav />
                <div className="flex flex-col items-center justify-center py-24">
                    <p className="text-slate-400 mb-4">Student not found</p>
                    <Link href="/staff/students">
                        <Button variant="outline">
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Students
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    const selectedCourseProgress = selectedCourse ? courseProgress[selectedCourse] : null;

    return (
        <div className="min-h-screen bg-slate-950">
            <StaffNav />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/staff/students">
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Student Profile</h1>
                        <p className="text-slate-400">Manage progress and update marks</p>
                    </div>
                </div>

                {/* Student Info Card */}
                <Card className="bg-slate-900 border-slate-800 mb-6">
                    <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 border-2 border-slate-700">
                                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl sm:text-2xl">
                                    {getInitials(student.user?.full_name || 'ST')}
                                </AvatarFallback>
                            </Avatar>

                            <div className="flex-1 space-y-4 text-center sm:text-left w-full">
                                <div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                                        {student.user?.full_name || 'Unknown'}
                                    </h2>
                                    <p className="text-slate-400 text-sm sm:text-base font-mono">
                                        ID: {student.student_id}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                                        <Mail className="h-4 w-4 text-slate-500 shrink-0" />
                                        <span className="text-slate-300 truncate">{student.user?.email || '-'}</span>
                                    </div>
                                    {student.user?.phone && (
                                        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                                            <Phone className="h-4 w-4 text-slate-500 shrink-0" />
                                            <span className="text-slate-300">{student.user.phone}</span>
                                        </div>
                                    )}
                                    {student.address && (
                                        <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-slate-500 shrink-0" />
                                            <span className="text-slate-300 truncate">{student.address}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-center sm:justify-start gap-2 text-sm">
                                        <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
                                        <span className="text-slate-300">
                                            Enrolled: {new Date(student.enrollment_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {student.batch_time && (
                                    <Badge className="bg-blue-600/10 text-blue-400 border-blue-600/30">
                                        Batch: {student.batch_time} ({student.batch_month}/{student.batch_year})
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Course Progress Section */}
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            <GraduationCap className="h-5 w-5 text-green-500" />
                            Course Progress & Marks Entry
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {courses.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400">No courses enrolled yet</p>
                            </div>
                        ) : (
                            <>
                                {/* Course Selection Tabs */}
                                <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 w-full">
                                    {courses
                                        .filter((e) => e.course)
                                        .map((enrollment) => {
                                            const course = enrollment.course!;
                                            const progress = courseProgress[course.id];
                                            return (
                                                <Button
                                                    key={course.id}
                                                    variant={selectedCourse === course.id ? 'default' : 'outline'}
                                                    onClick={() => setSelectedCourse(course.id)}
                                                    className={`w-full sm:w-auto max-w-full ${selectedCourse === course.id
                                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                                                        : 'border-slate-700 hover:border-slate-600'
                                                        }`}
                                                >
                                                    <div className="flex flex-col items-start min-w-0 w-full">
                                                        <span className="font-medium text-sm truncate w-full text-left">
                                                            {course.name}
                                                        </span>
                                                        {progress && (
                                                            <span className="text-xs opacity-75">
                                                                {progress.completed_modules}/{progress.total_modules} completed
                                                            </span>
                                                        )}
                                                    </div>
                                                </Button>
                                            );
                                        })}
                                </div>

                                {/* Selected Course Progress */}
                                {selectedCourseProgress && (
                                    <div className="space-y-6">
                                        {/* Overall Progress */}
                                        <div className="bg-slate-800/50 rounded-lg p-6 space-y-4">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-white">Overall Progress</h3>
                                                <Badge className="bg-green-500/10 text-green-400 border-green-500/30 border text-lg px-3 py-1">
                                                    {selectedCourseProgress.overall_percentage.toFixed(1)}%
                                                </Badge>
                                            </div>
                                            <Progress value={selectedCourseProgress.overall_percentage} className="h-2" />

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                                                <div className="bg-slate-900 rounded p-3">
                                                    <p className="text-xs text-slate-400 mb-1">Total Modules</p>
                                                    <p className="text-2xl font-bold text-white">
                                                        {selectedCourseProgress.total_modules}
                                                    </p>
                                                </div>
                                                <div className="bg-slate-900 rounded p-3">
                                                    <p className="text-xs text-green-400 mb-1">Completed</p>
                                                    <p className="text-2xl font-bold text-green-400">
                                                        {selectedCourseProgress.completed_modules}
                                                    </p>
                                                </div>
                                                <div className="bg-slate-900 rounded p-3">
                                                    <p className="text-xs text-blue-400 mb-1">In Progress</p>
                                                    <p className="text-2xl font-bold text-blue-400">
                                                        {selectedCourseProgress.in_progress_modules}
                                                    </p>
                                                </div>
                                                <div className="bg-slate-900 rounded p-3">
                                                    <p className="text-xs text-slate-400 mb-1">Not Started</p>
                                                    <p className="text-2xl font-bold text-slate-400">
                                                        {selectedCourseProgress.not_started_modules}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Module List with Editable Marks */}
                                        <div className="space-y-3">
                                            <h3 className="text-lg font-semibold text-white">Modules & Marks Entry</h3>
                                            {selectedCourseProgress.module_progress.map((progress) => (
                                                <Card key={progress.id} className="bg-slate-800/50 border-slate-700">
                                                    <CardContent className="p-4">
                                                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                            <div className="flex-1 space-y-2">
                                                                <div className="flex flex-wrap items-start gap-2 sm:gap-3">
                                                                    <Badge className="bg-slate-700 text-slate-300 shrink-0 text-xs">
                                                                        Module {progress.module.module_number}
                                                                    </Badge>
                                                                    <div className="flex-1 min-w-0">
                                                                        <h4 className="font-semibold text-white text-sm sm:text-base">
                                                                            {progress.module.module_name}
                                                                        </h4>
                                                                        <p className="text-xs sm:text-sm text-slate-400 mt-1">
                                                                            {progress.module.lesson_count} lessons • Total: {progress.module.total_marks} marks • Pass: {progress.module.passing_marks} marks
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                                                {getStatusBadge(progress.status, progress.passed)}

                                                                {editingModule === progress.module_id ? (
                                                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
                                                                        <div className="flex items-center gap-2">
                                                                            <Input
                                                                                type="number"
                                                                                min="0"
                                                                                max={progress.module.total_marks}
                                                                                step="0.5"
                                                                                placeholder="Marks"
                                                                                value={marksInput[progress.module_id]?.marks || ''}
                                                                                onChange={(e) =>
                                                                                    setMarksInput((prev) => ({
                                                                                        ...prev,
                                                                                        [progress.module_id]: {
                                                                                            ...prev[progress.module_id],
                                                                                            marks: e.target.value,
                                                                                        },
                                                                                    }))
                                                                                }
                                                                                className="w-20 bg-slate-900 border-slate-600 text-white"
                                                                            />
                                                                            <span className="text-slate-400 text-sm">
                                                                                / {progress.module.total_marks}
                                                                            </span>
                                                                        </div>
                                                                        <Input
                                                                            placeholder="Notes (optional)"
                                                                            value={marksInput[progress.module_id]?.notes || ''}
                                                                            onChange={(e) =>
                                                                                setMarksInput((prev) => ({
                                                                                    ...prev,
                                                                                    [progress.module_id]: {
                                                                                        ...prev[progress.module_id],
                                                                                        notes: e.target.value,
                                                                                    },
                                                                                }))
                                                                            }
                                                                            className="w-full sm:w-40 bg-slate-900 border-slate-600 text-white"
                                                                        />
                                                                        <div className="flex gap-2">
                                                                            <Button
                                                                                size="sm"
                                                                                onClick={() => handleSaveMarks(progress.module_id, progress.module)}
                                                                                disabled={savingMarks === progress.module_id}
                                                                                className="bg-green-600 hover:bg-green-500"
                                                                            >
                                                                                {savingMarks === progress.module_id ? (
                                                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                                                ) : (
                                                                                    <Save className="h-4 w-4" />
                                                                                )}
                                                                            </Button>
                                                                            <Button
                                                                                size="sm"
                                                                                variant="ghost"
                                                                                onClick={cancelEditing}
                                                                                className="text-slate-400"
                                                                            >
                                                                                Cancel
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex items-center gap-3">
                                                                        {progress.marks_obtained !== null && (
                                                                            <div className="text-right">
                                                                                <p className="text-xs text-slate-400">Score</p>
                                                                                <p
                                                                                    className={`text-lg font-bold ${progress.passed ? 'text-green-400' : 'text-red-400'
                                                                                        }`}
                                                                                >
                                                                                    {progress.marks_obtained}/{progress.module.total_marks}
                                                                                </p>
                                                                                {progress.exam_date && (
                                                                                    <p className="text-xs text-slate-500">
                                                                                        {new Date(progress.exam_date).toLocaleDateString()}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        )}
                                                                        <Button
                                                                            size="sm"
                                                                            variant="outline"
                                                                            onClick={() => startEditing(progress)}
                                                                            className="border-slate-600 hover:border-green-500 hover:text-green-400"
                                                                        >
                                                                            <Edit3 className="h-4 w-4 mr-1" />
                                                                            {progress.marks_obtained !== null ? 'Edit' : 'Enter Marks'}
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {progress.notes && !editingModule && (
                                                            <p className="text-xs sm:text-sm text-slate-400 italic mt-3 pt-3 border-t border-slate-700">
                                                                Note: {progress.notes}
                                                            </p>
                                                        )}
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
