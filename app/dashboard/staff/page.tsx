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
import { LedgerTable, type LedgerColumn } from '@/components/ui/ledger-table';
import { Stamp } from '@/components/ui/stamp';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, MoreHorizontal } from 'lucide-react';
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

const fieldLabelClass = 'text-xs uppercase tracking-wide text-ink-muted';

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
            if (!user?.institution_id) {
                toast.error('Institution not found');
                return;
            }
            // Create staff via API
            await staffApi.create({
                ...data,
                institution_id: user.institution_id,
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
                <Button>Add Staff</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="font-serif text-ink">Add New Staff Member</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="full_name" className={fieldLabelClass}>Full Name (required)</Label>
                        <Input
                            id="full_name"
                            placeholder="Enter staff name"
                            {...register('full_name')}
                        />
                        {errors.full_name && (
                            <p className="text-sm text-danger">{errors.full_name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email" className={fieldLabelClass}>Email (required)</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="staff@institute.com"
                            {...register('email')}
                        />
                        {errors.email && (
                            <p className="text-sm text-danger">{errors.email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone" className={fieldLabelClass}>Phone (required)</Label>
                        <Input
                            id="phone"
                            placeholder="+91 98765 43210"
                            {...register('phone')}
                        />
                        {errors.phone && (
                            <p className="text-sm text-danger">{errors.phone.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label className={fieldLabelClass}>Role (required)</Label>
                        <Select onValueChange={(value) => setValue('role', value as 'staff' | 'staff_manager' | 'receptionist')}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select role" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="staff">Staff</SelectItem>
                                <SelectItem value="staff_manager">Accountant</SelectItem>
                                <SelectItem value="receptionist">Receptionist</SelectItem>
                            </SelectContent>
                        </Select>
                        {errors.role && (
                            <p className="text-sm text-danger">{errors.role.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="daily_rate" className={fieldLabelClass}>Daily Rate in ₹ (required)</Label>
                        <Input
                            id="daily_rate"
                            type="number"
                            placeholder="Enter daily rate"
                            {...register('daily_rate', { valueAsNumber: true })}
                        />
                        {errors.daily_rate && (
                            <p className="text-sm text-danger">{errors.daily_rate.message}</p>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-line">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
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

const ROLE_LABELS: Record<string, string> = {
    institution_director: 'Director',
    staff_manager: 'Accountant',
    receptionist: 'Receptionist',
    staff: 'Staff',
};

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

    const columns: LedgerColumn<Staff>[] = [
        {
            key: 'name',
            header: 'Staff Member',
            cell: (member) => (
                <span className="flex items-center gap-2">
                    <Avatar className="h-6 w-6 rounded-sm">
                        <AvatarFallback className="rounded-sm bg-muted text-[10px] text-ink-muted">
                            {member.full_name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .slice(0, 2)}
                        </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.full_name}</span>
                </span>
            ),
        },
        {
            key: 'email',
            header: 'Email',
            cell: (member) => <span className="text-ink-muted">{member.email}</span>,
        },
        {
            key: 'phone',
            header: 'Phone',
            cell: (member) => (
                <span className="font-mono tabular-nums text-ink-muted">{member.phone}</span>
            ),
        },
        {
            key: 'role',
            header: 'Role',
            cell: (member) => ROLE_LABELS[member.role] || ROLE_LABELS.staff,
        },
        {
            key: 'daily_rate',
            header: 'Daily Rate',
            numeric: true,
            cell: (member) => `₹${member.daily_rate.toLocaleString('en-IN')}`,
        },
        {
            key: 'joined',
            header: 'Joined',
            cell: (member) =>
                new Date(member.join_date).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                }),
        },
        {
            key: 'status',
            header: 'Status',
            cell: (member) => <Stamp status={member.status} />,
        },
        {
            key: 'actions',
            header: '',
            align: 'right',
            headerClassName: 'w-12',
            cell: (member) => (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm" className="text-ink-muted hover:text-ink">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/staff/${member.id}`)}
                            className="cursor-pointer"
                        >
                            View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                        <DropdownMenuItem variant="destructive" className="cursor-pointer">
                            Remove
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-serif text-2xl font-semibold text-ink">Staff</h1>
                    <p className="text-sm text-ink-muted mt-1">Staff members and their daily rates</p>
                </div>
                <AddStaffDialog onStaffAdded={fetchStaff} />
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-3">
                <Input
                    placeholder="Search staff by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-9 w-full sm:w-64"
                />
            </div>

            {/* Staff Register */}
            <section className="rounded-md border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <h2 className="font-serif text-lg text-ink">All Staff</h2>
                    <span className="font-mono text-xs tabular-nums text-ink-muted">
                        {filteredStaff.length} records
                    </span>
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
                    </div>
                ) : (
                    <LedgerTable
                        columns={columns}
                        rows={filteredStaff}
                        rowKey={(member) => member.id}
                        emptyMessage="No staff members found."
                    />
                )}
            </section>
        </div>
    );
}
