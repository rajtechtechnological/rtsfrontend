'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/auth-context';
import { examsApi, coursesApi, studentExamsApi } from '@/lib/api/endpoints';
import type { Exam, Course, AvailableExam } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    ClipboardList,
    Plus,
    Search,
    Clock,
    FileQuestion,
    Users,
    Edit,
    Trash2,
    Loader2,
    MoreHorizontal,
    Calendar,
    CheckCircle,
    Lock,
    Play,
    Eye,
    Award,
} from 'lucide-react';
import Link from 'next/link';

const MANAGER_ROLES = ['super_admin', 'institution_director', 'staff_manager'];

// ============ Manager View Components ============

const BATCH_TIME_SLOTS = [
    '9AM-10AM',
    '10AM-11AM',
    '11AM-12PM',
    '12PM-1PM',
    '2PM-3PM',
    '3PM-4PM',
    '4PM-5PM',
    '5PM-6PM',
];

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

const currentYear = new Date().getFullYear();
const YEARS = [
    String(currentYear - 1),
    String(currentYear),
    String(currentYear + 1),
];

const examSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().optional(),
    course_id: z.string().min(1, 'Please select a course'),
    module_id: z.string().min(1, 'Please select a module'),
    duration_minutes: z.number().min(5, 'Duration must be at least 5 minutes').max(480, 'Duration cannot exceed 8 hours'),
    passing_marks: z.number().min(0).max(100),
    allow_retakes: z.boolean(),
    max_retakes: z.number().min(0),
    shuffle_questions: z.boolean(),
    shuffle_options: z.boolean(),
    batch_time: z.string().min(1, 'Please select batch time'),
    batch_month: z.string().min(1, 'Please select batch month'),
    batch_year: z.string().min(1, 'Please select batch year'),
    batch_identifier: z.string().optional(),
});

type ExamFormData = z.infer<typeof examSchema>;

function CreateExamDialog({ onExamCreated, courses }: { onExamCreated: () => void; courses: Course[] }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [modules, setModules] = useState<any[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('');

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors },
    } = useForm<ExamFormData>({
        resolver: zodResolver(examSchema),
        defaultValues: {
            duration_minutes: 60,
            passing_marks: 40,
            allow_retakes: false,
            max_retakes: 0,
            shuffle_questions: true,
            shuffle_options: true,
            batch_year: String(currentYear),
        },
    });

    const allowRetakes = watch('allow_retakes');

    useEffect(() => {
        if (selectedCourse) {
            // Fetch modules for selected course
            fetch(`/api/courses/${selectedCourse}/modules`)
                .then(res => res.json())
                .then(data => setModules(data || []))
                .catch(() => setModules([]));
        }
    }, [selectedCourse]);

    const onSubmit = async (data: ExamFormData) => {
        setIsLoading(true);
        try {
            await examsApi.create(data);
            toast.success('Exam created successfully!');
            reset();
            setOpen(false);
            onExamCreated();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to create exam');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Exam
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-blue-400" />
                        Create New Exam
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-slate-300">Exam Title *</Label>
                        <Input
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="e.g., Module 1 Final Exam"
                            {...register('title')}
                        />
                        {errors.title && <p className="text-sm text-red-400">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-300">Description</Label>
                        <Input
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="Brief exam description"
                            {...register('description')}
                        />
                    </div>

                    {/* Course & Module - Stacked on mobile */}
                    <div className="space-y-2">
                        <Label className="text-slate-300">Course *</Label>
                        <Select onValueChange={(value) => {
                            setSelectedCourse(value);
                            setValue('course_id', value);
                        }}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white w-full">
                                <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 max-w-[calc(100vw-3rem)]">
                                {courses.map((course) => (
                                    <SelectItem key={course.id} value={course.id} className="truncate">
                                        {course.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.course_id && <p className="text-sm text-red-400">{errors.course_id.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-300">Module *</Label>
                        <Select onValueChange={(value) => setValue('module_id', value)} disabled={!selectedCourse}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white w-full">
                                <SelectValue placeholder="Select module" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700 max-w-[calc(100vw-3rem)]">
                                {modules.map((module: any) => (
                                    <SelectItem key={module.id} value={module.id} className="truncate">
                                        Module {module.module_number}: {module.module_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.module_id && <p className="text-sm text-red-400">{errors.module_id.message}</p>}
                    </div>

                    {/* Batch Information Section */}
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
                                {errors.batch_time && <p className="text-xs text-red-400">{errors.batch_time.message}</p>}
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
                                {errors.batch_month && <p className="text-xs text-red-400">{errors.batch_month.message}</p>}
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
                                {errors.batch_year && <p className="text-xs text-red-400">{errors.batch_year.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Duration (minutes) *</Label>
                            <Input
                                type="number"
                                className="bg-slate-800/50 border-slate-700 text-white"
                                {...register('duration_minutes', { valueAsNumber: true })}
                            />
                            {errors.duration_minutes && <p className="text-sm text-red-400">{errors.duration_minutes.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-slate-300">Passing Marks (%)</Label>
                            <Input
                                type="number"
                                className="bg-slate-800/50 border-slate-700 text-white"
                                {...register('passing_marks', { valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <Label className="text-slate-300">Shuffle Questions</Label>
                            <Switch
                                defaultChecked={true}
                                onCheckedChange={(checked) => setValue('shuffle_questions', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className="text-slate-300">Shuffle Options</Label>
                            <Switch
                                defaultChecked={true}
                                onCheckedChange={(checked) => setValue('shuffle_options', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className="text-slate-300">Allow Retakes</Label>
                            <Switch
                                onCheckedChange={(checked) => setValue('allow_retakes', checked)}
                            />
                        </div>

                        {allowRetakes && (
                            <div className="space-y-2">
                                <Label className="text-slate-300">Max Retakes (0 = unlimited)</Label>
                                <Input
                                    type="number"
                                    className="bg-slate-800/50 border-slate-700 text-white"
                                    {...register('max_retakes', { valueAsNumber: true })}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
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
                                    Creating...
                                </>
                            ) : (
                                'Create Exam'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function ExamCard({ exam, onDelete }: { exam: Exam; onDelete: () => void }) {
    // Format batch info for display
    const batchInfo = exam.batch_time ? (
        `${exam.batch_time}${exam.batch_identifier ? ` (${exam.batch_identifier})` : ''} • ${MONTHS.find(m => m.value === exam.batch_month)?.label || exam.batch_month} ${exam.batch_year}`
    ) : null;

    return (
        <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg text-white">{exam.title}</CardTitle>
                        {batchInfo && (
                            <p className="text-xs text-blue-400 mt-1 flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {batchInfo}
                            </p>
                        )}
                        {exam.description && <p className="text-sm text-slate-400 mt-1">{exam.description}</p>}
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/exams/${exam.id}/questions`} className="text-slate-300 hover:text-white hover:bg-slate-800">
                                    <FileQuestion className="h-4 w-4 mr-2" /> Manage Questions
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={`/dashboard/exams/${exam.id}/schedule`} className="text-slate-300 hover:text-white hover:bg-slate-800">
                                    <Calendar className="h-4 w-4 mr-2" /> Schedule
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
                                <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onDelete} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-blue-500/10">
                            <FileQuestion className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Questions</p>
                            <p className="text-sm font-medium text-white">{exam.total_questions}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-purple-500/10">
                            <Clock className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Duration</p>
                            <p className="text-sm font-medium text-white">{exam.duration_minutes} min</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-green-500/10">
                            <Award className="h-4 w-4 text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Pass %</p>
                            <p className="text-sm font-medium text-white">{exam.passing_marks}%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={exam.is_active ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-slate-500/10 text-slate-400 border-slate-500/30'}>
                            {exam.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                </div>
                <div className="mt-4 flex gap-2">
                    <Link href={`/dashboard/exams/${exam.id}/questions`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                            <FileQuestion className="h-4 w-4 mr-2" />
                            Questions
                        </Button>
                    </Link>
                    <Link href={`/dashboard/exams/${exam.id}/schedule`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800">
                            <Calendar className="h-4 w-4 mr-2" />
                            Schedule
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

function ManagerExamsView() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [examsRes, coursesRes] = await Promise.all([
                examsApi.list(),
                coursesApi.list()
            ]);
            setExams(examsRes.data || []);
            setCourses(coursesRes.data || []);
        } catch (error) {
            toast.error('Failed to fetch exams');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async (examId: string) => {
        if (!confirm('Are you sure you want to delete this exam?')) return;
        try {
            await examsApi.delete(examId);
            toast.success('Exam deleted');
            fetchData();
        } catch (error) {
            toast.error('Failed to delete exam');
        }
    };

    const filteredExams = exams.filter((exam) =>
        exam.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <ClipboardList className="h-7 w-7 text-blue-400" />
                        Exam Management
                    </h1>
                    <p className="text-slate-400 mt-1">Create and manage exams for courses</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/exams/verify">
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Verify Results
                        </Button>
                    </Link>
                    <CreateExamDialog onExamCreated={fetchData} courses={courses} />
                </div>
            </div>

            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search exams..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                        />
                    </div>
                </CardContent>
            </Card>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                </div>
            ) : filteredExams.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <ClipboardList className="h-12 w-12 text-slate-600 mb-4" />
                        <p className="text-slate-400 text-center">
                            {searchQuery ? 'No exams found matching your search' : 'No exams created yet. Create your first exam!'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {filteredExams.map((exam) => (
                        <ExamCard key={exam.id} exam={exam} onDelete={() => handleDelete(exam.id)} />
                    ))}
                </div>
            )}
        </div>
    );
}

// ============ Student View Components ============

function StudentExamsView() {
    const [exams, setExams] = useState<AvailableExam[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchExams();
    }, []);

    const fetchExams = async () => {
        try {
            setIsLoading(true);
            const response = await studentExamsApi.getAvailable();
            setExams(response.data || []);
        } catch (error) {
            toast.error('Failed to fetch exams');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <ClipboardList className="h-7 w-7 text-blue-400" />
                    My Exams
                </h1>
                <p className="text-slate-400 mt-1">View and take your scheduled exams</p>
            </div>

            <div className="flex gap-2">
                <Link href="/dashboard/exams/results">
                    <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                        <Award className="h-4 w-4 mr-2" />
                        View Results
                    </Button>
                </Link>
            </div>

            {exams.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <ClipboardList className="h-12 w-12 text-slate-600 mb-4" />
                        <p className="text-slate-400 text-center">No exams available at the moment</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exams.map((exam) => (
                        <Card key={exam.exam_id} className="bg-slate-900/50 border-slate-800">
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <CardTitle className="text-lg text-white">{exam.exam_title}</CardTitle>
                                        <p className="text-sm text-slate-400 mt-1">{exam.course_name} - {exam.module_name}</p>
                                    </div>
                                    {exam.is_locked ? (
                                        <Lock className="h-5 w-5 text-red-400" />
                                    ) : (
                                        <CheckCircle className="h-5 w-5 text-green-400" />
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Questions</span>
                                        <span className="text-white">{exam.total_questions}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Duration</span>
                                        <span className="text-white">{exam.duration_minutes} minutes</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-400">Pass Mark</span>
                                        <span className="text-white">{exam.passing_marks}%</span>
                                    </div>
                                    {exam.previous_attempts > 0 && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">Attempts</span>
                                            <span className="text-white">{exam.previous_attempts}</span>
                                        </div>
                                    )}
                                    {exam.best_score !== null && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">Best Score</span>
                                            <span className="text-green-400">{exam.best_score.toFixed(1)}%</span>
                                        </div>
                                    )}
                                </div>

                                {exam.is_locked ? (
                                    <div className="mt-4">
                                        <Badge className="bg-red-500/10 text-red-400 border-red-500/30 w-full justify-center py-2">
                                            <Lock className="h-3 w-3 mr-2" />
                                            {exam.lock_reason}
                                        </Badge>
                                    </div>
                                ) : (
                                    <Link href={`/dashboard/exams/take/${exam.exam_id}`}>
                                        <Button className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                            <Play className="h-4 w-4 mr-2" />
                                            {exam.previous_attempts > 0 && exam.can_retake ? 'Retake Exam' : 'Start Exam'}
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============ Main Component ============

export default function ExamsPage() {
    const { user } = useAuth();
    const isManager = user && MANAGER_ROLES.includes(user.role);

    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );
    }

    return isManager ? <ManagerExamsView /> : <StudentExamsView />;
}
