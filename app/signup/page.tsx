import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const metadata = {
    title: 'Account Creation — RTS Education',
};

export default function SignupPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-paper p-4">
            <div className="w-full max-w-md rounded-md border border-line bg-surface p-8 text-center shadow-sm">
                <h1 className="font-serif text-2xl font-semibold text-ink">
                    Account creation is handled by your institution
                </h1>
                <p className="mt-4 text-sm leading-6 text-ink-muted">
                    There is no public self-registration. Students and staff receive
                    their accounts from their institution&apos;s office; franchise
                    accounts are issued by the RTS head office.
                </p>
                <div className="mt-8">
                    <Link href="/login">
                        <Button className="w-full">Sign in to your institution</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
