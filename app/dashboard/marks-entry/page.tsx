'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { coursesApi } from '@/lib/api/endpoints';
import apiClient from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
    BookOpen,
    Award,
    Search,
    Loader2,
    CheckCircle,
    XCircle,
    Save,
} from 'lucide-react';

interface Course {
    id: string;
    name: string;
    duration_months: number;
}

interface Module {
    id: string;
    module_number: number;
    module_name: string;
    lesson_count: number;
    total_marks: number;
    passing_marks: number;
}

interface ModuleProgress {
    id: string;
    student_id: string;
    module_id: string;
    status: string;
    marks_obtained: number | null;
    passed: boolean | null;
    exam_date: string | null;
    notes: string | null;
    student: {
        id: string;
        student_id: string;
        user: {
            full_name: string;
            email: string;
        };
    };
}

const marksEntrySchema = z.object({
    marks: z.number().min(0, 'Marks must be at least 0'),
    notes: z.string().optional(),
});

type MarksEntryForm = z.infer<typeof marksEntrySchema>;

export default function MarksEntryPage() {
    const [courses, setCourses] = useState<Course[]>([]);
    const [modules, setModules] = useState<Module[]>([]);
    const [studentProgress, setStudentProgress] = useState<ModuleProgress[]>([]);
    const [selectedCourse, setSelectedCourse] = useState<string>('');
    const [selectedModule, setSelectedModule] = useState<string>('');
    const [selectedModuleData, setSelectedModuleData] = useState<Module | null>(null);
    const [isLoadingCourses, setIsLoadingCourses] = useState(true);
    const [isLoadingModules, setIsLoadingModules] = useState(false);
    const [isLoadingProgress, setIsLoadingProgress] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [savingMarks, setSavingMarks] = useState<string | null>(null);

    // Marks entry for each student
    const [marksData, setMarksData] = useState<Record<string, { marks: number; notes: string }>>({});

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchModules(selectedCourse);
        }
    }, [selectedCourse]);

    useEffect(() => {
        if (selectedModule) {
            fetchStudentProgress(selectedModule);
        }
    }, [selectedModule]);

    const fetchCourses = async () => {
        try {
            setIsLoadingCourses(true);
            const response = await coursesApi.list();
            setCourses(response.data || []);
        } catch (error) {
            console.error('Failed to fetch courses:', error);
            toast.error('Failed to load courses');
        } finally {
            setIsLoadingCourses(false);
        }
    };

    const fetchModules = async (courseId: string) => {
        try {
            setIsLoadingModules(true);
            setSelectedModule('');
            setStudentProgress([]);

            const response = await apiClient.get(`/api/courses/${courseId}/modules`);
            setModules(response.data);
        } catch (error) {
            console.error('Failed to fetch modules:', error);
            toast.error('Failed to load modules');
        } finally {
            setIsLoadingModules(false);
        }
    };

    const fetchStudentProgress = async (moduleId: string) => {
        try {
            setIsLoadingProgress(true);

            const module = modules.find(m => m.id === moduleId);
            setSelectedModuleData(module || null);

            const response = await apiClient.get(`/api/modules/${moduleId}/progress`);
            setStudentProgress(response.data);

            // Initialize marks data with existing marks
            const initialMarks: Record<string, { marks: number; notes: string }> = {};
            response.data.forEach((progress: ModuleProgress) => {
                if (progress.marks_obtained !== null) {
                    initialMarks[progress.student_id] = {
                        marks: progress.marks_obtained,
                        notes: progress.notes || '',
                    };
                }
            });
            setMarksData(initialMarks);
        } catch (error) {
            console.error('Failed to fetch student progress:', error);
            toast.error('Failed to load student progress');
        } finally {
            setIsLoadingProgress(false);
        }
    };

    const handleMarksChange = (studentId: string, marks: string) => {
        const numMarks = parseFloat(marks);
        if (!isNaN(numMarks) && numMarks >= 0) {
            setMarksData(prev => ({
                ...prev,
                [studentId]: {
                    ...prev[studentId],
                    marks: numMarks,
                },
            }));
        }
    };

    const handleNotesChange = (studentId: string, notes: string) => {
        setMarksData(prev => ({
            ...prev,
            [studentId]: {
                ...prev[studentId],
                notes,
            },
        }));
    };

    const handleSaveMarks = async (studentId: string, moduleId: string) => {
        const data = marksData[studentId];

        if (!data || data.marks === undefined) {
            toast.error('Please enter marks first');
            return;
        }

        if (!selectedModuleData) {
            toast.error('Module data not found');
            return;
        }

        if (data.marks < 0 || data.marks > selectedModuleData.total_marks) {
            toast.error(`Marks must be between 0 and ${selectedModuleData.total_marks}`);
            return;
        }

        try {
            setSavingMarks(studentId);

            await apiClient.post('/api/progress/enter-marks', {
                student_id: studentId,
                module_id: moduleId,
                marks_obtained: data.marks,
                notes: data.notes || null,
                exam_date: new Date().toISOString(),
            });

            toast.success('Marks saved successfully!');

            // Refresh progress data
            await fetchStudentProgress(moduleId);
        } catch (error: any) {
            console.error('Failed to save marks:', error);
            toast.error(error.response?.data?.detail || 'Failed to save marks');
        } finally {
            setSavingMarks(null);
        }
    };

    const filteredProgress = studentProgress.filter(progress =>
        progress.student.user.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        progress.student.student_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (progress: ModuleProgress) => {
        if (progress.marks_obtained === null) {
            return (
                <Badge className="bg-muted text-ink-muted border-line border">
                    Not Attempted
                </Badge>
            );
        }

        if (progress.passed) {
            return (
                <Badge className="bg-accent-soft text-primary border-line border flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Passed
                </Badge>
            );
        }

        return (
            <Badge className="bg-danger/10 text-danger border-line border flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Failed
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-ink flex items-center gap-2">
                    <Award className="h-8 w-8 text-yellow-500" />
                    Marks Entry
                </h1>
                <p className="text-ink-muted mt-1">Enter exam marks for students by module</p>
            </div>

            {/* Course and Module Selection */}
            <Card className="bg-surface border-line">
                <CardHeader>
                    <CardTitle className="text-ink">Select Course & Module</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Course Selection */}
                        <div className="space-y-2">
                            <Label className="text-ink">Course</Label>
                            <Select
                                value={selectedCourse}
                                onValueChange={setSelectedCourse}
                                disabled={isLoadingCourses}
                            >
                                <SelectTrigger className="bg-muted border-line text-ink">
                                    <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent className="bg-surface border-line">
                                    {courses.map((course) => (
                                        <SelectItem key={course.id} value={course.id} className="text-ink hover:bg-muted">
                                            {course.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Module Selection */}
                        <div className="space-y-2">
                            <Label className="text-ink">Module</Label>
                            <Select
                                value={selectedModule}
                                onValueChange={setSelectedModule}
                                disabled={!selectedCourse || isLoadingModules}
                            >
                                <SelectTrigger className="bg-muted border-line text-ink">
                                    <SelectValue placeholder="Select a module" />
                                </SelectTrigger>
                                <SelectContent className="bg-surface border-line">
                                    {modules.map((module) => (
                                        <SelectItem key={module.id} value={module.id} className="text-ink hover:bg-muted">
                                            Module {module.module_number}: {module.module_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {selectedModuleData && (
                        <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-ink-muted">Selected Module</p>
                                <p className="text-ink font-semibold">{selectedModuleData.module_name}</p>
                                <p className="text-sm text-ink-muted">
                                    {selectedModuleData.lesson_count} lessons • Total Marks: {selectedModuleData.total_marks} • Passing: {selectedModuleData.passing_marks}
                                </p>
                            </div>
                            <Badge className="bg-accent-soft text-primary border-line border">
                                {studentProgress.length} students enrolled
                            </Badge>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Student List & Marks Entry */}
            {selectedModule && (
                <Card className="bg-surface border-line">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-ink">Student Marks</CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                                <Input
                                    placeholder="Search students..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-muted border-line text-ink"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoadingProgress ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        ) : filteredProgress.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="h-12 w-12 text-ink-muted mx-auto mb-4" />
                                <p className="text-ink-muted">No students enrolled in this module</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-line">
                                            <TableHead className="text-ink-muted">Student ID</TableHead>
                                            <TableHead className="text-ink-muted">Name</TableHead>
                                            <TableHead className="text-ink-muted">Current Status</TableHead>
                                            <TableHead className="text-ink-muted">Marks ({selectedModuleData?.total_marks})</TableHead>
                                            <TableHead className="text-ink-muted">Notes</TableHead>
                                            <TableHead className="text-ink-muted text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProgress.map((progress) => (
                                            <TableRow key={progress.id} className="border-line">
                                                <TableCell className="text-ink font-mono">
                                                    {progress.student.student_id}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-ink font-medium">
                                                            {progress.student.user.full_name}
                                                        </p>
                                                        <p className="text-sm text-ink-muted">
                                                            {progress.student.user.email}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {getStatusBadge(progress)}
                                                        {progress.marks_obtained !== null && (
                                                            <p className="text-sm text-ink-muted">
                                                                Score: {progress.marks_obtained}/{selectedModuleData?.total_marks}
                                                            </p>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        max={selectedModuleData?.total_marks || 100}
                                                        step="0.5"
                                                        placeholder="Enter marks"
                                                        value={marksData[progress.student_id]?.marks ?? progress.marks_obtained ?? ''}
                                                        onChange={(e) => handleMarksChange(progress.student_id, e.target.value)}
                                                        className="w-24 bg-muted border-line text-ink"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        placeholder="Optional notes"
                                                        value={marksData[progress.student_id]?.notes ?? progress.notes ?? ''}
                                                        onChange={(e) => handleNotesChange(progress.student_id, e.target.value)}
                                                        className="w-48 bg-muted border-line text-ink"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSaveMarks(progress.student_id, selectedModule)}
                                                        disabled={savingMarks === progress.student_id || !marksData[progress.student_id]?.marks}
                                                        className="bg-primary"
                                                    >
                                                        {savingMarks === progress.student_id ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save className="h-4 w-4 mr-2" />
                                                                Save
                                                            </>
                                                        )}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
