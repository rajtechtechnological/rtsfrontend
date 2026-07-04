'use client';

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, BarChart3, PieChart, Clock } from 'lucide-react';

export default function AnalyticsPage() {
    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <Card className="bg-surface border-line max-w-2xl w-full">
                <CardContent className="p-12 text-center">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="absolute inset-0 bg-accent-soft rounded-full blur-xl opacity-50 animate-pulse"></div>
                            <div className="relative bg-accent-soft p-6 rounded-full">
                                <TrendingUp className="h-12 w-12 text-ink" />
                            </div>
                        </div>
                    </div>
                    
                    <h1 className="text-4xl font-bold text-ink mb-4">
                        Analytics Dashboard
                    </h1>
                    
                    <div className="flex items-center justify-center gap-2 mb-6">
                        <Clock className="h-5 w-5 text-ink-muted" />
                        <p className="text-xl text-ink-muted">
                            Coming Soon
                        </p>
                    </div>
                    
                    <p className="text-ink-muted mb-8 max-w-md mx-auto">
                        We're developing advanced analytics and insights. 
                        Get detailed trends, performance metrics, and data-driven insights for your institutions.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        <div className="bg-muted rounded-lg p-4">
                            <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
                            <p className="text-sm text-ink-muted">Performance Metrics</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                            <PieChart className="h-6 w-6 text-primary mx-auto mb-2" />
                            <p className="text-sm text-ink-muted">Data Visualization</p>
                        </div>
                        <div className="bg-muted rounded-lg p-4">
                            <TrendingUp className="h-6 w-6 text-success mx-auto mb-2" />
                            <p className="text-sm text-ink-muted">Growth Insights</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

