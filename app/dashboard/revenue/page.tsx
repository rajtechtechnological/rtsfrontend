'use client';

import { Card, CardContent } from '@/components/ui/card';
import { IndianRupee, TrendingUp, Clock } from 'lucide-react';

export default function RevenuePage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Card className="bg-surface border-line max-w-2xl w-full">
                <CardContent className="p-12 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent-soft rounded-full blur-xl opacity-50 animate-pulse"></div>
                            <div className="relative bg-accent-soft p-6 rounded-full">
                                <IndianRupee className="h-12 w-12 text-ink" />
                            </div>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-ink mb-4">
                        Revenue Reports
                    </h1>
                    
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Clock className="h-5 w-5 text-ink-muted" />
                        <p className="text-xl text-ink-muted">
                            Coming Soon
                        </p>
                    </div>
                    
                    <p className="text-ink-muted mb-8 max-w-md mx-auto">
                        We're building comprehensive revenue analytics and financial reports. 
                        Track income, expenses, and profitability across all your franchises.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="bg-muted rounded-lg p-4">
                            <TrendingUp className="h-6 w-6 text-success mx-auto mb-2" />
                            <p className="text-sm text-ink-muted">Revenue Trends</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                            <IndianRupee className="h-6 w-6 text-primary mx-auto mb-2" />
                            <p className="text-sm text-ink-muted">Financial Reports</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                            <TrendingUp className="h-6 w-6 text-warning mx-auto mb-2" />
                            <p className="text-sm text-ink-muted">Profit Analysis</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

