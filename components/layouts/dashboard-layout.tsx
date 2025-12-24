'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/auth-context';
import {
    LayoutDashboard,
    Building2,
    GraduationCap,
    BookOpen,
    Users,
    CalendarCheck,
    Wallet,
    Award,
    MessageSquare,
    LogOut,
    Menu,
    X,
    ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import type { UserRole } from '@/types';

interface NavItem {
    title: string;
    href: string;
    icon: React.ElementType;
    roles?: UserRole[];
}

const navItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
    },
    {
        title: 'Franchises',
        href: '/dashboard/institutions',
        icon: Building2,
        roles: ['super_admin'],
    },
    {
        title: 'Courses',
        href: '/dashboard/courses',
        icon: BookOpen,
        roles: ['super_admin', 'institution_director', 'staff_manager'],
    },
    {
        title: 'Revenue',
        href: '/dashboard/revenue',
        icon: Wallet,
        roles: ['super_admin'],
    },
    {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: LayoutDashboard,
        roles: ['super_admin'],
    },
    {
        title: 'Students',
        href: '/dashboard/students',
        icon: GraduationCap,
        roles: ['institution_director', 'staff_manager'],
    },
    {
        title: 'Staff',
        href: '/dashboard/staff',
        icon: Users,
        roles: ['institution_director', 'staff_manager'],
    },
    {
        title: 'Attendance',
        href: '/dashboard/attendance',
        icon: CalendarCheck,
        roles: ['institution_director', 'staff_manager', 'staff'],
    },
    {
        title: 'Payroll',
        href: '/dashboard/payroll',
        icon: Wallet,
        roles: ['institution_director'],
    },
    {
        title: 'Certificates',
        href: '/dashboard/certificates',
        icon: Award,
        roles: ['institution_director', 'staff_manager'],
    },
];

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
    const pathname = usePathname();
    const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                'hover:bg-slate-800/50 hover:text-white',
                isActive
                    ? 'bg-gradient-to-r from-red-600/20 to-sky-600/20 text-white border-l-2 border-red-500'
                    : 'text-slate-400'
            )}
        >
            <Icon className="h-5 w-5" />
            {item.title}
        </Link>
    );
}

function Sidebar({ onNavClick }: { onNavClick?: () => void }) {
    const { user, hasRole } = useAuth();

    const filteredNavItems = navItems.filter(
        (item) => !item.roles || item.roles.some((role) => hasRole(role))
    );

    return (
        <div className="flex h-full flex-col bg-slate-900/95 backdrop-blur-xl border-r border-slate-800">
            {/* Logo */}
            <div className="flex h-16 items-center gap-2 border-b border-slate-800 px-6">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-sky-500">
                    <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-red-400 to-sky-400 bg-clip-text text-transparent">
                    Rajtech
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
                {filteredNavItems.map((item) => (
                    <NavLink key={item.href} item={item} onClick={onNavClick} />
                ))}
            </nav>

            {/* User Info */}
            <div className="border-t border-slate-800 p-4">
                <div className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-3">
                    <Avatar className="h-9 w-9 ring-2 ring-red-500/20">
                        <AvatarFallback className="bg-gradient-to-br from-red-500 to-sky-500 text-white text-sm">
                            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{user?.full_name}</p>
                        <p className="text-xs text-slate-400 capitalize">{user?.role?.replace('_', ' ')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Header() {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-slate-800 bg-slate-900/80 backdrop-blur-xl px-4 lg:px-6">
            {/* Mobile menu button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                        <Menu className="h-5 w-5" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0 border-r border-slate-800 bg-slate-900">
                    <Sidebar onNavClick={() => setMobileMenuOpen(false)} />
                </SheetContent>
            </Sheet>

            {/* Page title placeholder */}
            <div className="hidden lg:block" />

            {/* Right side actions */}
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 text-slate-300 hover:text-white hover:bg-slate-800">
                            <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-gradient-to-br from-red-500 to-sky-500 text-white text-sm">
                                    {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden md:block text-sm font-medium">{user?.full_name}</span>
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-slate-900 border-slate-800">
                        <div className="px-2 py-1.5">
                            <p className="text-sm font-medium text-white">{user?.full_name}</p>
                            <p className="text-xs text-slate-400">{user?.email}</p>
                        </div>
                        <DropdownMenuSeparator className="bg-slate-800" />
                        <DropdownMenuItem
                            onClick={logout}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
                        >
                            <LogOut className="mr-2 h-4 w-4" />
                            Sign out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen bg-slate-950">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:flex lg:w-64 lg:flex-col">
                <Sidebar />
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}
