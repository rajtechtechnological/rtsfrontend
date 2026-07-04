'use client';

import { PortalGuard } from '@/components/layouts/portal-guard';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
    return <PortalGuard allow={['student']}>{children}</PortalGuard>;
}
