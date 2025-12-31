'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { examsApi } from '@/lib/api/endpoints';
import type { ExamDetail, ExamSchedule } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
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
    Calendar,
    Plus,
    ArrowLeft,
    Clock,
    Users,
    Trash2,
    Loader2,
    CalendarDays,
} from 'lucide-react';
import Link from 'next/link';

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

const scheduleSchema = z.object({
    batch_time: z.string().min(1, 'Batch time is required'),
    batch_identifier: z.string().optional(),
    scheduled_date: z.string().min(1, 'Date is required'),
    start_time: z.string().min(1, 'Start time is required'),
    end_time: z.string().min(1, 'End time is required'),
});

type ScheduleFormData = z.infer<typeof scheduleSchema>;

function AddScheduleDialog({ examId, onScheduleAdded }: { examId: string; onScheduleAdded: () => void }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<ScheduleFormData>({
        resolver: zodResolver(scheduleSchema),
        defaultValues: {
            start_time: '09:00',
            end_time: '10:00',
        },
    });

    const onSubmit = async (data: ScheduleFormData) => {
        setIsLoading(true);
        try {
            await examsApi.createSchedule({
                exam_id: examId,
                batch_time: data.batch_time,
                batch_identifier: data.batch_identifier || undefined,
                scheduled_date: data.scheduled_date,
                start_time: data.start_time,
                end_time: data.end_time,
            });
            toast.success('Exam scheduled successfully!');
            reset();
            setOpen(false);
            onScheduleAdded();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to schedule exam');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Schedule Exam
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-blue-400" />
                        Schedule Exam
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-slate-300">Batch Time *</Label>
                        <Select onValueChange={(value) => setValue('batch_time', value)}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                <SelectValue placeholder="Select batch time" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                {BATCH_TIME_SLOTS.map((slot) => (
                                    <SelectItem key={slot} value={slot}>
                                        {slot}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.batch_time && <p className="text-sm text-red-400">{errors.batch_time.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-300">Batch Identifier (Optional)</Label>
                        <Select onValueChange={(value) => setValue('batch_identifier', value)}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                <SelectValue placeholder="All batches" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                <SelectItem value="A">Batch A</SelectItem>
                                <SelectItem value="B">Batch B</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-300">Scheduled Date *</Label>
                        <Input
                            type="date"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            min={new Date().toISOString().split('T')[0]}
                            {...register('scheduled_date')}
                        />
                        {errors.scheduled_date && <p className="text-sm text-red-400">{errors.scheduled_date.message}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Start Time *</Label>
                            <Input
                                type="time"
                                className="bg-slate-800/50 border-slate-700 text-white"
                                {...register('start_time')}
                            />
                            {errors.start_time && <p className="text-sm text-red-400">{errors.start_time.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">End Time *</Label>
                            <Input
                                type="time"
                                className="bg-slate-800/50 border-slate-700 text-white"
                                {...register('end_time')}
                            />
                            {errors.end_time && <p className="text-sm text-red-400">{errors.end_time.message}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="border-slate-700 text-slate-300"
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
                                    Scheduling...
                                </>
                            ) : (
                                'Schedule'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function ExamSchedulePage() {
    const params = useParams();
    const router = useRouter();
    const examId = params.id as string;

    const [exam, setExam] = useState<ExamDetail | null>(null);
    const [schedules, setSchedules] = useState<ExamSchedule[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, [examId]);

    const fetchData = async () => {
        try {
            setIsLoading(true);
            const [examRes, schedulesRes] = await Promise.all([
                examsApi.get(examId),
                examsApi.listSchedules({ exam_id: examId })
            ]);
            setExam(examRes.data);
            setSchedules(schedulesRes.data || []);
        } catch (error) {
            toast.error('Failed to fetch data');
            router.push('/dashboard/exams');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelSchedule = async (scheduleId: string) => {
        if (!confirm('Are you sure you want to cancel this schedule?')) return;
        try {
            await examsApi.cancelSchedule(scheduleId);
            toast.success('Schedule cancelled');
            fetchData();
        } catch (error) {
            toast.error('Failed to cancel schedule');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (timeString: string) => {
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );
    }

    if (!exam) {
        return null;
    }

    // Group schedules by date
    const schedulesByDate = schedules.reduce((acc, schedule) => {
        const date = schedule.scheduled_date;
        if (!acc[date]) acc[date] = [];
        acc[date].push(schedule);
        return acc;
    }, {} as Record<string, ExamSchedule[]>);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/exams">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">Schedule: {exam.title}</h1>
                    <p className="text-slate-400 mt-1">
                        {exam.course_name} - {exam.module_name}
                    </p>
                </div>
                <AddScheduleDialog examId={examId} onScheduleAdded={fetchData} />
            </div>

            {/* Exam Info */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-300">{exam.duration_minutes} minutes</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-slate-400" />
                            <span className="text-slate-300">{exam.total_questions} questions</span>
                        </div>
                        <Badge className={exam.is_active ? 'bg-green-500/10 text-green-400' : 'bg-slate-500/10 text-slate-400'}>
                            {exam.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Schedules */}
            {schedules.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <CalendarDays className="h-12 w-12 text-slate-600 mb-4" />
                        <p className="text-slate-400 text-center">No schedules created yet</p>
                        <p className="text-sm text-slate-500 mt-2">Click "Schedule Exam" to add a schedule for a batch</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {Object.entries(schedulesByDate)
                        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
                        .map(([date, dateSchedules]) => (
                            <div key={date}>
                                <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-blue-400" />
                                    {formatDate(date)}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {dateSchedules.map((schedule) => (
                                        <Card key={schedule.id} className="bg-slate-900/50 border-slate-800">
                                            <CardContent className="p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                                                        {schedule.batch_time}
                                                    </Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                        onClick={() => handleCancelSchedule(schedule.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="space-y-2 text-sm">
                                                    {schedule.batch_identifier && (
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-slate-400">Batch</span>
                                                            <span className="text-white font-medium">
                                                                {schedule.batch_identifier}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-slate-400">Time Window</span>
                                                        <span className="text-white">
                                                            {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}
