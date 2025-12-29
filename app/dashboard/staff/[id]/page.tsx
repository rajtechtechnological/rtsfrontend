'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { staffApi, attendanceApi } from '@/lib/api/endpoints';
import type { Staff, Attendance } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    User,
    Mail,
    Phone,
    Calendar,
    IndianRupee,
    Briefcase,
    Check,
    X,
    Clock,
    Palmtree,
    Loader2,
    CalendarCheck,
} from 'lucide-react';

type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave';

const statusConfig: Record<AttendanceStatus, { label: string; icon: React.ElementType; className: string }> = {
    present: {
        label: 'Present',
        icon: Check,
        className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    },
    absent: {
        label: 'Absent',
        icon: X,
        className: 'bg-red-500/10 text-red-400 border-red-500/30',
    },
    half_day: {
        label: 'Half Day',
        icon: Clock,
        className: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    },
    leave: {
        label: 'Leave',
        icon: Palmtree,
        className: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    },
};

interface AttendanceStats {
    total_working_days: number;
    present: number;
    absent: number;
    half_day: number;
    leave: number;
    not_marked: number;
    attendance_percentage: number;
}

export default function StaffProfilePage() {
    const params = useParams();
    const staffId = params.id as string;

    const [staff, setStaff] = useState<Staff | null>(null);
    const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
    const [monthlyRecords, setMonthlyRecords] = useState<Attendance[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    // Fetch staff details and attendance
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                // Fetch staff details
                const staffResponse = await staffApi.get(staffId);
                const staffData = staffResponse.data;
                setStaff(staffData);

                // Fetch all attendance records for this staff
                const allAttendanceResponse = await attendanceApi.list({ staff_id: staffId });
                const allRecords = allAttendanceResponse.data || [];
                setAttendanceRecords(allRecords);

                // Fetch this month's attendance
                const monthlyResponse = await attendanceApi.list({
                    staff_id: staffId,
                    month: currentMonth + 1,
                    year: currentYear,
                });
                const monthlyData = monthlyResponse.data || [];
                setMonthlyRecords(monthlyData);
            } catch (error: any) {
                console.error('Failed to fetch staff data:', error);
                toast.error('Failed to load staff profile');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [staffId, currentMonth, currentYear]);

    // Calculate if a date is Sunday
    const isSunday = (date: Date) => date.getDay() === 0;

    // Calculate working days between two dates (excluding Sundays)
    const getWorkingDaysBetween = (startDate: Date, endDate: Date): number => {
        let count = 0;
        const current = new Date(startDate);

        while (current <= endDate) {
            if (!isSunday(current)) {
                count++;
            }
            current.setDate(current.getDate() + 1);
        }

        return count;
    };

    // Calculate overall attendance stats
    const calculateOverallStats = (): AttendanceStats => {
        if (!staff) {
            return {
                total_working_days: 0,
                present: 0,
                absent: 0,
                half_day: 0,
                leave: 0,
                not_marked: 0,
                attendance_percentage: 0,
            };
        }

        const joiningDate = new Date(staff.join_date);
        const today = new Date();

        // Total working days from joining till today (excluding Sundays)
        const totalWorkingDays = getWorkingDaysBetween(joiningDate, today);

        // Count attendance by status
        const statusCounts = attendanceRecords.reduce(
            (acc, record) => {
                acc[record.status as AttendanceStatus]++;
                return acc;
            },
            { present: 0, absent: 0, half_day: 0, leave: 0 }
        );

        const markedDays = attendanceRecords.length;
        const notMarked = totalWorkingDays - markedDays;

        // Calculate attendance percentage (present + half_day as 0.5)
        const effectiveDays = statusCounts.present + statusCounts.half_day * 0.5;
        const attendancePercentage = totalWorkingDays > 0
            ? (effectiveDays / totalWorkingDays) * 100
            : 0;

        return {
            total_working_days: totalWorkingDays,
            present: statusCounts.present,
            absent: statusCounts.absent,
            half_day: statusCounts.half_day,
            leave: statusCounts.leave,
            not_marked: notMarked,
            attendance_percentage: Math.round(attendancePercentage * 10) / 10,
        };
    };

    // Calculate this month's stats
    const calculateMonthlyStats = (): AttendanceStats => {
        if (!staff) {
            return {
                total_working_days: 0,
                present: 0,
                absent: 0,
                half_day: 0,
                leave: 0,
                not_marked: 0,
                attendance_percentage: 0,
            };
        }

        // First day of current month
        const firstDay = new Date(currentYear, currentMonth, 1);

        // Last day of current month or today (whichever is earlier)
        const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
        const today = new Date();
        const lastDay = lastDayOfMonth < today ? lastDayOfMonth : today;

        // Check if staff joined this month
        const joiningDate = new Date(staff.join_date);
        const startDate = joiningDate > firstDay ? joiningDate : firstDay;

        // Total working days this month (excluding Sundays)
        const totalWorkingDays = getWorkingDaysBetween(startDate, lastDay);

        // Count attendance by status for this month
        const statusCounts = monthlyRecords.reduce(
            (acc, record) => {
                acc[record.status as AttendanceStatus]++;
                return acc;
            },
            { present: 0, absent: 0, half_day: 0, leave: 0 }
        );

        const markedDays = monthlyRecords.length;
        const notMarked = totalWorkingDays - markedDays;

        // Calculate attendance percentage
        const effectiveDays = statusCounts.present + statusCounts.half_day * 0.5;
        const attendancePercentage = totalWorkingDays > 0
            ? (effectiveDays / totalWorkingDays) * 100
            : 0;

        return {
            total_working_days: totalWorkingDays,
            present: statusCounts.present,
            absent: statusCounts.absent,
            half_day: statusCounts.half_day,
            leave: statusCounts.leave,
            not_marked: notMarked,
            attendance_percentage: Math.round(attendancePercentage * 10) / 10,
        };
    };

    // Generate calendar days for current month
    const generateMonthCalendar = () => {
        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const days = [];

        // Add empty cells for days before the first day of month
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const date = new Date(currentYear, currentMonth, day);
            const dateStr = date.toISOString().split('T')[0];
            const attendance = monthlyRecords.find(
                (r) => r.date === dateStr
            );

            days.push({
                day,
                date,
                dateStr,
                attendance,
                isSunday: isSunday(date),
                isFuture: date > new Date(),
            });
        }

        return days;
    };

    const overallStats = calculateOverallStats();
    const monthlyStats = calculateMonthlyStats();
    const calendarDays = generateMonthCalendar();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
            </div>
        );
    }

    if (!staff) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-slate-400">Staff member not found</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <User className="h-7 w-7 text-purple-400" />
                    Staff Profile
                </h1>
                <p className="text-slate-400 mt-1">Detailed information and attendance records</p>
            </div>

            {/* Staff Info Card */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-6">
                    <div className="flex items-start gap-6">
                        <Avatar className="h-20 w-20 ring-2 ring-purple-500/20">
                            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-2xl">
                                {staff.full_name.split(' ').map((n) => n[0]).join('')}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold text-white">{staff.full_name}</h2>
                                    <Badge className="mt-2 bg-purple-500/10 text-purple-400 border-purple-500/30">
                                        {staff.role === 'staff_manager' ? 'Accountant' : 'Staff'}
                                    </Badge>
                                </div>
                                <Badge
                                    className={
                                        staff.status === 'active'
                                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                            : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                                    }
                                >
                                    {staff.status}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <span>{staff.email}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    <span>{staff.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span>
                                        Joined:{' '}
                                        {new Date(staff.join_date).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <IndianRupee className="h-4 w-4 text-slate-400" />
                                    <span>Daily Rate: ₹{staff.daily_rate.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Overall Attendance Stats */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                        <CalendarCheck className="h-5 w-5 text-purple-400" />
                        Overall Attendance (Since Joining)
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-white">{overallStats.total_working_days}</p>
                            <p className="text-xs text-slate-400 mt-1">Total Days</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-emerald-400">{overallStats.present}</p>
                            <p className="text-xs text-slate-400 mt-1">Present</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-amber-400">{overallStats.half_day}</p>
                            <p className="text-xs text-slate-400 mt-1">Half Day</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-sky-400">{overallStats.leave}</p>
                            <p className="text-xs text-slate-400 mt-1">Leave</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-red-400">{overallStats.absent}</p>
                            <p className="text-xs text-slate-400 mt-1">Absent</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-400">{overallStats.attendance_percentage}%</p>
                            <p className="text-xs text-slate-400 mt-1">Attendance</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* This Month's Attendance */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-white">
                            {new Date(currentYear, currentMonth).toLocaleDateString('en-IN', {
                                month: 'long',
                                year: 'numeric',
                            })}{' '}
                            Attendance
                        </CardTitle>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-emerald-500/20"></div>
                                <span className="text-slate-400">Present: {monthlyStats.present}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded bg-slate-600"></div>
                                <span className="text-slate-400">Sunday</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Month Stats Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                        <div className="text-center p-3 rounded-lg bg-slate-800/50">
                            <p className="text-xl font-bold text-white">{monthlyStats.total_working_days}</p>
                            <p className="text-xs text-slate-400 mt-1">Working Days</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-emerald-500/10">
                            <p className="text-xl font-bold text-emerald-400">{monthlyStats.present}</p>
                            <p className="text-xs text-slate-400 mt-1">Present</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-amber-500/10">
                            <p className="text-xl font-bold text-amber-400">{monthlyStats.half_day}</p>
                            <p className="text-xs text-slate-400 mt-1">Half Day</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-sky-500/10">
                            <p className="text-xl font-bold text-sky-400">{monthlyStats.leave}</p>
                            <p className="text-xs text-slate-400 mt-1">Leave</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-red-500/10">
                            <p className="text-xl font-bold text-red-400">{monthlyStats.absent}</p>
                            <p className="text-xs text-slate-400 mt-1">Absent</p>
                        </div>
                        <div className="text-center p-3 rounded-lg bg-purple-500/10">
                            <p className="text-xl font-bold text-purple-400">{monthlyStats.attendance_percentage}%</p>
                            <p className="text-xs text-slate-400 mt-1">Attendance</p>
                        </div>
                    </div>

                    {/* Calendar View */}
                    <div className="mt-6">
                        <div className="grid grid-cols-7 gap-2">
                            {/* Day headers */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="text-center text-xs font-medium text-slate-400 py-2">
                                    {day}
                                </div>
                            ))}

                            {/* Calendar days */}
                            {calendarDays.map((day, index) => {
                                if (!day) {
                                    return <div key={`empty-${index}`} className="aspect-square"></div>;
                                }

                                const { day: dayNum, isSunday, isFuture, attendance } = day;
                                const status = attendance?.status as AttendanceStatus | undefined;

                                let bgClass = 'bg-slate-800/50';
                                let textClass = 'text-slate-300';
                                let borderClass = 'border-slate-700';

                                if (isSunday) {
                                    bgClass = 'bg-slate-700/50';
                                    textClass = 'text-slate-500';
                                } else if (isFuture) {
                                    bgClass = 'bg-slate-800/30';
                                    textClass = 'text-slate-600';
                                } else if (status) {
                                    const config = statusConfig[status];
                                    bgClass = config.className.split(' ')[0];
                                    borderClass = 'border-' + config.className.split('text-')[1]?.split(' ')[0];
                                }

                                return (
                                    <div
                                        key={index}
                                        className={`aspect-square rounded-lg border ${bgClass} ${borderClass} flex flex-col items-center justify-center p-2 transition-all hover:scale-105`}
                                    >
                                        <span className={`text-sm font-medium ${textClass}`}>{dayNum}</span>
                                        {status && !isSunday && (
                                            <div className="mt-1">
                                                {(() => {
                                                    const Icon = statusConfig[status].icon;
                                                    return <Icon className="h-3 w-3" />;
                                                })()}
                                            </div>
                                        )}
                                        {isSunday && <span className="text-xs text-slate-500">Off</span>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
