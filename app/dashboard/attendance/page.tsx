'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    CalendarCheck,
    Check,
    X,
    Clock,
    Palmtree,
    CheckCircle2,
    AlertCircle,
    Edit,
    UserCheck,
} from 'lucide-react';

// Mock data for staff attendance records
const mockStaffAttendance = [
    { id: '1', full_name: 'Meera Iyer', role: 'staff_manager', status: 'present', marked_at: '09:15 AM' },
    { id: '2', full_name: 'Rajesh Kumar', role: 'staff', status: 'present', marked_at: '09:05 AM' },
    { id: '3', full_name: 'Sunita Devi', role: 'staff', status: 'half_day', marked_at: '09:20 AM' },
    { id: '4', full_name: 'Kiran Rao', role: 'staff', status: null, marked_at: null }, // Not marked yet
    { id: '5', full_name: 'Pradeep Sharma', role: 'staff', status: 'present', marked_at: '08:55 AM' },
];

type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave';

const statusConfig: Record<AttendanceStatus, { label: string; icon: React.ElementType; className: string; color: string }> = {
    present: {
        label: 'Present',
        icon: Check,
        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
        color: 'text-emerald-400',
    },
    absent: {
        label: 'Absent',
        icon: X,
        className: 'bg-red-500/10 text-red-400 border-red-500/30',
        color: 'text-red-400',
    },
    half_day: {
        label: 'Half Day',
        icon: Clock,
        className: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
        color: 'text-amber-400',
    },
    leave: {
        label: 'Leave',
        icon: Palmtree,
        className: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
        color: 'text-sky-400',
    },
};

// Staff Attendance Marking Dialog
function MarkAttendanceDialog({ open, onClose, staffName }: { open: boolean; onClose: () => void; staffName: string }) {
    const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedStatus) {
            toast.error('Please select your attendance status');
            return;
        }

        setIsSubmitting(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            const statusLabel = statusConfig[selectedStatus].label;
            toast.success(`Attendance marked as ${statusLabel}!`);
            onClose();
        } catch (error) {
            toast.error('Failed to mark attendance');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-slate-800 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <UserCheck className="h-5 w-5 text-emerald-400" />
                        Mark Your Attendance
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Hello {staffName}, please mark your attendance for today
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="text-center mb-4">
                        <p className="text-sm text-slate-400">Today's Date</p>
                        <p className="text-lg font-semibold text-white">
                            {new Date().toLocaleDateString('en-IN', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            })}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {(Object.keys(statusConfig) as AttendanceStatus[]).map((status) => {
                            const config = statusConfig[status];
                            const Icon = config.icon;
                            const isSelected = selectedStatus === status;

                            return (
                                <button
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                        isSelected
                                            ? config.className + ' ring-2 ring-offset-2 ring-offset-slate-900'
                                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                                >
                                    <Icon className="h-6 w-6" />
                                    <span className="text-sm font-medium">{config.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedStatus || isSubmitting}
                        className="w-full bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-500 hover:to-sky-500 text-white font-semibold shadow-lg mt-4"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

// Edit Attendance Dialog (for Staff Manager)
function EditAttendanceDialog({
    open,
    onClose,
    staff,
    currentStatus,
}: {
    open: boolean;
    onClose: () => void;
    staff: { id: string; full_name: string };
    currentStatus: AttendanceStatus | null;
}) {
    const [selectedStatus, setSelectedStatus] = useState<AttendanceStatus | null>(currentStatus);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!selectedStatus) {
            toast.error('Please select attendance status');
            return;
        }

        setIsSubmitting(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success(`Attendance updated for ${staff.full_name}`);
            onClose();
        } catch (error) {
            toast.error('Failed to update attendance');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="bg-slate-900 border-slate-800 sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Edit className="h-5 w-5 text-amber-400" />
                        Edit Attendance
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Updating attendance for {staff.full_name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-2 gap-3">
                        {(Object.keys(statusConfig) as AttendanceStatus[]).map((status) => {
                            const config = statusConfig[status];
                            const Icon = config.icon;
                            const isSelected = selectedStatus === status;

                            return (
                                <button
                                    key={status}
                                    onClick={() => setSelectedStatus(status)}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all ${
                                        isSelected
                                            ? config.className + ' ring-2 ring-offset-2 ring-offset-slate-900'
                                            : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-600'
                                    }`}
                                >
                                    <Icon className="h-6 w-6" />
                                    <span className="text-sm font-medium">{config.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={!selectedStatus || isSubmitting}
                        className="w-full bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-500 hover:to-sky-500 text-white font-semibold shadow-lg mt-4"
                    >
                        {isSubmitting ? 'Updating...' : 'Update Attendance'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default function AttendancePage() {
    const { user } = useAuth();
    const [showMarkDialog, setShowMarkDialog] = useState(false);
    const [editingStaff, setEditingStaff] = useState<{ id: string; full_name: string; status: AttendanceStatus | null } | null>(null);
    const [hasMarkedToday, setHasMarkedToday] = useState(false);

    const isStaff = user?.role === 'staff';
    const isStaffManager = user?.role === 'staff_manager';

    // Check if staff has marked attendance today
    useEffect(() => {
        if (isStaff) {
            // Check localStorage or API to see if already marked today
            const markedDate = localStorage.getItem('attendance_marked_date');
            const today = new Date().toDateString();

            if (markedDate === today) {
                setHasMarkedToday(true);
            } else {
                // Auto-show dialog for staff who haven't marked today
                setShowMarkDialog(true);
            }
        }
    }, [isStaff]);

    const handleMarkAttendanceClose = () => {
        setShowMarkDialog(false);
        setHasMarkedToday(true);
        // Save to localStorage that attendance was marked today
        localStorage.setItem('attendance_marked_date', new Date().toDateString());
    };

    const todayStr = new Date().toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    // Calculate summary
    const summary = mockStaffAttendance.reduce(
        (acc, staff) => {
            if (staff.status) {
                acc[staff.status]++;
            } else {
                acc.not_marked++;
            }
            return acc;
        },
        { present: 0, absent: 0, half_day: 0, leave: 0, not_marked: 0 }
    );

    // Staff View - Simple card showing their marked status
    if (isStaff) {
        const myAttendance = mockStaffAttendance.find(s => s.id === user?.id) || {
            id: user?.id || '1',
            full_name: user?.full_name || 'You',
            role: 'staff',
            status: hasMarkedToday ? 'present' : null,
            marked_at: hasMarkedToday ? new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : null,
        };

        return (
            <>
                <MarkAttendanceDialog
                    open={showMarkDialog}
                    onClose={handleMarkAttendanceClose}
                    staffName={user?.full_name?.split(' ')[0] || 'there'}
                />

                <div className="space-y-6">
                    <div>
                        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                            <CalendarCheck className="h-7 w-7 text-emerald-400" />
                            My Attendance
                        </h1>
                        <p className="text-slate-400 mt-1">Your attendance for today</p>
                    </div>

                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-6">
                            <div className="text-center space-y-4">
                                <div className="p-4 rounded-lg bg-slate-800/50">
                                    <p className="text-sm text-slate-400">Today's Date</p>
                                    <p className="text-lg font-semibold text-white mt-1">{todayStr}</p>
                                </div>

                                {myAttendance.status ? (
                                    <div className="space-y-4">
                                        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg ${statusConfig[myAttendance.status].className}`}>
                                            {(() => {
                                                const Icon = statusConfig[myAttendance.status as AttendanceStatus].icon;
                                                return <Icon className="h-6 w-6" />;
                                            })()}
                                            <span className="text-lg font-semibold">
                                                {statusConfig[myAttendance.status].label}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-center gap-2 text-emerald-400">
                                            <CheckCircle2 className="h-5 w-5" />
                                            <span className="text-sm">Marked at {myAttendance.marked_at}</span>
                                        </div>
                                        <Button
                                            onClick={() => setShowMarkDialog(true)}
                                            variant="outline"
                                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                                        >
                                            <Edit className="h-4 w-4 mr-2" />
                                            Update Attendance
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center gap-2 text-amber-400">
                                            <AlertCircle className="h-5 w-5" />
                                            <span>Not marked yet</span>
                                        </div>
                                        <Button
                                            onClick={() => setShowMarkDialog(true)}
                                            className="bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-500 hover:to-sky-500 text-white"
                                        >
                                            Mark Attendance Now
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    // Staff Manager View - See and edit all staff attendance
    return (
        <>
            {editingStaff && (
                <EditAttendanceDialog
                    open={!!editingStaff}
                    onClose={() => setEditingStaff(null)}
                    staff={editingStaff}
                    currentStatus={editingStaff.status}
                />
            )}

            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CalendarCheck className="h-7 w-7 text-emerald-400" />
                        Staff Attendance
                    </h1>
                    <p className="text-slate-400 mt-1">View and manage staff attendance</p>
                </div>

                {/* Date Display */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4">
                        <p className="text-center text-lg font-semibold text-white">{todayStr}</p>
                    </CardContent>
                </Card>

                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {(Object.keys(statusConfig) as AttendanceStatus[]).map((status) => {
                        const config = statusConfig[status];
                        const Icon = config.icon;
                        return (
                            <Card key={status} className="bg-slate-900/50 border-slate-800">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className={`p-3 rounded-xl ${config.className.split(' ')[0]}`}>
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-white">{summary[status]}</p>
                                        <p className="text-xs text-slate-400">{config.label}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-3 rounded-xl bg-slate-500/10">
                                <AlertCircle className="h-5 w-5 text-slate-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-white">{summary.not_marked}</p>
                                <p className="text-xs text-slate-400">Not Marked</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Staff Attendance Table */}
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Staff Attendance Records</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-800 hover:bg-transparent">
                                        <TableHead className="text-slate-400">Staff Member</TableHead>
                                        <TableHead className="text-slate-400">Status</TableHead>
                                        <TableHead className="text-slate-400">Marked At</TableHead>
                                        <TableHead className="text-slate-400">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockStaffAttendance.map((staff) => (
                                        <TableRow
                                            key={staff.id}
                                            className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-10 w-10 ring-2 ring-red-500/20">
                                                        <AvatarFallback className="bg-gradient-to-br from-red-500 to-sky-600 text-white">
                                                            {staff.full_name
                                                                .split(' ')
                                                                .map((n) => n[0])
                                                                .join('')}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium text-white">{staff.full_name}</p>
                                                        <p className="text-sm text-slate-400 capitalize">
                                                            {staff.role.replace('_', ' ')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                {staff.status ? (
                                                    <Badge className={statusConfig[staff.status].className}>
                                                        {(() => {
                                                            const Icon = statusConfig[staff.status as AttendanceStatus].icon;
                                                            return (
                                                                <>
                                                                    <Icon className="h-3 w-3 mr-1" />
                                                                    {statusConfig[staff.status].label}
                                                                </>
                                                            );
                                                        })()}
                                                    </Badge>
                                                ) : (
                                                    <Badge className="bg-slate-500/10 text-slate-400 border-slate-500/30">
                                                        <AlertCircle className="h-3 w-3 mr-1" />
                                                        Not Marked
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-slate-400 text-sm">
                                                    {staff.marked_at || '-'}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingStaff({ id: staff.id, full_name: staff.full_name, status: staff.status as AttendanceStatus | null })}
                                                    className="border-slate-700 text-slate-300 hover:bg-slate-800"
                                                >
                                                    <Edit className="h-3 w-3 mr-1" />
                                                    Edit
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
