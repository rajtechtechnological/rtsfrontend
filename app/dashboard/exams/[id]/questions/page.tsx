'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { examsApi } from '@/lib/api/endpoints';
import type { CreateQuestionRequest, DocxImportPreview, ExamDetail, Question } from '@/types';
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
                <Button className="bg-primary text-primary-foreground">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-surface border-line sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-ink flex items-center gap-2">
                        <FileQuestion className="h-5 w-5 text-primary" />
                        Add New Question
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-ink">Question *</Label>
                        <Textarea
                            className="bg-muted border-line text-ink min-h-[100px]"
                            placeholder="Enter the question text..."
                            {...register('question_text')}
                        />
                        {errors.question_text && <p className="text-sm text-danger">{errors.question_text.message}</p>}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-ink">Option A *</Label>
                            <Input
                                className="bg-muted border-line text-ink"
                                placeholder="Enter option A"
                                {...register('option_a')}
                            />
                            {errors.option_a && <p className="text-sm text-danger">{errors.option_a.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-ink">Option B *</Label>
                            <Input
                                className="bg-muted border-line text-ink"
                                placeholder="Enter option B"
                                {...register('option_b')}
                            />
                            {errors.option_b && <p className="text-sm text-danger">{errors.option_b.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-ink">Option C *</Label>
                            <Input
                                className="bg-muted border-line text-ink"
                                placeholder="Enter option C"
                                {...register('option_c')}
                            />
                            {errors.option_c && <p className="text-sm text-danger">{errors.option_c.message}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label className="text-ink">Option D *</Label>
                            <Input
                                className="bg-muted border-line text-ink"
                                placeholder="Enter option D"
                                {...register('option_d')}
                            />
                            {errors.option_d && <p className="text-sm text-danger">{errors.option_d.message}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-ink">Correct Answer *</Label>
                            <Select defaultValue="A" onValueChange={(value) => setValue('correct_option', value as 'A' | 'B' | 'C' | 'D')}>
                                <SelectTrigger className="bg-muted border-line text-ink">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-surface border-line">
                                    <SelectItem value="A">Option A</SelectItem>
                                    <SelectItem value="B">Option B</SelectItem>
                                    <SelectItem value="C">Option C</SelectItem>
                                    <SelectItem value="D">Option D</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label className="text-ink">Marks</Label>
                            <Input
                                type="number"
                                className="bg-muted border-line text-ink"
                                {...register('marks', { valueAsNumber: true })}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-ink">Explanation (Optional)</Label>
                        <Textarea
                            className="bg-muted border-line text-ink"
                            placeholder="Explain the correct answer..."
                            {...register('explanation')}
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="border-line text-ink"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-primary text-primary-foreground"
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

const FORMAT_EXAMPLE = `1. What does CPU stand for?
A) Central Processing Unit
B) Computer Personal Unit
C) Central Process Utility
D) Control Processing Unit
Answer: A
Marks: 2
Explanation: CPU is the main processor.

2. Which of these is an input device?
A) Monitor
B) Keyboard
C) Printer
D) Speaker
Answer: B`;

function ImportWordDialog({ examId, onImported }: { examId: string; onImported: () => void }) {
    const [open, setOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<DocxImportPreview | null>(null);
    const [isParsing, setIsParsing] = useState(false);
    const [isImporting, setIsImporting] = useState(false);

    const resetState = () => {
        setFile(null);
        setPreview(null);
        setIsParsing(false);
        setIsImporting(false);
    };

    const handleParse = async (selected: File) => {
        setFile(selected);
        setIsParsing(true);
        setPreview(null);
        try {
            const response = await examsApi.importDocx(examId, selected);
            setPreview(response.data);
            if (response.data.questions.length === 0) {
                toast.error('No importable questions found in this document');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to read the document');
            setFile(null);
        } finally {
            setIsParsing(false);
        }
    };

    const handleImport = async () => {
        if (!preview || preview.questions.length === 0) return;
        setIsImporting(true);
        try {
            await examsApi.addQuestionsBulk(examId, preview.questions as CreateQuestionRequest[]);
            toast.success(`${preview.questions.length} questions imported`);
            setOpen(false);
            resetState();
            onImported();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to import questions');
        } finally {
            setIsImporting(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next);
                if (!next) resetState();
            }}
        >
            <DialogTrigger asChild>
                <Button variant="outline" className="border-line text-ink">
                    <Upload className="h-4 w-4 mr-2" />
                    Import from Word
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-surface border-line sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-ink flex items-center gap-2">
                        <Upload className="h-5 w-5 text-primary" />
                        Import Questions from Word
                    </DialogTitle>
                </DialogHeader>

                {/* Step 1: choose a .docx (with the expected format shown) */}
                {!preview && (
                    <div className="space-y-4">
                        <p className="text-sm text-ink-muted">
                            Upload a .docx file with numbered questions, options A–D, and an answer
                            line for each. Nothing is imported until you review the preview.
                        </p>
                        <a
                            href="/templates/exam-questions-template.docx"
                            download
                            className="inline-flex items-center gap-2 rounded-md border border-line bg-muted px-3 py-2 text-sm font-medium text-primary hover:border-primary/40"
                        >
                            <FileQuestion className="h-4 w-4" />
                            Download the Word template
                        </a>
                        <pre className="rounded-md border border-line bg-muted p-3 text-xs text-ink overflow-x-auto whitespace-pre">
                            {FORMAT_EXAMPLE}
                        </pre>
                        <div className="space-y-2">
                            <Label className="text-ink">Word document (.docx)</Label>
                            <Input
                                type="file"
                                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                disabled={isParsing}
                                className="bg-muted border-line text-ink"
                                onChange={(e) => {
                                    const selected = e.target.files?.[0];
                                    if (selected) handleParse(selected);
                                }}
                            />
                        </div>
                        {isParsing && (
                            <p className="flex items-center gap-2 text-sm text-ink-muted">
                                <Loader2 className="h-4 w-4 animate-spin" /> Reading {file?.name}…
                            </p>
                        )}
                    </div>
                )}

                {/* Step 2: preview + confirm */}
                {preview && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-ink">
                                <span className="font-semibold">{preview.questions.length}</span>{' '}
                                question{preview.questions.length === 1 ? '' : 's'} ready to import
                                from <span className="font-medium">{file?.name}</span>
                            </p>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-ink-muted"
                                onClick={resetState}
                            >
                                Choose another file
                            </Button>
                        </div>

                        {preview.errors.length > 0 && (
                            <div className="rounded-md border border-danger/40 bg-danger/5 p-3">
                                <p className="text-sm font-medium text-danger mb-1">
                                    Skipped ({preview.errors.length}) — fix these in the document and re-upload to include them:
                                </p>
                                <ul className="list-disc pl-5 text-xs text-danger space-y-0.5">
                                    {preview.errors.map((err, i) => (
                                        <li key={i}>{err}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="max-h-[40vh] space-y-2 overflow-y-auto rounded-md border border-line p-3">
                            {preview.questions.map((q, i) => (
                                <div key={i} className="rounded border border-line bg-muted p-3">
                                    <p className="text-sm text-ink font-medium">
                                        {i + 1}. {q.question_text}
                                        <span className="ml-2 text-xs font-normal text-ink-muted">
                                            ({q.marks ?? 1} {(q.marks ?? 1) === 1 ? 'mark' : 'marks'})
                                        </span>
                                    </p>
                                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs">
                                        {(['A', 'B', 'C', 'D'] as const).map((opt) => (
                                            <span
                                                key={opt}
                                                className={
                                                    q.correct_option === opt
                                                        ? 'text-primary font-medium flex items-center gap-1'
                                                        : 'text-ink-muted'
                                                }
                                            >
                                                {opt}. {q[`option_${opt.toLowerCase()}` as 'option_a']}
                                                {q.correct_option === opt && <CheckCircle className="h-3 w-3" />}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-end gap-3">
                            <Button
                                variant="outline"
                                className="border-line text-ink"
                                onClick={() => {
                                    setOpen(false);
                                    resetState();
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={isImporting || preview.questions.length === 0}
                                className="bg-primary text-primary-foreground"
                                onClick={handleImport}
                            >
                                {isImporting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Importing…
                                    </>
                                ) : (
                                    `Import ${preview.questions.length} question${preview.questions.length === 1 ? '' : 's'}`
                                )}
                            </Button>
                        </div>
                    </div>
                )}
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
        <Card className="bg-surface border-line">
            <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-ink-muted border-line">
                            Q{index + 1}
                        </Badge>
                        <Badge className="bg-accent-soft text-primary border-line">
                            {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                        </Badge>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-ink-muted">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-surface border-line">
                            <DropdownMenuItem onClick={onEdit} className="text-ink hover:text-ink hover:bg-muted">
                                <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onDelete} className="text-danger hover:text-danger hover:bg-danger/10">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <p className="text-ink mb-4">{question.question_text}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {(['A', 'B', 'C', 'D'] as const).map((opt) => {
                        const optKey = `option_${opt.toLowerCase()}` as keyof Question;
                        const isCorrect = question.correct_option === opt;

                        return (
                            <div
                                key={opt}
                                className={`p-2 rounded text-sm flex items-center gap-2 ${
                                    isCorrect
                                        ? 'bg-accent-soft border border-line text-primary'
                                        : 'bg-muted text-ink'
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
                    <div className="mt-3 p-2 bg-accent-soft rounded border border-line">
                        <p className="text-xs text-primary">
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
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
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
                    <h1 className="text-2xl font-bold text-ink">{exam.title}</h1>
                    <p className="text-ink-muted mt-1">
                        {exam.course_name} - {exam.module_name} • {exam.questions.length} questions
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <ImportWordDialog examId={examId} onImported={fetchExam} />
                    <AddQuestionDialog examId={examId} onQuestionAdded={fetchExam} />
                </div>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-surface border-line">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-ink">{exam.questions.length}</p>
                        <p className="text-xs text-ink-muted">Questions</p>
                    </CardContent>
                </Card>
                <Card className="bg-surface border-line">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-ink">
                            {exam.questions.reduce((sum, q) => sum + q.marks, 0)}
                        </p>
                        <p className="text-xs text-ink-muted">Total Marks</p>
                    </CardContent>
                </Card>
                <Card className="bg-surface border-line">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-ink">{exam.duration_minutes} min</p>
                        <p className="text-xs text-ink-muted">Duration</p>
                    </CardContent>
                </Card>
                <Card className="bg-surface border-line">
                    <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-ink">{exam.passing_marks}%</p>
                        <p className="text-xs text-ink-muted">Pass Mark</p>
                    </CardContent>
                </Card>
            </div>

            {/* Questions List */}
            {exam.questions.length === 0 ? (
                <Card className="bg-surface border-line">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <FileQuestion className="h-12 w-12 text-ink-muted mb-4" />
                        <p className="text-ink-muted text-center">No questions added yet</p>
                        <p className="text-sm text-ink-muted mt-2">Click "Add Question" to get started</p>
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
