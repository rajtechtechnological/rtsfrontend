'use client';

import { useState } from 'react';
import { toast } from 'sonner';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    CalendarCheck,
    ChevronLeft,
    ChevronRight,
    Check,
    X,
    Clock,
    Palmtree,
    Save,
    Loader2,
} from 'lucide-react';

// Mock data for staff attendance
const mockStaffForAttendance = [
    { id: '1', full_name: 'Meera Iyer', role: 'staff_manager' },
    { id: '2', full_name: 'Rajesh Kumar', role: 'staff' },
    { id: '3', full_name: 'Sunita Devi', role: 'staff' },
    { id: '4', full_name: 'Kiran Rao', role: 'staff' },
    { id: '5', full_name: 'Pradeep Sharma', role: 'staff' },
];

type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave';

const statusConfig: Record<AttendanceStatus, { label: string; icon: React.ElementType; className: string }> = {
    present: {
        label: 'Present',
        icon: Check,
        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20',
    },
    absent: {
        label: 'Absent',
        icon: X,
        className: 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20',
    },
    half_day: {
        label: 'Half Day',
        icon: Clock,
        className: 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20',
    },
    leave: {
        label: 'Leave',
        icon: Palmtree,
        className: 'bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20',
    },
};

function StatusButton({
    status,
    isActive,
    onClick,
}: {
    status: AttendanceStatus;
    isActive: boolean;
    onClick: () => void;
}) {
    const config = statusConfig[status];
    const Icon = config.icon;

    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${isActive
                    ? config.className + ' ring-2 ring-offset-2 ring-offset-slate-900 ring-current'
                    : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
        >
            <Icon className="h-3 w-3" />
            {config.label}
        </button>
    );
}

export default function AttendancePage() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedMonth, setSelectedMonth] = useState(selectedDate.getMonth());
    const [selectedYear, setSelectedYear] = useState(selectedDate.getFullYear());
    const [isSaving, setIsSaving] = useState(false);

    // Initialize attendance state
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>(() => {
        const initial: Record<string, AttendanceStatus> = {};
        mockStaffForAttendance.forEach((staff) => {
            initial[staff.id] = 'present';
        });
        return initial;
    });

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    const handlePrevDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() - 1);
        setSelectedDate(newDate);
    };

    const handleNextDay = () => {
        const newDate = new Date(selectedDate);
        newDate.setDate(newDate.getDate() + 1);
        setSelectedDate(newDate);
    };

    const handleAttendanceChange = (staffId: string, status: AttendanceStatus) => {
        setAttendance((prev) => ({
            ...prev,
            [staffId]: status,
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // API call would go here
            console.log('Saving attendance:', {
                date: selectedDate.toISOString().split('T')[0],
                attendance,
            });
            await new Promise((resolve) => setTimeout(resolve, 1000));
            toast.success('Attendance saved successfully!');
        } catch {
            toast.error('Failed to save attendance');
        } finally {
            setIsSaving(false);
        }
    };

    const formattedDate = selectedDate.toLocaleDateString('en-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    // Calculate summary
    const summary = Object.values(attendance).reduce(
        (acc, status) => {
            acc[status]++;
            return acc;
        },
        { present: 0, absent: 0, half_day: 0, leave: 0 } as Record<AttendanceStatus, number>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <CalendarCheck className="h-7 w-7 text-emerald-400" />
                        Attendance
                    </h1>
                    <p className="text-slate-400 mt-1">Mark and track staff attendance</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-500/25"
                >
                    {isSaving ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="h-4 w-4 mr-2" />
                            Save Attendance
                        </>
                    )}
                </Button>
            </div>

            {/* Date Navigation */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handlePrevDay}
                                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <div className="text-center sm:text-left">
                                <p className="text-lg font-semibold text-white">{formattedDate}</p>
                            </div>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={handleNextDay}
                                className="border-slate-700 text-slate-300 hover:bg-slate-800"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="flex items-center gap-2">
                            <Select
                                value={String(selectedMonth)}
                                onValueChange={(value) => setSelectedMonth(Number(value))}
                            >
                                <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800">
                                    {months.map((month, index) => (
                                        <SelectItem key={index} value={String(index)} className="text-white hover:bg-slate-800">
                                            {month}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={String(selectedYear)}
                                onValueChange={(value) => setSelectedYear(Number(value))}
                            >
                                <SelectTrigger className="w-[100px] bg-slate-800/50 border-slate-700 text-white">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-900 border-slate-800">
                                    {years.map((year) => (
                                        <SelectItem key={year} value={String(year)} className="text-white hover:bg-slate-800">
                                            {year}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(statusConfig).map(([status, config]) => {
                    const Icon = config.icon;
                    return (
                        <Card key={status} className="bg-slate-900/50 border-slate-800">
                            <CardContent className="p-4 flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${config.className.split(' ').slice(0, 2).join(' ')}`}>
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-white">{summary[status as AttendanceStatus]}</p>
                                    <p className="text-sm text-slate-400">{config.label}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Attendance Table */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">Mark Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400">Staff Member</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockStaffForAttendance.map((staff) => (
                                    <TableRow
                                        key={staff.id}
                                        className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 ring-2 ring-emerald-500/20">
                                                    <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                                                        {staff.full_name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-white">{staff.full_name}</p>
                                                    <p className="text-sm text-slate-400 capitalize">{staff.role.replace('_', ' ')}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-2">
                                                {(Object.keys(statusConfig) as AttendanceStatus[]).map((status) => (
                                                    <StatusButton
                                                        key={status}
                                                        status={status}
                                                        isActive={attendance[staff.id] === status}
                                                        onClick={() => handleAttendanceChange(staff.id, status)}
                                                    />
                                                ))}
                                            </div>
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
