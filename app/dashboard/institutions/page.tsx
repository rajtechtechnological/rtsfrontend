'use client';

import { useState, useEffect } from 'react';
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
import { institutionsApi } from '@/lib/api/endpoints';
import { Skeleton } from '@/components/ui/skeleton';

interface Institution {
    id: string;
    name: string;
    address: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    director_name: string | null;
    staff_count: number;
    student_count: number;
    status: string;
    created_at: string | null;
}

const institutionSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    address: z.string().optional(),
    contact_email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
    contact_phone: z.string().optional(),
});

type InstitutionFormData = z.infer<typeof institutionSchema>;

function AddInstitutionDialog({ onSuccess }: { onSuccess: () => void }) {
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
            await institutionsApi.create({
                name: data.name,
                address: data.address,
                contact_email: data.contact_email,
                contact_phone: data.contact_phone,
            });
            toast.success('Institution created successfully!');
            reset();
            setOpen(false);
            onSuccess();
        } catch (error: any) {
            console.error('Failed to create institution:', error);
            toast.error(error.response?.data?.detail || 'Failed to create institution');
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

function InstitutionCard({ institution, onDelete }: { institution: Institution; onDelete: () => void }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!confirm('Are you sure you want to delete this institution?')) return;

        setIsDeleting(true);
        try {
            await institutionsApi.delete(institution.id);
            toast.success('Institution deleted successfully');
            onDelete();
        } catch (error: any) {
            console.error('Failed to delete institution:', error);
            toast.error(error.response?.data?.detail || 'Failed to delete institution');
        } finally {
            setIsDeleting(false);
        }
    };

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
                                <p className="text-sm text-slate-400">{institution.director_name || 'No director assigned'}</p>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
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
                                <DropdownMenuItem 
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                                        </>
                                    )}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-slate-400">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="line-clamp-1">{institution.address || 'No address provided'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Mail className="h-4 w-4 flex-shrink-0" />
                            <span>{institution.contact_email || 'No email provided'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <Phone className="h-4 w-4 flex-shrink-0" />
                            <span>{institution.contact_phone || 'No phone provided'}</span>
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

function LoadingSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-48 bg-slate-800" />
                <Skeleton className="h-10 w-40 bg-slate-800" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-24 bg-slate-800 rounded-xl" />
                ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-64 bg-slate-800 rounded-xl" />
                ))}
            </div>
        </div>
    );
}

export default function InstitutionsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [institutions, setInstitutions] = useState<Institution[]>([]);
    const [totalFranchises, setTotalFranchises] = useState(0);
    const [totalStaff, setTotalStaff] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const fetchInstitutions = async () => {
        try {
            setIsLoading(true);
            const response = await institutionsApi.getSummary();
            setInstitutions(response.data.institutions);
            setTotalFranchises(response.data.total_franchises);
            setTotalStaff(response.data.total_staff);
            setTotalStudents(response.data.total_students);
        } catch (error: any) {
            console.error('Failed to fetch institutions:', error);
            toast.error('Failed to load institutions');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchInstitutions();
    }, []);

    const filteredInstitutions = institutions.filter((inst) =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (inst.address && inst.address.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (isLoading) {
        return <LoadingSkeleton />;
    }

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
                <AddInstitutionDialog onSuccess={fetchInstitutions} />
            </div>

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-red-500/10">
                            <Building2 className="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">{totalFranchises}</p>
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
            {filteredInstitutions.length === 0 ? (
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-8 text-center">
                        <Building2 className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                        <p className="text-slate-400">
                            {searchQuery ? 'No institutions found matching your search' : 'No institutions yet. Create your first franchise!'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredInstitutions.map((institution) => (
                        <InstitutionCard 
                            key={institution.id} 
                            institution={institution}
                            onDelete={fetchInstitutions}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}


