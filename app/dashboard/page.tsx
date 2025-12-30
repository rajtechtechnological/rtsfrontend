'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    GraduationCap,
    Users,
    BookOpen,
    Building2,
    TrendingUp,
    Calendar,
    IndianRupee,
    ArrowUpRight,
    Wallet,
    Clock,
    CheckCircle,
    Award,
    CreditCard,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { dashboardApi, studentsApi } from '@/lib/api/endpoints';
import type { DashboardStats } from '@/types';
import { toast } from 'sonner';
import Link from 'next/link';

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    trend?: { value: number; isPositive: boolean } | null;
    gradient: string;
}

function StatCard({ title, value, description, icon: Icon, trend, gradient }: StatCardProps) {
    return (
        <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50 group">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-400">{title}</CardTitle>
                <div className={`p-2 rounded-lg ${gradient} shadow-lg`}>
                    <Icon className="h-4 w-4 text-white" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-slate-500">{description}</p>
                    {trend && (
                        <div
                            className={`flex items-center text-xs font-medium ${trend.isPositive ? 'text-emerald-400' : 'text-red-400'
                                }`}
                        >
                            <ArrowUpRight
                                className={`h-3 w-3 mr-1 ${!trend.isPositive && 'rotate-90'}`}
                            />
                            {Math.abs(trend.value)}%
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function QuickActionCard({
    title,
    description,
    icon: Icon,
    href,
    gradient,
}: {
    title: string;
    description: string;
    icon: React.ElementType;
    href: string;
    gradient: string;
}) {
    return (
        <a href={href} className="block group">
            <Card className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-lg hover:shadow-slate-900/50 h-full">
                <CardContent className="p-6 flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${gradient} shadow-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {title}
                        </h3>
                        <p className="text-sm text-slate-400">{description}</p>
                    </div>
                </CardContent>
            </Card>
        </a>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-8 w-64 bg-slate-800" />
                <Skeleton className="h-4 w-96 mt-2 bg-slate-800" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 bg-slate-800 rounded-xl" />
                ))}
            </div>
        </div>
    );
}

// Student Dashboard Component
function StudentDashboard({ user }: { user: any }) {
    const [studentData, setStudentData] = useState<any>(null);
    const [courses, setCourses] = useState<any[]>([]);
    const [courseProgress, setCourseProgress] = useState<Record<string, any>>({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchStudentData = async () => {
            try {
                setIsLoading(true);
                // First get student record by searching with user info
                const studentsResponse = await studentsApi.list();
                const students = studentsResponse.data || [];
                const currentStudent = students.find((s: any) => s.user_id === user.id);

                if (currentStudent) {
                    setStudentData(currentStudent);

                    // Get enrolled courses
                    const coursesResponse = await studentsApi.getCourses(currentStudent.id);
                    const coursesData = coursesResponse.data || [];
                    setCourses(coursesData);

                    // Get progress for each course
                    const progressData: Record<string, any> = {};
                    for (const enrollment of coursesData) {
                        try {
                            const progressResponse = await studentsApi.getCourseProgress(
                                currentStudent.id,
                                enrollment.course.id
                            );
                            progressData[enrollment.course.id] = progressResponse.data;
                        } catch (error) {
                            console.error(`Failed to fetch progress for course ${enrollment.course.id}:`, error);
                        }
                    }
                    setCourseProgress(progressData);
                }
            } catch (error) {
                console.error('Failed to fetch student data:', error);
                toast.error('Failed to load your data');
            } finally {
                setIsLoading(false);
            }
        };

        fetchStudentData();
    }, [user.id]);

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Welcome, {user?.full_name?.split(' ')[0] || 'Student'}! 👋
                </h1>
                <p className="text-slate-400 mt-2">
                    Track your courses, progress, and achievements.
                </p>
                {studentData && (
                    <p className="text-sm text-slate-500 mt-1">
                        Student ID: <span className="text-blue-400 font-mono">{studentData.student_id}</span>
                        {studentData.batch_time && (
                            <span className="ml-4">
                                Batch: <span className="text-purple-400">{studentData.batch_time}</span>
                            </span>
                        )}
                    </p>
                )}
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Enrolled Courses"
                    value={courses.length}
                    description="Active courses"
                    icon={BookOpen}
                    gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                />
                <StatCard
                    title="Completed Modules"
                    value={Object.values(courseProgress).reduce((acc: number, p: any) => acc + (p?.completed_modules || 0), 0)}
                    description="Across all courses"
                    icon={CheckCircle}
                    gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
                />
                <StatCard
                    title="In Progress"
                    value={Object.values(courseProgress).reduce((acc: number, p: any) => acc + (p?.in_progress_modules || 0), 0)}
                    description="Modules in progress"
                    icon={Clock}
                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                />
                <StatCard
                    title="Overall Progress"
                    value={`${Math.round(Object.values(courseProgress).reduce((acc: number, p: any) => acc + (p?.overall_percentage || 0), 0) / Math.max(courses.length, 1))}%`}
                    description="Average completion"
                    icon={TrendingUp}
                    gradient="bg-gradient-to-br from-purple-500 to-purple-600"
                />
            </div>

            {/* Enrolled Courses */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-400" />
                    My Courses
                </h2>
                {courses.length === 0 ? (
                    <Card className="bg-slate-900/50 border-slate-800">
                        <CardContent className="p-8 text-center">
                            <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400">You are not enrolled in any courses yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courses.map((enrollment: any) => {
                            const progress = courseProgress[enrollment.course.id];
                            return (
                                <Card key={enrollment.id} className="bg-slate-900/50 border-slate-800 hover:border-slate-700 transition-all">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="text-white text-lg">{enrollment.course.name}</CardTitle>
                                                <p className="text-sm text-slate-400 mt-1">
                                                    Duration: {enrollment.course.duration_months} months
                                                </p>
                                            </div>
                                            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                                                {enrollment.status || 'Active'}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {progress ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-sm text-slate-400">Progress</span>
                                                        <span className="text-sm font-medium text-white">{progress.overall_percentage}%</span>
                                                    </div>
                                                    <Progress value={progress.overall_percentage} className="h-2" />
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-center">
                                                    <div className="bg-slate-800/50 rounded-lg p-2">
                                                        <p className="text-lg font-bold text-emerald-400">{progress.completed_modules}</p>
                                                        <p className="text-xs text-slate-400">Completed</p>
                                                    </div>
                                                    <div className="bg-slate-800/50 rounded-lg p-2">
                                                        <p className="text-lg font-bold text-blue-400">{progress.in_progress_modules}</p>
                                                        <p className="text-xs text-slate-400">In Progress</p>
                                                    </div>
                                                    <div className="bg-slate-800/50 rounded-lg p-2">
                                                        <p className="text-lg font-bold text-slate-400">{progress.not_started_modules}</p>
                                                        <p className="text-xs text-slate-400">Pending</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-slate-400">Loading progress...</p>
                                        )}
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Quick Actions for Students */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="View Progress"
                        description="Detailed course progress"
                        icon={TrendingUp}
                        href={studentData ? `/dashboard/students/${studentData.id}` : '#'}
                        gradient="bg-gradient-to-br from-blue-500 to-blue-600"
                    />
                    <QuickActionCard
                        title="My Certificates"
                        description="View earned certificates"
                        icon={Award}
                        href="/dashboard/certificates"
                        gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                    />
                    <QuickActionCard
                        title="Payment History"
                        description="View fee payments"
                        icon={CreditCard}
                        href="/dashboard/payments"
                        gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
                    />
                </div>
            </div>
        </div>
    );
}

// Icon mapping for stats
const iconMap: Record<string, React.ElementType> = {
    'Total Franchises': Building2,
    'Total Revenue': IndianRupee,
    'Active Courses': BookOpen,
    'Total Enrollments': GraduationCap,
    'Total Students': GraduationCap,
    'Total Staff': Users,
    'Revenue': IndianRupee,
};

// Gradient mapping for stats
const gradientMap: Record<string, string> = {
    'Total Franchises': 'bg-gradient-to-br from-red-500 to-red-600',
    'Total Revenue': 'bg-gradient-to-br from-sky-500 to-sky-600',
    'Active Courses': 'bg-gradient-to-br from-emerald-500 to-emerald-600',
    'Total Enrollments': 'bg-gradient-to-br from-amber-500 to-orange-600',
    'Total Students': 'bg-gradient-to-br from-blue-500 to-blue-600',
    'Total Staff': 'bg-gradient-to-br from-purple-500 to-purple-600',
    'Revenue': 'bg-gradient-to-br from-amber-500 to-orange-600',
};

// Color mapping for popular courses
const courseColors = [
    'from-red-500 to-red-600',
    'from-sky-500 to-sky-600',
    'from-emerald-500 to-emerald-600',
    'from-amber-500 to-amber-600',
];

export default function DashboardPage() {
    const { user, isLoading: authLoading } = useAuth();
    const [dashboardData, setDashboardData] = useState<DashboardStats | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                const response = await dashboardApi.getStats();
                setDashboardData(response.data);
            } catch (error: any) {
                console.error('Failed to fetch dashboard data:', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setIsLoading(false);
            }
        };

        if (!authLoading && user) {
            fetchDashboardData();
        }
    }, [user, authLoading]);

    if (authLoading || isLoading) {
        return <LoadingSkeleton />;
    }

    if (!dashboardData) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-slate-400">Failed to load dashboard data</p>
            </div>
        );
    }

    const isDirector = user?.role === 'super_admin';
    const isAccountant = user?.role === 'staff_manager';
    const isReceptionist = user?.role === 'receptionist';
    const isStaff = user?.role === 'staff';
    const isStudent = user?.role === 'student';

    // Render student dashboard for students
    if (isStudent) {
        return <StudentDashboard user={user} />;
    }

    const quickActions = isDirector ? [
        {
            title: 'Manage Franchises',
            description: 'Add & oversee locations',
            icon: Building2,
            href: '/dashboard/institutions',
            gradient: 'bg-gradient-to-br from-red-500 to-red-600',
        },
        {
            title: 'Manage Courses',
            description: 'Add & edit courses',
            icon: BookOpen,
            href: '/dashboard/courses',
            gradient: 'bg-gradient-to-br from-sky-500 to-sky-600',
        },
        {
            title: 'Revenue Reports',
            description: 'Financial overview',
            icon: IndianRupee,
            href: '/dashboard/revenue',
            gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        },
        {
            title: 'Analytics Dashboard',
            description: 'Trends & insights',
            icon: TrendingUp,
            href: '/dashboard/analytics',
            gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
        },
    ] : isAccountant ? [
        {
            title: 'Register Student',
            description: 'Add new student',
            icon: GraduationCap,
            href: '/dashboard/students?action=new',
            gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
        },
        {
            title: 'Manage Students',
            description: 'View & edit students',
            icon: Users,
            href: '/dashboard/students',
            gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
        },
        {
            title: 'Record Payment',
            description: 'Process student payments',
            icon: IndianRupee,
            href: '/dashboard/payments',
            gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        },
        {
            title: 'My Attendance',
            description: 'Mark your attendance',
            icon: Calendar,
            href: '/dashboard/attendance',
            gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
        },
    ] : isReceptionist ? [
        {
            title: 'Record Payment',
            description: 'Process student payments',
            icon: Wallet,
            href: '/dashboard/payments',
            gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        },
        {
            title: 'View Students',
            description: 'Search students',
            icon: Users,
            href: '/dashboard/students',
            gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
        },
        {
            title: 'My Attendance',
            description: 'Mark your attendance',
            icon: Calendar,
            href: '/dashboard/attendance',
            gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
        },
    ] : isStaff ? [
        {
            title: 'Mark Attendance',
            description: 'Mark today\'s attendance',
            icon: Calendar,
            href: '/dashboard/attendance',
            gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        },
        {
            title: 'View Payroll',
            description: 'Check payment history',
            icon: Wallet,
            href: '/dashboard/payroll',
            gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
        },
    ] : [
        {
            title: 'Add New Student',
            description: 'Register a new student',
            icon: GraduationCap,
            href: '/dashboard/students?action=new',
            gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
        },
        {
            title: 'View Staff',
            description: 'Manage staff members',
            icon: Users,
            href: '/dashboard/staff',
            gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
        },
        {
            title: 'Manage Courses',
            description: 'View and edit courses',
            icon: BookOpen,
            href: '/dashboard/courses',
            gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div>
                <h1 className="text-3xl font-bold text-white">
                    Welcome back, {user?.full_name?.split(' ')[0] || 'User'}! 👋
                </h1>
                <p className="text-slate-400 mt-2">
                    {isDirector
                        ? "Here's an overview of all your institutions."
                        : isAccountant
                        ? "Manage students and payments for your institution."
                        : isReceptionist
                        ? "Process student payments and manage enrollments."
                        : isStaff
                        ? "View your attendance and payroll information."
                        : "Here's what's happening with your institution today."
                    }
                </p>
            </div>

            {/* Stats Grid - Hidden for Receptionists */}
            {!isReceptionist && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardData.stats.map((stat) => (
                        <StatCard
                            key={stat.title}
                            title={stat.title}
                            value={stat.value}
                            description={stat.description}
                            icon={iconMap[stat.title] || BookOpen}
                            trend={stat.trend}
                            gradient={gradientMap[stat.title] || 'bg-gradient-to-br from-blue-500 to-blue-600'}
                        />
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <QuickActionCard key={action.title} {...action} />
                    ))}
                </div>
            </div>

            {/* Recent Activity & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            {isDirector ? (
                                <>
                                    <BookOpen className="h-5 w-5 text-sky-400" />
                                    Most Popular Courses
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="h-5 w-5 text-blue-400" />
                                    Recent Enrollments
                                </>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isDirector && dashboardData.popularCourses ? (
                                dashboardData.popularCourses.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${courseColors[i % courseColors.length]} flex items-center justify-center text-white font-semibold text-sm`}>
                                                {item.enrollments}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{item.course}</p>
                                                <p className="text-xs text-slate-400">{item.franchise} Franchise</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-emerald-400 font-medium">+{item.trend}%</span>
                                    </div>
                                ))
                            ) : dashboardData.recentEnrollments ? (
                                dashboardData.recentEnrollments.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                                {item.student_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">{item.student_name}</p>
                                                <p className="text-xs text-slate-400">{item.course}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-slate-500">{item.time_ago}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-400 text-center py-4">No data available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                            {isDirector ? (
                                <>
                                    <IndianRupee className="h-5 w-5 text-red-400" />
                                    Revenue by Franchise
                                </>
                            ) : (
                                <>
                                    <Calendar className="h-5 w-5 text-emerald-400" />
                                    Today's Schedule
                                </>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {isDirector && dashboardData.revenueByFranchise ? (
                                dashboardData.revenueByFranchise.map((item, i) => (
                                    <div
                                        key={i}
                                        className="space-y-2"
                                    >
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium text-white">{item.name}</p>
                                            <span className="text-sm font-semibold text-white">₹{(item.revenue / 100000).toFixed(1)}L</span>
                                        </div>
                                        <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${courseColors[i % courseColors.length]} rounded-full`}
                                                style={{ width: `${item.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                [
                                    { time: '10:00 AM', event: 'Python Basics - Batch A', type: 'class' },
                                    { time: '12:00 PM', event: 'Staff Meeting', type: 'meeting' },
                                    { time: '02:00 PM', event: 'Web Development - Batch B', type: 'class' },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="text-sm font-medium text-blue-400 w-20">{item.time}</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-white">{item.event}</p>
                                            <p className="text-xs text-slate-400 capitalize">{item.type}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}


