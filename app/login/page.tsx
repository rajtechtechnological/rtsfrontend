'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    GraduationCap,
    Building2,
    Users,
    Briefcase,
    Eye,
    EyeOff,
    Loader2,
    ArrowLeft,
    ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/auth-context';

const loginTypes = [
    {
        id: 'franchise',
        label: 'Franchise Admin',
        description: 'Manage your franchise center',
        icon: Building2,
        color: 'from-green-600 to-green-700',
        bgColor: 'bg-green-600/10',
        borderColor: 'border-green-600/30',
        textColor: 'text-green-500',
    },
    {
        id: 'director',
        label: 'Director',
        description: 'Oversee all franchises',
        icon: Briefcase,
        color: 'from-red-600 to-red-700',
        bgColor: 'bg-red-600/10',
        borderColor: 'border-red-600/30',
        textColor: 'text-red-400',
    },
    {
        id: 'student',
        label: 'Student',
        description: 'Access your courses & certificates',
        icon: GraduationCap,
        color: 'from-green-600 to-emerald-600',
        bgColor: 'bg-green-600/10',
        borderColor: 'border-green-600/30',
        textColor: 'text-green-500',
    },
    {
        id: 'staff',
        label: 'Staff',
        description: 'View attendance & payroll',
        icon: Users,
        color: 'from-red-600 to-rose-600',
        bgColor: 'bg-red-600/10',
        borderColor: 'border-red-600/30',
        textColor: 'text-red-400',
    },
];

const loginSchema = z.object({
    email: z.string().email('Please enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { login, isAuthenticated } = useAuth();

    const [selectedType, setSelectedType] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const type = searchParams.get('type');
        if (type && loginTypes.find(t => t.id === type)) {
            setSelectedType(type);
        }
    }, [searchParams]);

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

    const selectedLoginType = loginTypes.find(t => t.id === selectedType);

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            // Mock login for now
            console.log('Login attempt:', { ...data, type: selectedType });
            await new Promise(resolve => setTimeout(resolve, 1500));

            // For demo, simulate successful login
            localStorage.setItem('access_token', 'demo_token');
            localStorage.setItem('user', JSON.stringify({
                id: '1',
                email: data.email,
                full_name: 'Demo User',
                role: selectedType === 'franchise' ? 'institution_director' :
                    selectedType === 'director' ? 'super_admin' :
                        selectedType === 'student' ? 'student' : 'staff',
            }));

            toast.success('Login successful!');

            // Redirect based on role
            if (selectedType === 'student') {
                router.push('/student');
            } else if (selectedType === 'staff') {
                router.push('/staff');
            } else {
                router.push('/dashboard');
            }
        } catch {
            toast.error('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    // Role selection screen
    if (!selectedType) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
                {/* Background Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-600/20 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/15 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 w-full max-w-4xl">
                    {/* Back to Home */}
                    <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>

                    <div className="text-center mb-10">
                        <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
                            <div className="relative p-2 bg-slate-900 rounded-xl border border-white/10 shadow-lg shadow-green-900/10 group-hover:border-green-500/30 transition-colors">
                                <Image
                                    src="/logo-v2.png"
                                    alt="RTS Logo"
                                    width={48}
                                    height={48}
                                    className="h-12 w-auto object-contain"
                                />
                            </div>
                            <div className="text-left">
                                <span className="text-2xl font-bold text-white block tracking-wide leading-none">RAJTECH</span>
                                <span className="text-[10px] text-green-400 font-medium tracking-widest uppercase block mt-1">Technological Systems</span>
                            </div>
                        </Link>
                        <h1 className="text-3xl font-bold text-white mb-3">Welcome Back</h1>
                        <p className="text-slate-400">Select your portal to continue</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {loginTypes.map((type) => {
                            const Icon = type.icon;
                            return (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`group relative p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all duration-300 hover:shadow-xl text-left overflow-hidden`}
                                >
                                    {/* Gradient hover effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${type.color} opacity-0 group-hover:opacity-10 transition-opacity`} />

                                    <div className="relative z-10 flex items-start gap-4">
                                        <div className={`p-3 rounded-xl ${type.bgColor} ${type.borderColor} border`}>
                                            <Icon className={`h-6 w-6 ${type.textColor}`} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-white group-hover:text-white mb-1 flex items-center">
                                                {type.label}
                                                <ChevronRight className="h-4 w-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                            </h3>
                                            <p className="text-sm text-slate-400">{type.description}</p>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    // Login form screen
    const IconComponent = selectedLoginType?.icon || GraduationCap;

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
            {/* Background Effects */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-green-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600/15 rounded-full blur-3xl" />
            </div>

            <Card className="relative z-10 w-full max-w-md bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
                <CardHeader className="text-center pb-0">
                    {/* Back button */}
                    <button
                        onClick={() => setSelectedType(null)}
                        className="absolute left-6 top-6 text-slate-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${selectedLoginType?.color} flex items-center justify-center mb-4 shadow-xl`}>
                        <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-2xl text-white">
                        {selectedLoginType?.label} Login
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                        {selectedLoginType?.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">
                                Email Address
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-green-500 h-12"
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-sm text-red-400">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">
                                Password
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 pr-12 focus:border-green-500 h-12"
                                    {...register('password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-400">{errors.password.message}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 text-slate-400">
                                <input type="checkbox" className="rounded bg-slate-800 border-slate-700" />
                                Remember me
                            </label>
                            <Link href="/forgot-password" className="text-green-400 hover:text-green-300">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full h-12 bg-gradient-to-r ${selectedLoginType?.color} hover:opacity-90 text-white font-semibold shadow-lg transition-all`}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <ChevronRight className="h-5 w-5 ml-2" />
                                </>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-green-500" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
