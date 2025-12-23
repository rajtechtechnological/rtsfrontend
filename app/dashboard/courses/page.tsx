'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
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

// Mock data for courses
const mockCourses = [
    {
        id: '1',
        name: 'Web Development Bootcamp',
        description: 'Full-stack web development with HTML, CSS, JavaScript, React, and Node.js',
        duration_months: 6,
        fee_amount: 45000,
        students_enrolled: 45,
        status: 'active',
    },
    {
        id: '2',
        name: 'Python Programming',
        description: 'Python fundamentals to advanced concepts including data structures and algorithms',
        duration_months: 3,
        fee_amount: 25000,
        students_enrolled: 32,
        status: 'active',
    },
    {
        id: '3',
        name: 'Data Science Essentials',
        description: 'Data analysis, machine learning, and visualization with Python',
        duration_months: 6,
        fee_amount: 55000,
        students_enrolled: 28,
        status: 'active',
    },
    {
        id: '4',
        name: 'Mobile App Development',
        description: 'Build iOS and Android apps with React Native',
        duration_months: 4,
        fee_amount: 40000,
        students_enrolled: 18,
        status: 'active',
    },
    {
        id: '5',
        name: 'UI/UX Design',
        description: 'User interface and user experience design principles with Figma',
        duration_months: 3,
        fee_amount: 30000,
        students_enrolled: 22,
        status: 'active',
    },
    {
        id: '6',
        name: 'Digital Marketing',
        description: 'SEO, Social Media Marketing, and Google Ads',
        duration_months: 2,
        fee_amount: 20000,
        students_enrolled: 0,
        status: 'draft',
    },
];

const courseSchema = z.object({
    name: z.string().min(3, 'Course name must be at least 3 characters'),
    description: z.string().optional(),
    duration_months: z.number().min(1, 'Duration must be at least 1 month'),
    fee_amount: z.number().min(0, 'Fee must be positive'),
});

type CourseFormData = z.infer<typeof courseSchema>;

function AddCourseDialog() {
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
            console.log('Creating course:', data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Course created successfully!');
            reset();
            setOpen(false);
        } catch {
            toast.error('Failed to create course');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Course
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-emerald-400" />
                        Create New Course
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-300">Course Name *</Label>
                        <Input
                            id="name"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="e.g., Web Development Bootcamp"
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-400">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-slate-300">Description</Label>
                        <Input
                            id="description"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="Brief course description"
                            {...register('description')}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration_months" className="text-slate-300">Duration (months) *</Label>
                            <Input
                                id="duration_months"
                                type="number"
                                className="bg-slate-800/50 border-slate-700 text-white"
                                placeholder="6"
                                {...register('duration_months', { valueAsNumber: true })}
                            />
                            {errors.duration_months && (
                                <p className="text-sm text-red-400">{errors.duration_months.message}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="fee_amount" className="text-slate-300">Fee (₹) *</Label>
                            <Input
                                id="fee_amount"
                                type="number"
                                className="bg-slate-800/50 border-slate-700 text-white"
                                placeholder="45000"
                                {...register('fee_amount', { valueAsNumber: true })}
                            />
                            {errors.fee_amount && (
                                <p className="text-sm text-red-400">{errors.fee_amount.message}</p>
                            )}
                        </div>
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
                            className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white"
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

function CourseCard({ course }: { course: typeof mockCourses[0] }) {
    return (
        <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-lg group">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <CardTitle className="text-lg text-white group-hover:text-emerald-400 transition-colors">
                            {course.name}
                        </CardTitle>
                        <p className="text-sm text-slate-400 mt-1 line-clamp-2">{course.description}</p>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
                                <Edit className="h-4 w-4 mr-2" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                            <Clock className="h-4 w-4 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Duration</p>
                            <p className="text-sm font-medium text-white">{course.duration_months} months</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                            <IndianRupee className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Fee</p>
                            <p className="text-sm font-medium text-white">₹{course.fee_amount.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-lg bg-purple-500/10">
                            <Users className="h-4 w-4 text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Students</p>
                            <p className="text-sm font-medium text-white">{course.students_enrolled}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                    <Badge
                        className={
                            course.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                        }
                    >
                        {course.status}
                    </Badge>
                    <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white">
                        View Details →
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function CoursesPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredCourses = mockCourses.filter((course) =>
        course.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <BookOpen className="h-7 w-7 text-emerald-400" />
                        Course Management
                    </h1>
                    <p className="text-slate-400 mt-1">Create and manage course offerings</p>
                </div>
                <AddCourseDialog />
            </div>

            {/* Search */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
            </div>
        </div>
    );
}
