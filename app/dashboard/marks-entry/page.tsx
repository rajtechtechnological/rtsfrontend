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
                <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/30 border">
                    Not Attempted
                </Badge>
            );
        }

        if (progress.passed) {
            return (
                <Badge className="bg-green-500/10 text-green-400 border-green-500/30 border flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Passed
                </Badge>
            );
        }

        return (
            <Badge className="bg-red-500/10 text-red-400 border-red-500/30 border flex items-center gap-1">
                <XCircle className="h-3 w-3" />
                Failed
            </Badge>
        );
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white flex items-center gap-2">
                    <Award className="h-8 w-8 text-yellow-500" />
                    Marks Entry
                </h1>
                <p className="text-slate-400 mt-1">Enter exam marks for students by module</p>
            </div>

            {/* Course and Module Selection */}
            <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Select Course & Module</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Course Selection */}
                        <div className="space-y-2">
                            <Label className="text-slate-300">Course</Label>
                            <Select
                                value={selectedCourse}
                                onValueChange={setSelectedCourse}
                                disabled={isLoadingCourses}
                            >
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                    <SelectValue placeholder="Select a course" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800">
                                    {courses.map((course) => (
                                        <SelectItem key={course.id} value={course.id} className="text-white hover:bg-slate-800">
                                            {course.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Module Selection */}
                        <div className="space-y-2">
                            <Label className="text-slate-300">Module</Label>
                            <Select
                                value={selectedModule}
                                onValueChange={setSelectedModule}
                                disabled={!selectedCourse || isLoadingModules}
                            >
                                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                    <SelectValue placeholder="Select a module" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800">
                                    {modules.map((module) => (
                                        <SelectItem key={module.id} value={module.id} className="text-white hover:bg-slate-800">
                                            Module {module.module_number}: {module.module_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {selectedModuleData && (
                        <div className="bg-slate-800/50 rounded-lg p-4 flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-400">Selected Module</p>
                                <p className="text-white font-semibold">{selectedModuleData.module_name}</p>
                                <p className="text-sm text-slate-400">
                                    {selectedModuleData.lesson_count} lessons • Total Marks: {selectedModuleData.total_marks} • Passing: {selectedModuleData.passing_marks}
                                </p>
                            </div>
                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30 border">
                                {studentProgress.length} students enrolled
                            </Badge>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Student List & Marks Entry */}
            {selectedModule && (
                <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-white">Student Marks</CardTitle>
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    placeholder="Search students..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 bg-slate-800 border-slate-700 text-white"
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isLoadingProgress ? (
                            <div className="flex items-center justify-center py-12">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                            </div>
                        ) : filteredProgress.length === 0 ? (
                            <div className="text-center py-12">
                                <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400">No students enrolled in this module</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="border-slate-800">
                                            <TableHead className="text-slate-400">Student ID</TableHead>
                                            <TableHead className="text-slate-400">Name</TableHead>
                                            <TableHead className="text-slate-400">Current Status</TableHead>
                                            <TableHead className="text-slate-400">Marks ({selectedModuleData?.total_marks})</TableHead>
                                            <TableHead className="text-slate-400">Notes</TableHead>
                                            <TableHead className="text-slate-400 text-right">Action</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredProgress.map((progress) => (
                                            <TableRow key={progress.id} className="border-slate-800">
                                                <TableCell className="text-slate-300 font-mono">
                                                    {progress.student.student_id}
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <p className="text-white font-medium">
                                                            {progress.student.user.full_name}
                                                        </p>
                                                        <p className="text-sm text-slate-400">
                                                            {progress.student.user.email}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="space-y-1">
                                                        {getStatusBadge(progress)}
                                                        {progress.marks_obtained !== null && (
                                                            <p className="text-sm text-slate-400">
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
                                                        className="w-24 bg-slate-800 border-slate-700 text-white"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Input
                                                        placeholder="Optional notes"
                                                        value={marksData[progress.student_id]?.notes ?? progress.notes ?? ''}
                                                        onChange={(e) => handleNotesChange(progress.student_id, e.target.value)}
                                                        className="w-48 bg-slate-800 border-slate-700 text-white"
                                                    />
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSaveMarks(progress.student_id, selectedModule)}
                                                        disabled={savingMarks === progress.student_id || !marksData[progress.student_id]?.marks}
                                                        className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
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
