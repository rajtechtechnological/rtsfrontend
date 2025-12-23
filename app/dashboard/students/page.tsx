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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    GraduationCap,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Mail,
    Phone,
    Eye,
    Edit,
    Trash2,
    Loader2,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for students
const mockStudents = [
    {
        id: '1',
        full_name: 'Rahul Sharma',
        email: 'rahul.sharma@email.com',
        phone: '+91 98765 43210',
        enrollment_date: '2024-01-15',
        courses: ['Web Development', 'Python'],
        status: 'active',
    },
    {
        id: '2',
        full_name: 'Priya Patel',
        email: 'priya.patel@email.com',
        phone: '+91 87654 32109',
        enrollment_date: '2024-02-20',
        courses: ['Data Science'],
        status: 'active',
    },
    {
        id: '3',
        full_name: 'Amit Kumar',
        email: 'amit.kumar@email.com',
        phone: '+91 76543 21098',
        enrollment_date: '2024-03-10',
        courses: ['Mobile App Development'],
        status: 'active',
    },
    {
        id: '4',
        full_name: 'Sneha Reddy',
        email: 'sneha.reddy@email.com',
        phone: '+91 65432 10987',
        enrollment_date: '2024-01-25',
        courses: ['UI/UX Design', 'Web Development'],
        status: 'completed',
    },
    {
        id: '5',
        full_name: 'Vikram Singh',
        email: 'vikram.singh@email.com',
        phone: '+91 54321 09876',
        enrollment_date: '2024-04-05',
        courses: ['Python'],
        status: 'active',
    },
];

const studentSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().optional(),
    address: z.string().optional(),
    date_of_birth: z.string().optional(),
});

type StudentFormData = z.infer<typeof studentSchema>;

function AddStudentDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<StudentFormData>({
        resolver: zodResolver(studentSchema),
    });

    const onSubmit = async (data: StudentFormData) => {
        setIsLoading(true);
        try {
            // API call would go here
            console.log('Creating student:', data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Student added successfully!');
            reset();
            setOpen(false);
        } catch {
            toast.error('Failed to add student');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-blue-500/25">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Student
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-400" />
                        Add New Student
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-slate-300">Full Name *</Label>
                        <Input
                            id="full_name"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="Enter student name"
                            {...register('full_name')}
                        />
                        {errors.full_name && (
                            <p className="text-sm text-red-400">{errors.full_name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">Email *</Label>
                        <Input
                            id="email"
                            type="email"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="student@email.com"
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-400">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                        <Input
                            id="phone"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="+91 98765 43210"
                            {...register('phone')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="date_of_birth" className="text-slate-300">Date of Birth</Label>
                        <Input
                            id="date_of_birth"
                            type="date"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            {...register('date_of_birth')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-slate-300">Address</Label>
                        <Input
                            id="address"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="Enter address"
                            {...register('address')}
                        />
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
                                    Adding...
                                </>
                            ) : (
                                'Add Student'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function StudentsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStudents = mockStudents.filter(
        (student) =>
            student.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <GraduationCap className="h-7 w-7 text-blue-400" />
                        Students
                    </h1>
                    <p className="text-slate-400 mt-1">Manage student records and enrollments</p>
                </div>
                <AddStudentDialog />
            </div>

            {/* Filters */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                placeholder="Search students by name or email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                            />
                        </div>
                        <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800">
                            <Filter className="h-4 w-4 mr-2" />
                            Filters
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Students Table */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">
                        All Students
                        <Badge variant="secondary" className="ml-2 bg-slate-800 text-slate-300">
                            {filteredStudents.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400">Student</TableHead>
                                    <TableHead className="text-slate-400">Contact</TableHead>
                                    <TableHead className="text-slate-400">Courses</TableHead>
                                    <TableHead className="text-slate-400">Enrolled</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                    <TableHead className="text-slate-400 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStudents.map((student) => (
                                    <TableRow
                                        key={student.id}
                                        className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 ring-2 ring-blue-500/20">
                                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                                        {student.full_name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-white">{student.full_name}</p>
                                                    <p className="text-sm text-slate-400">{student.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1 text-sm text-slate-300">
                                                    <Mail className="h-3 w-3" /> {student.email}
                                                </span>
                                                <span className="flex items-center gap-1 text-sm text-slate-400">
                                                    <Phone className="h-3 w-3" /> {student.phone}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {student.courses.map((course) => (
                                                    <Badge
                                                        key={course}
                                                        variant="outline"
                                                        className="border-blue-500/30 text-blue-400 bg-blue-500/10 text-xs"
                                                    >
                                                        {course}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            {new Date(student.enrollment_date).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    student.status === 'active'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                        : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                                                }
                                            >
                                                {student.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                                                    <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
                                                        <Eye className="h-4 w-4 mr-2" /> View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
                                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
