import type { UserRole } from '@/types';

/**
 * Where each role lands after login (docs/05 §3): the role comes from the
 * authenticated user object, never from user choice.
 */
export function homePathForRole(role: UserRole): string {
    switch (role) {
        case 'student':
            return '/student';
        case 'staff':
            return '/staff';
        default:
            return '/dashboard';
    }
}
