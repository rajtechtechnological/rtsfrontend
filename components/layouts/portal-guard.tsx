'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/auth-context';
import { homePathForRole } from '@/lib/auth/roles';
import type { UserRole } from '@/types';

/**
 * Client-side gate for the role portals (/student, /staff). Unauthenticated
 * visitors go to /login; authenticated users of the wrong role go to their
 * own portal.
 */
export function PortalGuard({
    allow,
    children,
}: {
    allow: UserRole[];
    children: React.ReactNode;
}) {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    const allowed = !!user && allow.includes(user.role);

    useEffect(() => {
        if (isLoading) return;
        if (!isAuthenticated) {
            router.replace('/login');
        } else if (user && !allowed) {
            router.replace(homePathForRole(user.role));
        }
    }, [isLoading, isAuthenticated, user, allowed, router]);

    if (isLoading || !allowed) {
        return <div className="flex h-screen items-center justify-center bg-paper" />;
    }

    return <>{children}</>;
}
