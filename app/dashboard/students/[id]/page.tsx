'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { studentsApi } from '@/lib/api/endpoints';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    GraduationCap,
    Mail,
    Phone,
    MapPin,
    Calendar,
    BookOpen,
    Award,
    Clock,
    CheckCircle,
    XCircle,
    Loader2,
    ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

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
    user: {
        full_name: string;
        email: string;
        phone: string;
    };
    date_of_birth: string;
    address: string;
    enrollment_date: string;
    photo_url: string | null;
}

interface StudentCourse {
    id: string;
    course: {
        id: string;
        name: string;
        duration_months: number;
        fee_amount: number;
    };
    enrollment_date: string;
    status: string;
}

export default function StudentDetailPage() {
    const params = useParams();
    const studentId = params.id as string;

    const [student, setStudent] = useState<Student | null>(null);
    const [courses, setCourses] = useState<StudentCourse[]>([]);
    const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({});
    const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

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
            if (coursesData.length > 0 && !selectedCourse) {
                setSelectedCourse(coursesData[0].course.id);
            }
        } catch (error) {
            console.error('Failed to fetch student data:', error);
            toast.error('Failed to load student data');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            not_started: {
                label: 'Not Started',
                className: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
                icon: Clock,
            },
            in_progress: {
                label: 'In Progress',
                className: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                icon: BookOpen,
            },
            completed: {
                label: 'Completed',
                className: 'bg-green-500/10 text-green-400 border-green-500/30',
                icon: CheckCircle,
            },
            failed: {
                label: 'Failed',
                className: 'bg-red-500/10 text-red-400 border-red-500/30',
                icon: XCircle,
            },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.not_started;
        const Icon = config.icon;

        return (
            <Badge className={`${config.className} border flex items-center gap-1`}>
                <Icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!student) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-slate-400 mb-4">Student not found</p>
                <Link href="/dashboard/students">
                    <Button variant="outline">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Students
                    </Button>
                </Link>
            </div>
        );
    }

    const selectedCourseProgress = selectedCourse ? courseProgress[selectedCourse] : null;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/dashboard/students">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-white">Student Profile</h1>
                    <p className="text-slate-400">View student details and progress</p>
                </div>
            </div>

            {/* Student Info Card */}
            <Card className="bg-slate-900 border-slate-800">
                <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                        <Avatar className="h-24 w-24 border-2 border-slate-700">
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                                {student.user.full_name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                            </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-4">
                            <div>
                                <h2 className="text-2xl font-bold text-white">{student.user.full_name}</h2>
                                <p className="text-slate-400">ID: {student.student_id}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <Mail className="h-4 w-4 text-slate-500" />
                                    <span className="text-slate-300">{student.user.email}</span>
                                </div>
                                {student.user.phone && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <Phone className="h-4 w-4 text-slate-500" />
                                        <span className="text-slate-300">{student.user.phone}</span>
                                    </div>
                                )}
                                {student.address && (
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-slate-500" />
                                        <span className="text-slate-300">{student.address}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm">
                                    <Calendar className="h-4 w-4 text-slate-500" />
                                    <span className="text-slate-300">
                                        Enrolled: {new Date(student.enrollment_date).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Module Progress Section */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-500" />
                        Course Progress
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
                            <div className="flex flex-wrap gap-2">
                                {courses.map((enrollment) => {
                                    const progress = courseProgress[enrollment.course.id];
                                    return (
                                        <Button
                                            key={enrollment.course.id}
                                            variant={selectedCourse === enrollment.course.id ? 'default' : 'outline'}
                                            onClick={() => setSelectedCourse(enrollment.course.id)}
                                            className={
                                                selectedCourse === enrollment.course.id
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600'
                                                    : 'border-slate-700 hover:border-slate-600'
                                            }
                                        >
                                            <div className="flex flex-col items-start">
                                                <span className="font-medium">{enrollment.course.name}</span>
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
                                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 border text-lg px-3 py-1">
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

                                    {/* Module List */}
                                    <div className="space-y-3">
                                        <h3 className="text-lg font-semibold text-white">Modules</h3>
                                        {selectedCourseProgress.module_progress.map((progress) => (
                                            <Card key={progress.id} className="bg-slate-800/50 border-slate-700">
                                                <CardContent className="p-4">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1 space-y-2">
                                                            <div className="flex items-start gap-3">
                                                                <Badge className="bg-slate-700 text-slate-300 shrink-0">
                                                                    Module {progress.module.module_number}
                                                                </Badge>
                                                                <div className="flex-1">
                                                                    <h4 className="font-semibold text-white">
                                                                        {progress.module.module_name}
                                                                    </h4>
                                                                    <p className="text-sm text-slate-400 mt-1">
                                                                        {progress.module.lesson_count} lessons • {progress.module.total_marks} marks
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {progress.notes && (
                                                                <p className="text-sm text-slate-400 italic pl-16">
                                                                    Note: {progress.notes}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="flex flex-col items-end gap-2 shrink-0">
                                                            {getStatusBadge(progress.status)}

                                                            {progress.marks_obtained !== null && (
                                                                <div className="text-right">
                                                                    <p className="text-sm text-slate-400">Score</p>
                                                                    <p className={`text-lg font-bold ${progress.passed ? 'text-green-400' : 'text-red-400'}`}>
                                                                        {progress.marks_obtained}/{progress.module.total_marks}
                                                                    </p>
                                                                    {progress.exam_date && (
                                                                        <p className="text-xs text-slate-500">
                                                                            {new Date(progress.exam_date).toLocaleDateString()}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
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
        </div>
    );
}
