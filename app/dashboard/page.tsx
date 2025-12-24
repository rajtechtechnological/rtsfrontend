'use client';

import { useAuth } from '@/lib/auth/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
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
} from 'lucide-react';

interface StatCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ElementType;
    trend?: { value: number; isPositive: boolean };
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
                            {trend.value}%
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

export default function DashboardPage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    const isDirector = user?.role === 'super_admin';
    const isStaff = user?.role === 'staff';

    // DEBUG LOGS
    console.log('🔍 DEBUG - User from useAuth:', user);
    console.log('🔍 DEBUG - User role:', user?.role);
    console.log('🔍 DEBUG - Is Director?:', isDirector);
    console.log('🔍 DEBUG - Is Staff?:', isStaff);
    console.log('🔍 DEBUG - Expected role:', 'super_admin');

    // Director sees stats across ALL franchises - focus on high-level metrics
    // Franchise admin sees stats for their institution only
    const stats = isDirector ? [
        {
            title: 'Total Franchises',
            value: '4',
            description: 'Active locations',
            icon: Building2,
            trend: { value: 2, isPositive: true },
            gradient: 'bg-gradient-to-br from-red-500 to-red-600',
        },
        {
            title: 'Total Revenue',
            value: '₹12.8L',
            description: 'This month',
            icon: IndianRupee,
            trend: { value: 15, isPositive: true },
            gradient: 'bg-gradient-to-br from-sky-500 to-sky-600',
        },
        {
            title: 'Active Courses',
            value: '18',
            description: 'Across all franchises',
            icon: BookOpen,
            trend: { value: 3, isPositive: true },
            gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        },
        {
            title: 'Total Enrollments',
            value: '536',
            description: 'Students enrolled',
            icon: GraduationCap,
            trend: { value: 22, isPositive: true },
            gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
        },
    ] : [
        {
            title: 'Total Students',
            value: '156',
            description: 'Active enrollments',
            icon: GraduationCap,
            trend: { value: 12, isPositive: true },
            gradient: 'bg-gradient-to-br from-blue-500 to-blue-600',
        },
        {
            title: 'Total Staff',
            value: '12',
            description: 'Active members',
            icon: Users,
            trend: { value: 4, isPositive: true },
            gradient: 'bg-gradient-to-br from-purple-500 to-purple-600',
        },
        {
            title: 'Active Courses',
            value: '8',
            description: 'Available courses',
            icon: BookOpen,
            gradient: 'bg-gradient-to-br from-emerald-500 to-emerald-600',
        },
        {
            title: 'Revenue',
            value: '₹3.2L',
            description: 'This month',
            icon: IndianRupee,
            trend: { value: 8, isPositive: true },
            gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
        },
    ];

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
                        : "Here's what's happening with your institution today."
                    }
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </div>

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
                            {isDirector ? [
                                { course: 'Web Development', enrollments: 145, franchise: 'Mumbai', color: 'from-red-500 to-red-600' },
                                { course: 'Python Programming', enrollments: 98, franchise: 'Bangalore', color: 'from-sky-500 to-sky-600' },
                                { course: 'Data Science', enrollments: 76, franchise: 'Delhi', color: 'from-emerald-500 to-emerald-600' },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-semibold text-sm`}>
                                            {item.enrollments}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{item.course}</p>
                                            <p className="text-xs text-slate-400">{item.franchise} Franchise</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-emerald-400 font-medium">+{Math.floor(Math.random() * 15 + 5)}%</span>
                                </div>
                            )) : [1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium">
                                            {String.fromCharCode(64 + i)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">Student {i}</p>
                                            <p className="text-xs text-slate-400">Web Development Course</p>
                                        </div>
                                    </div>
                                    <span className="text-xs text-slate-500">2 hours ago</span>
                                </div>
                            ))}
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
                            {isDirector ? [
                                { name: 'Mumbai Franchise', revenue: '₹4.2L', percentage: 33, color: 'from-red-500 to-red-600' },
                                { name: 'Bangalore Franchise', revenue: '₹3.8L', percentage: 30, color: 'from-sky-500 to-sky-600' },
                                { name: 'Delhi Franchise', revenue: '₹2.9L', percentage: 23, color: 'from-emerald-500 to-emerald-600' },
                                { name: 'Chennai Franchise', revenue: '₹1.9L', percentage: 14, color: 'from-amber-500 to-amber-600' },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="space-y-2"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-medium text-white">{item.name}</p>
                                        <span className="text-sm font-semibold text-white">{item.revenue}</span>
                                    </div>
                                    <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <div
                                            className={`absolute inset-y-0 left-0 bg-gradient-to-r ${item.color} rounded-full`}
                                            style={{ width: `${item.percentage}%` }}
                                        />
                                    </div>
                                </div>
                            )) : [
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
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
