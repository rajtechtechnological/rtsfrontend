'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
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
import { NoticeTicker, type Notice } from '@/components/dashboard/notice-ticker';

/**
 * Rolling notices for the ticker. Static for now — the institution edits these
 * in code until a notices endpoint exists; the ticker reads any Notice[].
 */
const DASHBOARD_NOTICES: Notice[] = [
    { tag: 'Batch', text: 'New DCA / ADCA morning batches at 8 AM & 9 AM — enrolment open at all centers.' },
    { tag: 'Exam', text: 'Quarterly online examinations begin next Monday. Admit cards available in the portal.' },
    { tag: 'Event', text: 'Annual prize distribution ceremony this Saturday at the main campus, 11 AM.' },
    { tag: 'Admission', text: 'KYP (Kushal Yuva Program) admissions open — apply at your nearest center.' },
    { tag: 'Notice', text: 'Fee payments for the current term are due by the 15th. Pay online to avoid queues.' },
];

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    trend?: { value: number; isPositive: boolean } | null;
    index?: number;
}

function StatCard({ title, value, description, icon: Icon, trend, index = 0 }: StatCardProps) {
    const riseClass = `rts-rise rts-rise-${Math.min(index + 1, 5)}`;
    return (
        <Card className={`rts-glow-card rts-rise ${riseClass} rounded-md border-line bg-surface shadow-sm`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                    {title}
                </CardTitle>
                <div className="rounded-md bg-accent-soft p-2 transition-transform duration-200 group-hover:scale-105">
                    <Icon className="h-4 w-4 text-primary" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="font-mono text-3xl font-semibold tabular-nums tracking-tight text-ink">
                    {value}
                </div>
                <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-ink-muted">{description}</p>
                    {trend && (
                        <div
                            className={`flex items-center rounded-full px-1.5 py-0.5 text-xs font-medium ${
                                trend.isPositive
                                    ? 'bg-success/10 text-success'
                                    : 'bg-danger/10 text-danger'
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
}: {
    title: string;
    description: string;
    icon: React.ElementType;
    href: string;
}) {
    return (
        <Link href={href} className="group block">
            <Card className="rts-glow-card h-full rounded-md border-line bg-surface shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                    <div className="rounded-md bg-accent-soft p-3 transition-transform duration-200 group-hover:scale-105">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <h3 className="font-medium text-ink transition-colors group-hover:text-primary">
                            {title}
                        </h3>
                        <p className="text-sm text-ink-muted">{description}</p>
                    </div>
                    <ArrowUpRight className="ml-auto h-4 w-4 text-ink-muted opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 group-hover:text-primary" />
                </CardContent>
            </Card>
        </Link>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-8">
            <div>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="mt-2 h-4 w-96" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-32 rounded-md" />
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
                        if (!enrollment.course) continue;
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
            {/* Always-on notice ticker */}
            <NoticeTicker notices={DASHBOARD_NOTICES} />

            {/* Welcome Section — subtle institutional gradient band */}
            <div className="rts-rise relative overflow-hidden rounded-md border border-line bg-gradient-to-br from-accent-soft/60 via-surface to-surface p-6">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
                <h1 className="relative font-serif text-2xl font-semibold text-ink">
                    Welcome, {user?.full_name?.split(' ')[0] || 'Student'}
                </h1>
                <p className="relative mt-2 text-ink-muted">
                    Track your courses, progress, and achievements.
                </p>
                {studentData && (
                    <p className="relative mt-1 text-sm text-ink-muted">
                        Student ID: <span className="font-mono text-primary">{studentData.student_id}</span>
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
                    index={0}
                />
                <StatCard
                    title="Completed Modules"
                    value={Object.values(courseProgress).reduce((acc: number, p: any) => acc + (p?.completed_modules || 0), 0)}
                    description="Across all courses"
                    icon={CheckCircle}
                    index={1}
                />
                <StatCard
                    title="In Progress"
                    value={Object.values(courseProgress).reduce((acc: number, p: any) => acc + (p?.in_progress_modules || 0), 0)}
                    description="Modules in progress"
                    icon={Clock}
                    index={2}
                />
                <StatCard
                    title="Overall Progress"
                    value={`${Math.round(Object.values(courseProgress).reduce((acc: number, p: any) => acc + (p?.overall_percentage || 0), 0) / Math.max(courses.length, 1))}%`}
                    description="Average completion"
                    icon={TrendingUp}
                    index={3}
                />
            </div>

            {/* Enrolled Courses */}
            <div>
                <h2 className="mb-4 flex items-center gap-2 font-serif text-lg font-semibold text-ink">
                    <GraduationCap className="h-5 w-5 text-primary" />
                    My Courses
                </h2>
                {courses.length === 0 ? (
                    <Card className="rounded-md border-line bg-surface shadow-sm">
                        <CardContent className="p-8 text-center">
                            <p className="font-serif text-ink-muted">You are not enrolled in any courses yet.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courses.map((enrollment: any) => {
                            const progress = courseProgress[enrollment.course.id];
                            return (
                                <Card key={enrollment.id} className="rounded-md border-line bg-surface shadow-sm">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <CardTitle className="font-serif text-lg text-ink">{enrollment.course.name}</CardTitle>
                                                <p className="mt-1 text-sm text-ink-muted">
                                                    Duration: {enrollment.course.duration_months} months
                                                </p>
                                            </div>
                                            <span className="text-[11px] font-medium uppercase tracking-widest text-success">
                                                {enrollment.status || 'Active'}
                                            </span>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {progress ? (
                                            <div className="space-y-4">
                                                <div>
                                                    <div className="mb-2 flex items-center justify-between">
                                                        <span className="text-sm text-ink-muted">Progress</span>
                                                        <span className="font-mono text-sm font-medium tabular-nums text-ink">{progress.overall_percentage}%</span>
                                                    </div>
                                                    <Progress value={progress.overall_percentage} className="h-2" />
                                                </div>
                                                <div className="grid grid-cols-3 gap-2 text-center">
                                                    <div className="rounded-md border border-line p-2">
                                                        <p className="font-mono text-lg font-semibold tabular-nums text-success">{progress.completed_modules}</p>
                                                        <p className="text-xs text-ink-muted">Completed</p>
                                                    </div>
                                                    <div className="rounded-md border border-line p-2">
                                                        <p className="font-mono text-lg font-semibold tabular-nums text-ink">{progress.in_progress_modules}</p>
                                                        <p className="text-xs text-ink-muted">In Progress</p>
                                                    </div>
                                                    <div className="rounded-md border border-line p-2">
                                                        <p className="font-mono text-lg font-semibold tabular-nums text-ink-muted">{progress.not_started_modules}</p>
                                                        <p className="text-xs text-ink-muted">Pending</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-sm text-ink-muted">Loading progress...</p>
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
                <h2 className="mb-4 font-serif text-lg font-semibold text-ink">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickActionCard
                        title="View Progress"
                        description="Detailed course progress"
                        icon={TrendingUp}
                        href={studentData ? `/dashboard/students/${studentData.id}` : '#'}
                    />
                    <QuickActionCard
                        title="My Certificates"
                        description="View earned certificates"
                        icon={Award}
                        href="/dashboard/certificates"
                    />
                    <QuickActionCard
                        title="Payment History"
                        description="View fee payments"
                        icon={CreditCard}
                        href="/dashboard/payments"
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
                <p className="font-serif text-ink-muted">Failed to load dashboard data</p>
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
        },
        {
            title: 'Manage Courses',
            description: 'Add & edit courses',
            icon: BookOpen,
            href: '/dashboard/courses',
        },
        {
            title: 'Revenue Reports',
            description: 'Financial overview',
            icon: IndianRupee,
            href: '/dashboard/revenue',
        },
        {
            title: 'Analytics Dashboard',
            description: 'Trends & insights',
            icon: TrendingUp,
            href: '/dashboard/analytics',
        },
    ] : isAccountant ? [
        {
            title: 'Register Student',
            description: 'Add new student',
            icon: GraduationCap,
            href: '/dashboard/students?action=new',
        },
        {
            title: 'Manage Students',
            description: 'View & edit students',
            icon: Users,
            href: '/dashboard/students',
        },
        {
            title: 'Record Payment',
            description: 'Process student payments',
            icon: IndianRupee,
            href: '/dashboard/payments',
        },
        {
            title: 'My Attendance',
            description: 'Mark your attendance',
            icon: Calendar,
            href: '/dashboard/attendance',
        },
    ] : isReceptionist ? [
        {
            title: 'Register Student',
            description: 'Add new student',
            icon: GraduationCap,
            href: '/dashboard/students?action=new',
        },
        {
            title: 'Record Payment',
            description: 'Process student payments',
            icon: Wallet,
            href: '/dashboard/payments',
        },
        {
            title: 'View Students',
            description: 'Search students',
            icon: Users,
            href: '/dashboard/students',
        },
        {
            title: 'My Attendance',
            description: 'Mark your attendance',
            icon: Calendar,
            href: '/dashboard/attendance',
        },
    ] : isStaff ? [
        {
            title: 'Mark Attendance',
            description: 'Mark today\'s attendance',
            icon: Calendar,
            href: '/dashboard/attendance',
        },
        {
            title: 'View Payroll',
            description: 'Check payment history',
            icon: Wallet,
            href: '/dashboard/payroll',
        },
    ] : [
        {
            title: 'Student Progress',
            description: 'Manage module marks',
            icon: Award,
            href: '/dashboard/marks-entry',
        },
        {
            title: 'Add New Student',
            description: 'Register a new student',
            icon: GraduationCap,
            href: '/dashboard/students?action=new',
        },
        {
            title: 'View Staff',
            description: 'Manage staff members',
            icon: Users,
            href: '/dashboard/staff',
        },
        {
            title: 'Manage Courses',
            description: 'View and edit courses',
            icon: BookOpen,
            href: '/dashboard/courses',
        },
    ];

    return (
        <div className="space-y-8">
            {/* Always-on notice ticker */}
            <NoticeTicker notices={DASHBOARD_NOTICES} />

            {/* Welcome Section — subtle institutional gradient band */}
            <div className="rts-rise relative overflow-hidden rounded-md border border-line bg-gradient-to-br from-accent-soft/60 via-surface to-surface p-6">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
                <h1 className="relative font-serif text-2xl font-semibold text-ink">
                    Welcome back, {user?.full_name?.split(' ')[0] || 'User'}
                </h1>
                <p className="relative mt-2 text-ink-muted">
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
                    {dashboardData.stats.map((stat, i) => (
                        <StatCard
                            key={stat.title}
                            title={stat.title}
                            value={stat.value}
                            description={stat.description}
                            icon={iconMap[stat.title] || BookOpen}
                            trend={stat.trend}
                            index={i}
                        />
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div>
                <h2 className="mb-4 font-serif text-lg font-semibold text-ink">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action) => (
                        <QuickActionCard key={action.title} {...action} />
                    ))}
                </div>
            </div>

            {/* Recent Activity & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-md border-line bg-surface shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-serif text-lg text-ink">
                            {isDirector ? (
                                <>
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    Most Popular Courses
                                </>
                            ) : (
                                <>
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Recent Enrollments
                                </>
                            )}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-0">
                            {isDirector && dashboardData.popularCourses ? (
                                dashboardData.popularCourses.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between border-b border-line py-3 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft font-mono text-sm font-semibold tabular-nums text-primary">
                                                {item.enrollments}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-ink">{item.course}</p>
                                                <p className="text-xs text-ink-muted">{item.franchise} Franchise</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-success">+{item.trend}%</span>
                                    </div>
                                ))
                            ) : dashboardData.recentEnrollments ? (
                                dashboardData.recentEnrollments.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center justify-between border-b border-line py-3 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-medium text-ink">
                                                {item.student_name.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-ink">{item.student_name}</p>
                                                <p className="text-xs text-ink-muted">{item.course}</p>
                                            </div>
                                        </div>
                                        <span className="text-xs text-ink-muted">{item.time_ago}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="py-4 text-center font-serif text-sm text-ink-muted">No data available</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-md border-line bg-surface shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 font-serif text-lg text-ink">
                            {isDirector ? (
                                <>
                                    <IndianRupee className="h-5 w-5 text-primary" />
                                    Revenue by Franchise
                                </>
                            ) : (
                                <>
                                    <Calendar className="h-5 w-5 text-primary" />
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
                                            <p className="text-sm font-medium text-ink">{item.name}</p>
                                            <span className="font-mono text-sm font-semibold tabular-nums text-ink">₹{(item.revenue / 100000).toFixed(1)}L</span>
                                        </div>
                                        <div className="relative h-1.5 overflow-hidden rounded-full bg-muted">
                                            <div
                                                className="absolute inset-y-0 left-0 rounded-full bg-primary"
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
                                        className="flex items-center gap-4 border-b border-line py-3 last:border-0"
                                    >
                                        <div className="w-20 font-mono text-sm font-medium tabular-nums text-primary">{item.time}</div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-ink">{item.event}</p>
                                            <p className="text-xs capitalize text-ink-muted">{item.type}</p>
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


