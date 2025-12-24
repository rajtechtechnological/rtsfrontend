'use client';

import { useState } from 'react';
import Link from 'next/link';
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
    Building2,
    Plus,
    Search,
    MapPin,
    Mail,
    Phone,
    Users,
    GraduationCap,
    Edit,
    Trash2,
    Loader2,
    MoreHorizontal,
    Eye,
} from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock data for institutions
const mockInstitutions = [
    {
        id: '1',
        name: 'TechEdu Institute - Mumbai',
        address: '123 Learning Street, Andheri West, Mumbai 400053',
        contact_email: 'mumbai@techedu.in',
        contact_phone: '+91 22 1234 5678',
        director_name: 'Dr. Arun Verma',
        staff_count: 12,
        student_count: 156,
        status: 'active',
    },
    {
        id: '2',
        name: 'TechEdu Institute - Delhi',
        address: '456 Knowledge Avenue, Connaught Place, New Delhi 110001',
        contact_email: 'delhi@techedu.in',
        contact_phone: '+91 11 2345 6789',
        director_name: 'Dr. Priya Sharma',
        staff_count: 8,
        student_count: 98,
        status: 'active',
    },
    {
        id: '3',
        name: 'TechEdu Institute - Bangalore',
        address: '789 Tech Park, Koramangala, Bangalore 560034',
        contact_email: 'bangalore@techedu.in',
        contact_phone: '+91 80 3456 7890',
        director_name: 'Dr. Rahul Reddy',
        staff_count: 15,
        student_count: 210,
        status: 'active',
    },
    {
        id: '4',
        name: 'TechEdu Institute - Chennai',
        address: '321 Education Hub, T. Nagar, Chennai 600017',
        contact_email: 'chennai@techedu.in',
        contact_phone: '+91 44 4567 8901',
        director_name: 'Dr. Lakshmi Iyer',
        staff_count: 6,
        student_count: 72,
        status: 'pending',
    },
];

const institutionSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    address: z.string().optional(),
    contact_email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
    contact_phone: z.string().optional(),
});

type InstitutionFormData = z.infer<typeof institutionSchema>;

function AddInstitutionDialog() {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<InstitutionFormData>({
        resolver: zodResolver(institutionSchema),
    });

    const onSubmit = async (data: InstitutionFormData) => {
        setIsLoading(true);
        try {
            console.log('Creating institution:', data);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Institution created successfully!');
            reset();
            setOpen(false);
        } catch {
            toast.error('Failed to create institution');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-500 hover:to-sky-500 text-white shadow-lg shadow-red-500/25">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Franchise
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-red-400" />
                        Add New Franchise
                    </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-slate-300">Institution Name *</Label>
                        <Input
                            id="name"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="e.g., TechEdu Institute - Pune"
                            {...register('name')}
                        />
                        {errors.name && (
                            <p className="text-sm text-red-400">{errors.name.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="address" className="text-slate-300">Address</Label>
                        <Input
                            id="address"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="Full address"
                            {...register('address')}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact_email" className="text-slate-300">Contact Email</Label>
                        <Input
                            id="contact_email"
                            type="email"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="contact@institution.com"
                            {...register('contact_email')}
                        />
                        {errors.contact_email && (
                            <p className="text-sm text-red-400">{errors.contact_email.message}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="contact_phone" className="text-slate-300">Contact Phone</Label>
                        <Input
                            id="contact_phone"
                            className="bg-slate-800/50 border-slate-700 text-white"
                            placeholder="+91 XX XXXX XXXX"
                            {...register('contact_phone')}
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
                            className="bg-gradient-to-r from-red-600 to-sky-600 text-white"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Create Franchise'
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}

function InstitutionCard({ institution }: { institution: typeof mockInstitutions[0] }) {
    return (
        <Link href={`/dashboard/institutions/${institution.id}`}>
            <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-lg group cursor-pointer">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 group-hover:from-blue-500/20 group-hover:to-cyan-500/20 transition-colors">
                            <Building2 className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <CardTitle className="text-lg text-white group-hover:text-blue-400 transition-colors">
                                {institution.name}
                            </CardTitle>
                            <p className="text-sm text-slate-400">{institution.director_name}</p>
                        </div>
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-slate-900 border-slate-800">
                            <DropdownMenuItem className="text-slate-300 hover:text-white hover:bg-slate-800">
                                <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
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
            <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="line-clamp-1">{institution.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Mail className="h-4 w-4 flex-shrink-0" />
                        <span>{institution.contact_email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{institution.contact_phone}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm">
                            <Users className="h-4 w-4 text-purple-400" />
                            <span className="text-white font-medium">{institution.staff_count}</span>
                            <span className="text-slate-500">staff</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                            <GraduationCap className="h-4 w-4 text-blue-400" />
                            <span className="text-white font-medium">{institution.student_count}</span>
                            <span className="text-slate-500">students</span>
                        </div>
                    </div>
                    <Badge
                        className={
                            institution.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }
                    >
                        {institution.status}
                    </Badge>
                </div>
            </CardContent>
        </Card>
        </Link>
    );
}

export default function InstitutionsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredInstitutions = mockInstitutions.filter((inst) =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalStaff = mockInstitutions.reduce((acc, i) => acc + i.staff_count, 0);
    const totalStudents = mockInstitutions.reduce((acc, i) => acc + i.student_count, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Building2 className="h-7 w-7 text-red-400" />
                        Franchises
                    </h1>
                    <p className="text-slate-400 mt-1">Manage all franchise locations</p>
                </div>
                <AddInstitutionDialog />
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-red-500/10">
                            <Building2 className="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{mockInstitutions.length}</p>
                            <p className="text-sm text-slate-400">Franchises</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-sky-500/10">
                            <Users className="h-6 w-6 text-sky-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{totalStaff}</p>
                            <p className="text-sm text-slate-400">Total Staff</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-sky-500/10">
                            <GraduationCap className="h-6 w-6 text-sky-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{totalStudents}</p>
                            <p className="text-sm text-slate-400">Total Students</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search institutions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Institution Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredInstitutions.map((institution) => (
                    <InstitutionCard key={institution.id} institution={institution} />
                ))}
            </div>
        </div>
    );
}
