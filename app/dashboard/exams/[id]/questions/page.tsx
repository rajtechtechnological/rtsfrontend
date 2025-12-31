'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { examsApi } from '@/lib/api/endpoints';
import type { ExamDetail, Question } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    FileQuestion,
    Plus,
    ArrowLeft,
    Edit,
    Trash2,
    Loader2,
    MoreHorizontal,
    CheckCircle,
    Upload,
} from 'lucide-react';
import Link from 'next/link';

const questionSchema = z.object({
    question_text: z.string().min(5, 'Question must be at least 5 characters'),
    option_a: z.string().min(1, 'Option A is required'),
    option_b: z.string().min(1, 'Option B is required'),
    option_c: z.string().min(1, 'Option C is required'),
    option_d: z.string().min(1, 'Option D is required'),
    correct_option: z.enum(['A', 'B', 'C', 'D']),
    marks: z.number().min(1).max(10),
    explanation: z.string().optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

function AddQuestionDialog({ examId, onQuestionAdded }: { examId: string; onQuestionAdded: () => void }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<QuestionFormData>({
        resolver: zodResolver(questionSchema),
        defaultValues: {
            marks: 1,
            correct_option: 'A',
        },
    });

    const onSubmit = async (data: QuestionFormData) => {
        setIsLoading(true);
        try {
            await examsApi.addQuestion(examId, data);
            toast.success('Question added successfully!');
            reset();
            setOpen(false);
            onQuestionAdded();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to add question');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <FileQuestion className="h-5 w-5 text-blue-400" />
                        Add New Question
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-slate-300">Question *</Label>
                        <Textarea
                            className="bg-slate-800/50 border-slate-700 text-white min-h-[100px]"
                            placeholder="Enter the question text..."
                            {...register('question_text')}
                        />
                        {errors.question_text && <p className="text-sm text-red-400">{errors.question_text.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Option A *</Label>
                            <Input
                                className="bg-slate-800/50 border-slate-700 text-white"
                                placeholder="Enter option A"
                                {...register('option_a')}
                            />
                            {errors.option_a && <p className="text-sm text-red-400">{errors.option_a.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Option B *</Label>
                            <Input
                                className="bg-slate-800/50 border-slate-700 text-white"
                                placeholder="Enter option B"
                                {...register('option_b')}
                            />
                            {errors.option_b && <p className="text-sm text-red-400">{errors.option_b.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Option C *</Label>
                            <Input
                                className="bg-slate-800/50 border-slate-700 text-white"
                                placeholder="Enter option C"
                                {...register('option_c')}
                            />
                            {errors.option_c && <p className="text-sm text-red-400">{errors.option_c.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Option D *</Label>
                            <Input
                                className="bg-slate-800/50 border-slate-700 text-white"
                                placeholder="Enter option D"
                                {...register('option_d')}
                            />
                            {errors.option_d && <p className="text-sm text-red-400">{errors.option_d.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-slate-300">Correct Answer *</Label>
                            <Select defaultValue="A" onValueChange={(value) => setValue('correct_option', value as 'A' | 'B' | 'C' | 'D')}>
                                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-700">
                                    <SelectItem value="A">Option A</SelectItem>
                                    <SelectItem value="B">Option B</SelectItem>
                                    <SelectItem value="C">Option C</SelectItem>
                                    <SelectItem value="D">Option D</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-slate-300">Marks</Label>
                            <Input
                                type="number"
                                className="bg-slate-800/50 border-slate-700 text-white"
                                {...register('marks', { valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-slate-300">Explanation (Optional)</Label>
                        <Textarea
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="Explain the correct answer..."
                            {...register('explanation')}
                        />
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
                                    Adding...
                                </>
                            ) : (
                                'Add Question'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function QuestionCard({ question, index, onDelete, onEdit }: {
    question: Question;
    index: number;
    onDelete: () => void;
    onEdit: () => void;
}) {
    return (
        <Card className="bg-slate-900/50 border-slate-800">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-slate-400 border-slate-600">
                            Q{index + 1}
                        </Badge>
                        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                            {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                        </Badge>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                            <DropdownMenuItem onClick={onEdit} className="text-slate-300 hover:text-white hover:bg-slate-800">
                                <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onDelete} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <p className="text-white mb-4">{question.question_text}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                        const optKey = `option_${opt.toLowerCase()}` as keyof Question;
                        const isCorrect = question.correct_option === opt;

                        return (
                            <div
                                key={opt}
                                className={`p-2 rounded text-sm flex items-center gap-2 ${
                                    isCorrect
                                        ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                                        : 'bg-slate-800/50 text-slate-300'
                                }`}
                            >
                                <span className="font-medium">{opt}.</span>
                                <span className="flex-1">{question[optKey] as string}</span>
                                {isCorrect && <CheckCircle className="h-4 w-4" />}
                            </div>
                        );
                    })}
                </div>

                {question.explanation && (
                    <div className="mt-3 p-2 bg-blue-500/10 rounded border border-blue-500/20">
                        <p className="text-xs text-blue-400">
                            <strong>Explanation:</strong> {question.explanation}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

export default function ExamQuestionsPage() {
    const params = useParams();
    const router = useRouter();
    const examId = params.id as string;

    const [exam, setExam] = useState<ExamDetail | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchExam();
    }, [examId]);

    const fetchExam = async () => {
        try {
            setIsLoading(true);
            const response = await examsApi.get(examId);
            setExam(response.data);
        } catch (error) {
            toast.error('Failed to fetch exam');
            router.push('/dashboard/exams');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteQuestion = async (questionId: string) => {
        if (!confirm('Are you sure you want to delete this question?')) return;
        try {
            await examsApi.deleteQuestion(questionId);
            toast.success('Question deleted');
            fetchExam();
        } catch (error) {
            toast.error('Failed to delete question');
        }
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

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/exams">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold text-white">{exam.title}</h1>
                    <p className="text-slate-400 mt-1">
                        {exam.course_name} - {exam.module_name} • {exam.questions.length} questions
                    </p>
                </div>
                <AddQuestionDialog examId={examId} onQuestionAdded={fetchExam} />
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-white">{exam.questions.length}</p>
                        <p className="text-xs text-slate-400">Questions</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-white">
                            {exam.questions.reduce((sum, q) => sum + q.marks, 0)}
                        </p>
                        <p className="text-xs text-slate-400">Total Marks</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-white">{exam.duration_minutes} min</p>
                        <p className="text-xs text-slate-400">Duration</p>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-white">{exam.passing_marks}%</p>
                        <p className="text-xs text-slate-400">Pass Mark</p>
                    </CardContent>
                </Card>
            </div>

            {/* Questions List */}
            {exam.questions.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileQuestion className="h-12 w-12 text-slate-600 mb-4" />
                        <p className="text-slate-400 text-center">No questions added yet</p>
                        <p className="text-sm text-slate-500 mt-2">Click "Add Question" to get started</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {exam.questions.map((question, index) => (
                        <QuestionCard
                            key={question.id}
                            question={question}
                            index={index}
                            onDelete={() => handleDeleteQuestion(question.id)}
                            onEdit={() => toast.info('Edit functionality coming soon')}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
