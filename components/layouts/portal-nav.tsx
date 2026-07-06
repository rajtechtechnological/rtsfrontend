'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Home, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth/auth-context';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ui/theme-toggle';

interface PortalNavLink {
    href: string;
    label: string;
}

/**
 * Top bar for the role portals (/student, /staff): institution crest,
 * portal name in serif, optional section links, Home, and a REAL sign-out
 * (revokes the refresh token via the auth context — never a bare link).
 */
export function PortalNav({ title, links = [] }: { title: string; links?: PortalNavLink[] }) {
    const { user, logout } = useAuth();
    const pathname = usePathname();

    const initials = (user?.full_name || 'U')
        .split(' ')
        .map((part) => part.charAt(0))
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <nav className="sticky top-0 z-40 border-b border-line bg-surface">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-3">
                        <Image
                            src="/logo-v2.png"
                            alt="RTS crest"
                            width={32}
                            height={32}
                            className="h-8 w-auto object-contain"
                        />
                        <span className="font-serif text-base font-semibold text-ink">{title}</span>
                    </Link>

                    <div className="hidden items-center gap-1 sm:flex">
                        {links.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={cn(
                                    'rounded-md px-3 py-1.5 text-sm transition-colors',
                                    pathname === link.href
                                        ? 'bg-accent-soft font-medium text-primary'
                                        : 'text-ink-muted hover:bg-muted hover:text-ink'
                                )}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-ink-muted transition-colors hover:bg-muted hover:text-ink"
                    >
                        <Home className="h-4 w-4" />
                        <span className="hidden sm:inline">Home</span>
                    </Link>
                    <ThemeToggle />
                    <div className="mx-1 hidden items-center gap-2 sm:flex">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-muted text-sm text-ink">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <span className="hidden max-w-40 truncate text-sm font-medium text-ink md:block">
                            {user?.full_name}
                        </span>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={logout}
                        className="text-ink-muted hover:text-danger"
                    >
                        <LogOut className="h-4 w-4" />
                        <span className="hidden sm:inline">Sign out</span>
                    </Button>
                </div>
            </div>
        </nav>
    );
}
