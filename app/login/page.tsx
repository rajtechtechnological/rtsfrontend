'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            await login(data);

            toast.success('Login successful!');

            // Role comes from the authenticated user object, not user choice.
            const userStr = localStorage.getItem('user');
            if (userStr) {
                const user = JSON.parse(userStr);

                if (user.role === 'student') {
                    router.push('/student');
                } else if (user.role === 'staff') {
                    router.push('/staff');
                } else {
                    router.push('/dashboard');
                }
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : null;
            toast.error(message || 'Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm">
                {/* Crest / institution name */}
                <Link href="/" className="flex flex-col items-center gap-3 mb-8">
                    <Image
                        src="/logo-v2.png"
                        alt="RTS crest"
                        width={56}
                        height={56}
                        className="h-14 w-auto object-contain"
                    />
                    <span className="text-center">
                        <span className="block font-serif text-lg font-semibold text-ink leading-tight">
                            Rajtech Technological Systems
                        </span>
                        <span className="block text-[11px] uppercase tracking-widest text-ink-muted mt-1">
                            Computer Education
                        </span>
                    </span>
                </Link>

                <Card className="bg-surface border-line rounded-md shadow-sm">
                    <CardHeader className="text-center">
                        <CardTitle className="font-serif text-2xl font-semibold text-ink">
                            Sign in to your institution
                        </CardTitle>
                        <CardDescription className="text-ink-muted">
                            Use the email and password issued by your institution.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                            <div className="space-y-2">
                                <Label
                                    htmlFor="email"
                                    className="text-xs uppercase tracking-wide text-ink-muted"
                                >
                                    Email address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    {...register('email')}
                                />
                                {errors.email && (
                                    <p className="text-sm text-danger">{errors.email.message}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="password"
                                    className="text-xs uppercase tracking-wide text-ink-muted"
                                >
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        className="pr-10"
                                        {...register('password')}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink transition-colors"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-sm text-danger">{errors.password.message}</p>
                                )}
                            </div>

                            <Button type="submit" disabled={isLoading} className="w-full">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign in'
                                )}
                            </Button>

                            <div className="text-center text-sm">
                                <Link
                                    href="/forgot-password"
                                    className="text-primary hover:underline underline-offset-4"
                                >
                                    Forgot password?
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <p className="mt-8 text-center text-xs text-ink-muted">
                    Powered by RTS — Rajtech Technological Systems
                </p>
            </div>
        </div>
    );
}
