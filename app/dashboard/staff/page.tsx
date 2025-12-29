'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { staffApi } from '@/lib/api/endpoints';
import type { Staff } from '@/types';
import { useAuth } from '@/lib/auth/auth-context';
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

// Removed mock data - fetching from API

const staffSchema = z.object({
    full_name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email'),
    phone: z.string().min(10, 'Phone number is required (min 10 digits)'),
    role: z.enum(['staff', 'staff_manager', 'receptionist']),
    daily_rate: z.number().min(0, 'Daily rate must be positive'),
});

type StaffFormData = z.infer<typeof staffSchema>;

function AddStaffDialog({ onStaffAdded }: { onStaffAdded: () => void }) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuth();

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
            // Create staff via API
            await staffApi.create({
                ...data,
                institution_id: user?.institution_id,
            });
            toast.success('Staff member added successfully!');
            reset();
            setOpen(false);
            onStaffAdded(); // Refresh the list
        } catch (error: any) {
            toast.error(error.response?.data?.detail || 'Failed to add staff member');
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
                        <Label htmlFor="phone" className="text-slate-300">Phone *</Label>
                        <Input
                            id="phone"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="+91 98765 43210"
                            {...register('phone')}
                        />
                        {errors.phone && (
                            <p className="text-sm text-red-400">{errors.phone.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-300">Role *</Label>
                        <Select onValueChange={(value) => setValue('role', value as 'staff' | 'staff_manager' | 'receptionist')}>
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                                <SelectItem value="staff" className="text-white hover:bg-slate-800">Staff</SelectItem>
                                <SelectItem value="staff_manager" className="text-white hover:bg-slate-800">Accountant</SelectItem>
                                <SelectItem value="receptionist" className="text-white hover:bg-slate-800">Receptionist</SelectItem>
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
            label: 'Accountant',
            className: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
        },
        receptionist: {
            label: 'Receptionist',
            className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
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
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [staff, setStaff] = useState<Staff[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchStaff = async () => {
        try {
            setIsLoading(true);
            const response = await staffApi.list({ page: 1, page_size: 100 });
            // Backend returns array directly, not paginated response
            setStaff(response.data || []);
        } catch (error: any) {
            console.error('Failed to fetch staff:', error);
            toast.error('Failed to load staff');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStaff();
    }, []);

    const filteredStaff = staff.filter(
        (member) =>
            member.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            member.email.toLowerCase().includes(searchQuery.toLowerCase())
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
                <AddStaffDialog onStaffAdded={fetchStaff} />
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
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12">
                                            <Loader2 className="h-8 w-8 animate-spin text-purple-400 mx-auto" />
                                        </TableCell>
                                    </TableRow>
                                ) : filteredStaff.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center py-12">
                                            <Users className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                            <p className="text-slate-400">No staff members found</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredStaff.map((staff) => (
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
                                                    <DropdownMenuItem
                                                        onClick={() => router.push(`/dashboard/staff/${staff.id}`)}
                                                        className="text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer"
                                                    >
                                                        <Eye className="h-4 w-4 mr-2" /> View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer">
                                                        <Edit className="h-4 w-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer">
                                                        <Trash2 className="h-4 w-4 mr-2" /> Remove
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
