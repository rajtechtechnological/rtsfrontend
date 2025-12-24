'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            {/* Background effects - Green/Red theme */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-600/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-red-600/15 rounded-full blur-3xl" />
            </div>

            <div className="relative z-10 w-full max-w-md">
                {/* Back to Home */}
                <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                </Link>

                <Card className="w-full bg-slate-900/80 backdrop-blur-xl border-slate-800 shadow-2xl">
                    <CardHeader className="text-center space-y-4">
                        {/* Logo */}
                        <Link href="/" className="flex justify-center">
                            <div className="relative p-2 bg-slate-900 rounded-xl border border-white/10 shadow-lg shadow-green-900/10 hover:border-green-500/30 transition-colors">
                                <Image
                                    src="/logo-v2.png"
                                    alt="RTS Logo"
                                    width={48}
                                    height={48}
                                    className="h-12 w-auto object-contain"
                                />
                            </div>
                        </Link>
                        <div>
                            <CardTitle className="text-2xl font-bold text-white">
                                Registration Disabled
                            </CardTitle>
                            <CardDescription className="text-slate-400 mt-2">
                                Public registration is currently disabled
                            </CardDescription>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-6 py-8">
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 space-y-3">
                            <h3 className="text-amber-400 font-semibold flex items-center gap-2">
                                <GraduationCap className="h-5 w-5" />
                                How to Register
                            </h3>
                            <ul className="space-y-2 text-slate-300 text-sm">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span><strong>Students:</strong> Contact your franchise administrator to get registered</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span><strong>Staff:</strong> Your franchise administrator will create your account</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-400 mt-1">•</span>
                                    <span><strong>Franchise Admins:</strong> The system director will register your franchise</span>
                                </li>
                            </ul>
                        </div>

                        <div className="text-center text-slate-400 text-sm">
                            <p>This is a hierarchical system:</p>
                            <p className="mt-2 text-slate-300">
                                Director → Franchises → Staff & Students
                            </p>
                        </div>
                    </CardContent>

                    <CardFooter className="flex flex-col gap-4 pb-8">
                        <p className="text-sm text-slate-400 text-center">
                            Already have an account?{' '}
                            <Link
                                href="/login"
                                className="text-green-400 hover:text-green-300 font-medium transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                        <Button
                            onClick={() => router.push('/')}
                            variant="outline"
                            className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Home
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
