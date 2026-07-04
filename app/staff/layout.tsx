'use client';

import { PortalGuard } from '@/components/layouts/portal-guard';

export default function StaffLayout({ children }: { children: React.ReactNode }) {
    return (
        <PortalGuard
            allow={['staff', 'staff_manager', 'receptionist', 'institution_director', 'super_admin']}
        >
            {children}
        </PortalGuard>
    );
}
