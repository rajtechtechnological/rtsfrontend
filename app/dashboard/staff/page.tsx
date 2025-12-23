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
    Users,
    Plus,
    Search,
    MoreHorizontal,
    Mail,
    Phone,
    Eye,
    Edit,
    Trash2,
    Loader2,
    IndianRupee,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Mock data for staff
const mockStaff = [
    {
        id: '1',
        full_name: 'Dr. Arun Verma',
        email: 'arun.verma@institute.com',
        phone: '+91 98765 11111',
        role: 'institution_director',
        daily_rate: 2000,
        join_date: '2022-06-15',
        status: 'active',
    },
    {
        id: '2',
        full_name: 'Meera Iyer',
        email: 'meera.iyer@institute.com',
        phone: '+91 98765 22222',
        role: 'staff_manager',
        daily_rate: 1200,
        join_date: '2023-01-10',
        status: 'active',
    },
    {
        id: '3',
        full_name: 'Rajesh Kumar',
        email: 'rajesh.k@institute.com',
        phone: '+91 98765 33333',
        role: 'staff',
        daily_rate: 800,
        join_date: '2023-03-20',
        status: 'active',
    },
    {
        id: '4',
        full_name: 'Sunita Devi',
        email: 'sunita.d@institute.com',
        phone: '+91 98765 44444',
        role: 'staff',
        daily_rate: 900,
        join_date: '2023-05-15',
        status: 'active',
    },
    {
        id: '5',
        full_name: 'Kiran Rao',
        email: 'kiran.rao@institute.com',
        phone: '+91 98765 55555',
        role: 'staff',
        daily_rate: 750,
        join_date: '2024-01-05',
        status: 'inactive',
    },
];

const staffSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().optional(),
    role: z.enum(['staff', 'staff_manager']),
    daily_rate: z.number().min(0, 'Daily rate must be positive'),
});

type StaffFormData = z.infer<typeof staffSchema>;

function AddStaffDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        formState: { errors },
    } = useForm<StaffFormData>({
        resolver: zodResolver(staffSchema),
        defaultValues: {
            role: 'staff',
            daily_rate: 0,
        },
    });

    const onSubmit = async (data: StaffFormData) => {
        setIsLoading(true);
        try {
            console.log('Creating staff:', data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Staff member added successfully!');
            reset();
            setOpen(false);
        } catch {
            toast.error('Failed to add staff member');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/25">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Staff
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Users className="h-5 w-5 text-purple-400" />
                        Add New Staff Member
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name" className="text-slate-300">Full Name *</Label>
                        <Input
                            id="full_name"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="Enter staff name"
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
                            placeholder="staff@institute.com"
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
                        <Label className="text-slate-300">Role *</Label>
                        <Select onValueChange={(value) => setValue('role', value as 'staff' | 'staff_manager')}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                                <SelectItem value="staff" className="text-white hover:bg-slate-800">Staff</SelectItem>
                                <SelectItem value="staff_manager" className="text-white hover:bg-slate-800">Staff Manager</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-sm text-red-400">{errors.role.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="daily_rate" className="text-slate-300">Daily Rate (₹) *</Label>
                        <Input
                            id="daily_rate"
                            type="number"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="Enter daily rate"
                            {...register('daily_rate', { valueAsNumber: true })}
                        />
                        {errors.daily_rate && (
                            <p className="text-sm text-red-400">{errors.daily_rate.message}</p>
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
                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                'Add Staff'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function getRoleBadge(role: string) {
    const roleConfig: Record<string, { label: string; className: string }> = {
        institution_director: {
            label: 'Director',
            className: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        },
        staff_manager: {
            label: 'Manager',
            className: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        },
        staff: {
            label: 'Staff',
            className: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
        },
    };

    const config = roleConfig[role] || roleConfig.staff;
    return <Badge className={config.className}>{config.label}</Badge>;
}

export default function StaffPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredStaff = mockStaff.filter(
        (staff) =>
            staff.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            staff.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Users className="h-7 w-7 text-purple-400" />
                        Staff Management
                    </h1>
                    <p className="text-slate-400 mt-1">Manage staff members and their daily rates</p>
                </div>
                <AddStaffDialog />
            </div>

            {/* Search */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search staff by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Staff Table */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">
                        All Staff
                        <Badge variant="secondary" className="ml-2 bg-slate-800 text-slate-300">
                            {filteredStaff.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400">Staff Member</TableHead>
                                    <TableHead className="text-slate-400">Contact</TableHead>
                                    <TableHead className="text-slate-400">Role</TableHead>
                                    <TableHead className="text-slate-400">Daily Rate</TableHead>
                                    <TableHead className="text-slate-400">Joined</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                    <TableHead className="text-slate-400 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredStaff.map((staff) => (
                                    <TableRow
                                        key={staff.id}
                                        className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 ring-2 ring-purple-500/20">
                                                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                                                        {staff.full_name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-white">{staff.full_name}</p>
                                                    <p className="text-sm text-slate-400">{staff.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-col gap-1">
                                                <span className="flex items-center gap-1 text-sm text-slate-300">
                                                    <Mail className="h-3 w-3" /> {staff.email}
                                                </span>
                                                <span className="flex items-center gap-1 text-sm text-slate-400">
                                                    <Phone className="h-3 w-3" /> {staff.phone}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getRoleBadge(staff.role)}</TableCell>
                                        <TableCell>
                                            <span className="flex items-center text-emerald-400 font-medium">
                                                <IndianRupee className="h-4 w-4" />
                                                {staff.daily_rate.toLocaleString()}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-slate-300">
                                            {new Date(staff.join_date).toLocaleDateString('en-IN', {
                                                day: 'numeric',
                                                month: 'short',
                                                year: 'numeric',
                                            })}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    staff.status === 'active'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                        : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                                                }
                                            >
                                                {staff.status}
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
                                                        <Trash2 className="h-4 w-4 mr-2" /> Remove
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
