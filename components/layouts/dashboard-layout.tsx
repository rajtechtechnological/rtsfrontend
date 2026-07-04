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
    LogOut,
    Menu,
    ChevronDown,
    ClipboardList,
    BarChart3,
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
import type { User, UserRole } from '@/types';
import { ChatWidget } from '@/components/chat/ChatWidget';

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
        icon: BarChart3,
        roles: ['super_admin'],
    },
    {
        title: 'Batches',
        href: '/dashboard/batches',
        icon: CalendarCheck,
        roles: ['super_admin', 'institution_director', 'staff_manager'], // Manage batches: staff_manager+
    },
    {
        title: 'Students',
        href: '/dashboard/students',
        icon: GraduationCap,
        roles: ['institution_director', 'staff_manager', 'receptionist'], // Accountants and receptionists can manage students
    },
    {
        title: 'Payments',
        href: '/dashboard/payments',
        icon: Wallet,
        roles: ['institution_director', 'staff_manager', 'receptionist'], // Receptionists, accountants, and directors can record payments
    },
    {
        title: 'Staff',
        href: '/dashboard/staff',
        icon: Users,
        roles: ['institution_director'], // Only franchise admin can manage staff
    },
    {
        title: 'Attendance',
        href: '/dashboard/attendance',
        icon: CalendarCheck,
        roles: ['institution_director', 'staff_manager', 'staff'], // All staff can mark attendance
    },
    {
        title: 'Payroll',
        href: '/dashboard/payroll',
        icon: Wallet,
        roles: ['institution_director', 'staff_manager', 'staff'], // All can view their own payroll
    },
    {
        title: 'Certificates',
        href: '/dashboard/certificates',
        icon: Award,
        roles: ['institution_director', 'staff_manager'],
    },
    {
        title: 'Exams',
        href: '/dashboard/exams',
        icon: ClipboardList,
        roles: ['super_admin', 'institution_director', 'staff_manager', 'student'],
    },
];

/** Institution name for the sidebar masthead; the user object may carry it once the API provides it. */
function getInstitutionName(user: User | null): string {
    const withName = user as (User & { institution_name?: string | null }) | null;
    return withName?.institution_name || 'RTS Education';
}

function usePageTitle(): string {
    const pathname = usePathname();
    // Longest matching nav href wins (e.g. /dashboard/students/123 → "Students").
    const match = navItems
        .filter((item) => pathname === item.href || pathname.startsWith(item.href + '/'))
        .sort((a, b) => b.href.length - a.href.length)[0];
    return match?.title ?? 'Dashboard';
}

function NavLink({ item, onClick }: { item: NavItem; onClick?: () => void }) {
    const pathname = usePathname();
    const isActive =
        pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            onClick={onClick}
            className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                    ? 'bg-accent-soft text-primary font-medium'
                    : 'text-ink-muted font-normal hover:bg-muted hover:text-ink'
            )}
        >
            <Icon className="h-4 w-4" />
            {item.title}
        </Link>
    );
}

function Sidebar({ onNavClick }: { onNavClick?: () => void }) {
    const { user, hasRole } = useAuth();
    const institutionName = getInstitutionName(user);

    const filteredNavItems = navItems.filter(
        (item) => !item.roles || item.roles.some((role) => hasRole(role))
    );

    return (
        <div className="flex h-full flex-col bg-surface border-r border-line">
            {/* Masthead: the institution's own name */}
            <div className="flex min-h-16 flex-col justify-center border-b border-line px-5 py-3">
                <span className="font-serif text-base font-semibold leading-snug text-ink">
                    {institutionName}
                </span>
                <span className="text-[11px] uppercase tracking-widest text-ink-muted mt-0.5">
                    Institution portal
                </span>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
                {filteredNavItems.map((item) => (
                    <NavLink key={item.href} item={item} onClick={onNavClick} />
                ))}
            </nav>

            {/* User info + provenance */}
            <div className="border-t border-line p-4">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted text-ink text-sm">
                            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{user?.full_name}</p>
                        <p className="text-xs capitalize text-ink-muted">
                            {user?.role?.replace('_', ' ')}
                        </p>
                    </div>
                </div>
                <p className="mt-3 text-[11px] text-ink-muted">Powered by RTS</p>
            </div>
        </div>
    );
}

function Header() {
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pageTitle = usePageTitle();

    return (
        <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-line bg-surface px-4 lg:px-6">
            <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild className="lg:hidden">
                        <Button variant="ghost" size="icon" className="text-ink-muted hover:text-ink">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[232px] border-r border-line bg-surface p-0">
                        <Sidebar onNavClick={() => setMobileMenuOpen(false)} />
                    </SheetContent>
                </Sheet>

                {/* Page title (serif) */}
                <h1 className="font-serif text-lg font-semibold text-ink">{pageTitle}</h1>
            </div>

            {/* User menu */}
            <div className="flex items-center gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center gap-2 text-ink">
                            <Avatar className="h-7 w-7">
                                <AvatarFallback className="bg-muted text-ink text-sm">
                                    {user?.full_name?.charAt(0).toUpperCase() || 'U'}
                                </AvatarFallback>
                            </Avatar>
                            <span className="hidden text-sm font-medium md:block">
                                {user?.full_name}
                            </span>
                            <ChevronDown className="h-4 w-4 text-ink-muted" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 border-line bg-surface">
                        <div className="px-2 py-1.5">
                            <p className="text-sm font-medium text-ink">{user?.full_name}</p>
                            <p className="text-xs text-ink-muted">{user?.email}</p>
                        </div>
                        <DropdownMenuSeparator className="bg-line" />
                        <DropdownMenuItem onClick={logout} className="cursor-pointer text-danger">
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
        <div className="flex h-screen bg-paper">
            {/* Desktop Sidebar — 232px */}
            <aside className="hidden lg:flex lg:w-[232px] lg:flex-col">
                <Sidebar />
            </aside>

            {/* Main content */}
            <div className="flex flex-1 flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto bg-paper">
                    <div className="mx-auto w-full max-w-[1200px] p-6">{children}</div>
                </main>
            </div>

            {/* Chat Widget */}
            <ChatWidget />
        </div>
    );
}
