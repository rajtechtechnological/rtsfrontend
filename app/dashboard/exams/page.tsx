'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/auth-context';
import { examsApi, coursesApi, studentExamsApi } from '@/lib/api/endpoints';
import type { Exam, Course, AvailableExam } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { LedgerTable, type LedgerColumn } from '@/components/ui/ledger-table';
import { Stamp } from '@/components/ui/stamp';
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
import { Loader2, MoreHorizontal } from 'lucide-react';
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

const fieldLabelClass = 'text-xs uppercase tracking-wide text-ink-muted';

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
                <Button>Create Exam</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-serif text-ink">Create New Exam</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label className={fieldLabelClass}>Exam Title (required)</Label>
                        <Input
                            placeholder="e.g., Module 1 Final Exam"
                            {...register('title')}
                        />
                        {errors.title && <p className="text-sm text-danger">{errors.title.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className={fieldLabelClass}>Description</Label>
                        <Input
                            placeholder="Brief exam description"
                            {...register('description')}
                        />
                    </div>

                    {/* Course & Module - Stacked on mobile */}
                    <div className="space-y-2">
                        <Label className={fieldLabelClass}>Course (required)</Label>
                        <Select onValueChange={(value) => {
                            setSelectedCourse(value);
                            setValue('course_id', value);
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select course" />
                            </SelectTrigger>
                            <SelectContent className="max-w-[calc(100vw-3rem)]">
                                {courses.map((course) => (
                                    <SelectItem key={course.id} value={course.id} className="truncate">
                                        {course.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.course_id && <p className="text-sm text-danger">{errors.course_id.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className={fieldLabelClass}>Module (required)</Label>
                        <Select onValueChange={(value) => setValue('module_id', value)} disabled={!selectedCourse}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select module" />
                            </SelectTrigger>
                            <SelectContent className="max-w-[calc(100vw-3rem)]">
                                {modules.map((module: any) => (
                                    <SelectItem key={module.id} value={module.id} className="truncate">
                                        Module {module.module_number}: {module.module_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.module_id && <p className="text-sm text-danger">{errors.module_id.message}</p>}
                    </div>

                    {/* Batch Information Section */}
                    <div className="rounded-md border border-line p-4 space-y-4">
                        <h3 className={fieldLabelClass}>Target Batch</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label className={fieldLabelClass}>Batch Time (required)</Label>
                                <Select onValueChange={(value) => setValue('batch_time', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {BATCH_TIME_SLOTS.map((slot) => (
                                            <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.batch_time && <p className="text-xs text-danger">{errors.batch_time.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className={fieldLabelClass}>Batch (A/B)</Label>
                                <Select onValueChange={(value) => setValue('batch_identifier', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="All" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="A">Batch A</SelectItem>
                                        <SelectItem value="B">Batch B</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className={fieldLabelClass}>Month (required)</Label>
                                <Select onValueChange={(value) => setValue('batch_month', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Month" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MONTHS.map((month) => (
                                            <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.batch_month && <p className="text-xs text-danger">{errors.batch_month.message}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className={fieldLabelClass}>Year (required)</Label>
                                <Select defaultValue={String(currentYear)} onValueChange={(value) => setValue('batch_year', value)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {YEARS.map((year) => (
                                            <SelectItem key={year} value={year}>{year}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.batch_year && <p className="text-xs text-danger">{errors.batch_year.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className={fieldLabelClass}>Duration in Minutes (required)</Label>
                            <Input
                                type="number"
                                {...register('duration_minutes', { valueAsNumber: true })}
                            />
                            {errors.duration_minutes && <p className="text-sm text-danger">{errors.duration_minutes.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className={fieldLabelClass}>Passing Marks (%)</Label>
                            <Input
                                type="number"
                                {...register('passing_marks', { valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center justify-between">
                            <Label className={fieldLabelClass}>Shuffle Questions</Label>
                            <Switch
                                defaultChecked={true}
                                onCheckedChange={(checked) => setValue('shuffle_questions', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className={fieldLabelClass}>Shuffle Options</Label>
                            <Switch
                                defaultChecked={true}
                                onCheckedChange={(checked) => setValue('shuffle_options', checked)}
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <Label className={fieldLabelClass}>Allow Retakes</Label>
                            <Switch
                                onCheckedChange={(checked) => setValue('allow_retakes', checked)}
                            />
                        </div>

                        {allowRetakes && (
                            <div className="space-y-2">
                                <Label className={fieldLabelClass}>Max Retakes (0 = unlimited)</Label>
                                <Input
                                    type="number"
                                    {...register('max_retakes', { valueAsNumber: true })}
                                />
                            </div>
                        )}
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

function batchLabel(exam: Exam): string | null {
    if (!exam.batch_time) return null;
    const month = MONTHS.find(m => m.value === exam.batch_month)?.label || exam.batch_month;
    return `${exam.batch_time}${exam.batch_identifier ? ` (${exam.batch_identifier})` : ''} · ${month} ${exam.batch_year}`;
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

    const columns: LedgerColumn<Exam>[] = [
        {
            key: 'title',
            header: 'Exam',
            cell: (exam) => (
                <Link
                    href={`/dashboard/exams/${exam.id}/questions`}
                    className="font-medium text-ink hover:underline"
                >
                    {exam.title}
                </Link>
            ),
        },
        {
            key: 'batch',
            header: 'Batch',
            cell: (exam) => batchLabel(exam) ?? <span className="text-ink-muted">—</span>,
        },
        {
            key: 'questions',
            header: 'Questions',
            numeric: true,
            cell: (exam) => exam.total_questions,
        },
        {
            key: 'duration',
            header: 'Duration',
            numeric: true,
            cell: (exam) => `${exam.duration_minutes} min`,
        },
        {
            key: 'passing',
            header: 'Pass Mark',
            numeric: true,
            cell: (exam) => `${exam.passing_marks}%`,
        },
        {
            key: 'status',
            header: 'Status',
            cell: (exam) => <Stamp status={exam.is_active ? 'Active' : 'Inactive'} />,
        },
        {
            key: 'actions',
            header: '',
            align: 'right',
            headerClassName: 'w-12',
            cell: (exam) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="text-ink-muted hover:text-ink">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/exams/${exam.id}/questions`}>Manage Questions</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href={`/dashboard/exams/${exam.id}/schedule`}>Schedule</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>Edit</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" onClick={() => handleDelete(exam.id)}>
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-serif text-2xl font-semibold text-ink">Examinations</h1>
                    <p className="text-sm text-ink-muted mt-1">Create and manage exams for courses</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/dashboard/exams/verify">
                        <Button variant="outline">Verify Results</Button>
                    </Link>
                    <CreateExamDialog onExamCreated={fetchData} courses={courses} />
                </div>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3">
                <Input
                    placeholder="Search exams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-full sm:w-64"
                />
            </div>

            <section className="rounded-md border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <h2 className="font-serif text-lg text-ink">Exam Register</h2>
                    <span className="font-mono text-xs tabular-nums text-ink-muted">
                        {filteredExams.length} records
                    </span>
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
                    </div>
                ) : (
                    <LedgerTable
                        columns={columns}
                        rows={filteredExams}
                        rowKey={(exam) => exam.id}
                        emptyMessage={
                            searchQuery
                                ? 'No exams match your search.'
                                : 'No exams have been created yet.'
                        }
                    />
                )}
            </section>
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

    const columns: LedgerColumn<AvailableExam>[] = [
        {
            key: 'title',
            header: 'Exam',
            cell: (exam) => <span className="font-medium">{exam.exam_title}</span>,
        },
        {
            key: 'course',
            header: 'Course / Module',
            cell: (exam) => (
                <span className="text-ink-muted">
                    {exam.course_name} — {exam.module_name}
                </span>
            ),
        },
        {
            key: 'questions',
            header: 'Questions',
            numeric: true,
            cell: (exam) => exam.total_questions,
        },
        {
            key: 'duration',
            header: 'Duration',
            numeric: true,
            cell: (exam) => `${exam.duration_minutes} min`,
        },
        {
            key: 'passing',
            header: 'Pass Mark',
            numeric: true,
            cell: (exam) => `${exam.passing_marks}%`,
        },
        {
            key: 'best',
            header: 'Best Score',
            numeric: true,
            cell: (exam) =>
                exam.best_score !== null ? `${exam.best_score.toFixed(1)}%` : '—',
        },
        {
            key: 'status',
            header: 'Status',
            align: 'right',
            cell: (exam) =>
                exam.is_locked ? (
                    <span className="inline-flex items-center gap-2">
                        {exam.lock_reason && (
                            <span className="text-xs text-ink-muted normal-case">{exam.lock_reason}</span>
                        )}
                        <Stamp status="Locked" bordered />
                    </span>
                ) : (
                    <Link href={`/dashboard/exams/take/${exam.exam_id}`}>
                        <Button size="sm" variant="outline">
                            {exam.previous_attempts > 0 && exam.can_retake ? 'Retake Exam' : 'Start Exam'}
                        </Button>
                    </Link>
                ),
        },
    ];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-serif text-2xl font-semibold text-ink">My Exams</h1>
                    <p className="text-sm text-ink-muted mt-1">View and take your scheduled exams</p>
                </div>
                <Link href="/dashboard/exams/results">
                    <Button variant="outline">View Results</Button>
                </Link>
            </div>

            <section className="rounded-md border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <h2 className="font-serif text-lg text-ink">Scheduled Exams</h2>
                    <span className="font-mono text-xs tabular-nums text-ink-muted">
                        {exams.length} records
                    </span>
                </div>
                <LedgerTable
                    columns={columns}
                    rows={exams}
                    rowKey={(exam) => exam.exam_id}
                    emptyMessage="No exams are available at the moment."
                />
            </section>
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
                <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
            </div>
        );
    }

    return isManager ? <ManagerExamsView /> : <StudentExamsView />;
}
