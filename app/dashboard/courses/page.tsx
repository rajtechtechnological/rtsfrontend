'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { coursesApi } from '@/lib/api/endpoints';
import type { Course } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
    BookOpen,
    Plus,
    Search,
    Clock,
    IndianRupee,
    Users,
    Edit,
    Trash2,
    Loader2,
    MoreHorizontal,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


const courseSchema = z.object({
    name: z.string().min(3, 'Course name must be at least 3 characters'),
    description: z.string().optional(),
    duration_months: z.number().min(1, 'Duration must be at least 1 month'),
    fee_amount: z.number().min(0, 'Fee must be positive'),
});

type CourseFormData = z.infer<typeof courseSchema>;

function AddCourseDialog({ onCourseAdded }: { onCourseAdded: () => void }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CourseFormData>({
        resolver: zodResolver(courseSchema),
    });

    const onSubmit = async (data: CourseFormData) => {
        setIsLoading(true);
        try {
            // institution_id is never sent — the server derives it from the
            // caller's tenant (super_admin without one creates global courses).
            await coursesApi.create(data);
            toast.success('Course created successfully!');
            reset();
            setOpen(false);
            onCourseAdded();
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to create course');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-primary text-primary-foreground shadow-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-surface border-line sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-ink flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-success" />
                        Create New Course
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-ink">Course Name *</Label>
                        <Input
                            id="name"
                            className="bg-muted border-line text-ink"
                            placeholder="e.g., Web Development Bootcamp"
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-sm text-danger">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-ink">Description</Label>
                        <Input
                            id="description"
                            className="bg-muted border-line text-ink"
                            placeholder="Brief course description"
                            {...register('description')}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration_months" className="text-ink">Duration (months) *</Label>
                            <Input
                                id="duration_months"
                                type="number"
                                className="bg-muted border-line text-ink"
                                placeholder="6"
                                {...register('duration_months', { valueAsNumber: true })}
                            />
                            {errors.duration_months && (
                                <p className="text-sm text-danger">{errors.duration_months.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fee_amount" className="text-ink">Fee (₹) *</Label>
                            <Input
                                id="fee_amount"
                                type="number"
                                className="bg-muted border-line text-ink"
                                placeholder="45000"
                                {...register('fee_amount', { valueAsNumber: true })}
                            />
                            {errors.fee_amount && (
                                <p className="text-sm text-danger">{errors.fee_amount.message}</p>
                            )}
                        </div>
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            className="border-line text-ink hover:bg-muted"
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
                                    Creating...
                                </>
                            ) : (
                                'Create Course'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function CourseCard({ course }: { course: Course }) {
    return (
        <Card className="bg-surface border-line hover:border-primary/40 transition-all duration-300 hover:shadow-lg group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg text-ink group-hover:text-success transition-colors">
                            {course.name}
                        </CardTitle>
                        <p className="text-sm text-ink-muted mt-1 line-clamp-2">{course.description}</p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-ink-muted hover:text-ink h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-surface border-line">
                            <DropdownMenuItem className="text-ink hover:text-ink hover:bg-muted">
                                <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-danger hover:text-danger hover:bg-danger/10">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-accent-soft">
                            <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-ink-muted">Duration</p>
                            <p className="text-xs sm:text-sm font-medium text-ink">{course.duration_months} mo</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-accent-soft">
                            <IndianRupee className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success" />
                        </div>
                        <div>
                            <p className="text-xs text-ink-muted">Fee</p>
                            <p className="text-xs sm:text-sm font-medium text-ink">₹{course.fee_amount?.toLocaleString() ?? 'N/A'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                        <div className="p-1.5 sm:p-2 rounded-lg bg-accent-soft">
                            <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-ink-muted">Students</p>
                            <p className="text-xs sm:text-sm font-medium text-ink">0</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <Badge className="bg-accent-soft text-success border-success/30">
                        active
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-ink-muted hover:text-ink">
                        View Details →
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCourses = async () => {
        try {
            setIsLoading(true);
            const response = await coursesApi.list();
            setCourses(response.data);
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to fetch courses');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const filteredCourses = courses.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-ink flex items-center gap-2">
                        <BookOpen className="h-7 w-7 text-success" />
                        Course Management
                    </h1>
                    <p className="text-ink-muted mt-1">Create and manage course offerings</p>
                </div>
                <AddCourseDialog onCourseAdded={fetchCourses} />
            </div>

            {/* Search */}
            <Card className="bg-surface border-line">
                <CardContent className="p-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-muted" />
                        <Input
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-muted border-line text-ink placeholder:text-ink-muted"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Course Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-success" />
                </div>
            ) : filteredCourses.length === 0 ? (
                <Card className="bg-surface border-line">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <BookOpen className="h-12 w-12 text-ink-muted mb-4" />
                        <p className="text-ink-muted text-center">
                            {searchQuery ? 'No courses found matching your search' : 'No courses available. Create your first course!'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCourses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            )}
        </div>
    );
}
