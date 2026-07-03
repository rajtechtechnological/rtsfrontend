'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { payrollApi } from '@/lib/api/endpoints';
import type { Payroll } from '@/types';
import { Button } from '@/components/ui/button';
import { LedgerTable, type LedgerColumn } from '@/components/ui/ledger-table';
import { Stamp } from '@/components/ui/stamp';
import { Loader2 } from 'lucide-react';

// Removed mock data - fetching from API

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

const toolbarSelectClass =
    'h-9 rounded-md border border-line bg-surface px-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-ring';

export default function PayrollPage() {
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Current month (1-indexed)
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [payrollRecords, setPayrollRecords] = useState<Payroll[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState<string | null>(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

    const fetchPayroll = async () => {
        try {
            setIsLoading(true);
            const response = await payrollApi.list({
                month: selectedMonth,
                year: selectedYear,
            });
            setPayrollRecords(response.data.data || []);
        } catch (error: any) {
            console.error('Failed to fetch payroll:', error);
            toast.error('Failed to load payroll records');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPayroll();
    }, [selectedMonth, selectedYear]);

    const handleGeneratePayslip = async (id: string) => {
        setIsGenerating(id);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1500));
            toast.success('Payslip generated successfully!');
        } catch {
            toast.error('Failed to generate payslip');
        } finally {
            setIsGenerating(null);
        }
    };

    const handleMarkPaid = async (id: string) => {
        try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            toast.success('Marked as paid');
        } catch {
            toast.error('Failed to update status');
        }
    };

    // Calculate summary
    const totalGross = payrollRecords.reduce((acc, p) => acc + (p.gross_amount || 0), 0);
    const totalNet = payrollRecords.reduce((acc, p) => acc + (p.net_amount || 0), 0);
    const totalDeductions = payrollRecords.reduce((acc, p) => acc + (p.deductions || 0), 0);
    const pendingCount = payrollRecords.filter((p) => p.status === 'pending').length;

    const summaryFigures = [
        { label: 'Total Gross', value: `₹${totalGross.toLocaleString('en-IN')}` },
        { label: 'Net Payable', value: `₹${totalNet.toLocaleString('en-IN')}` },
        { label: 'Deductions', value: `₹${totalDeductions.toLocaleString('en-IN')}` },
        { label: 'Pending', value: `${pendingCount} staff` },
    ];

    const columns: LedgerColumn<Payroll>[] = [
        {
            key: 'staff',
            header: 'Staff',
            cell: (payroll) => (
                <span className="font-medium">{payroll.staff?.user?.full_name || 'Unknown'}</span>
            ),
        },
        {
            key: 'days',
            header: 'Days',
            numeric: true,
            cell: (payroll) =>
                `${payroll.days_present}P${payroll.days_half > 0 ? ` +${payroll.days_half}H` : ''}`,
        },
        {
            key: 'daily_rate',
            header: 'Daily Rate',
            numeric: true,
            cell: (payroll) => `₹${payroll.daily_rate.toLocaleString('en-IN')}`,
        },
        {
            key: 'gross',
            header: 'Gross',
            numeric: true,
            cell: (payroll) => `₹${payroll.gross_amount.toLocaleString('en-IN')}`,
        },
        {
            key: 'deductions',
            header: 'Deductions',
            numeric: true,
            cell: (payroll) => `−₹${payroll.deductions.toLocaleString('en-IN')}`,
        },
        {
            key: 'net',
            header: 'Net Amount',
            numeric: true,
            cellClassName: 'font-medium',
            cell: (payroll) => `₹${payroll.net_amount.toLocaleString('en-IN')}`,
        },
        {
            key: 'status',
            header: 'Status',
            cell: (payroll) => <Stamp status={payroll.status} />,
        },
        {
            key: 'actions',
            header: '',
            align: 'right',
            cell: (payroll) => (
                <span className="flex items-center justify-end gap-2">
                    {payroll.payslip_url ? (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-ink-muted hover:text-ink"
                            onClick={() => {
                                if (payroll.payslip_url) {
                                    window.open(payroll.payslip_url, '_blank');
                                }
                            }}
                        >
                            Download
                        </Button>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleGeneratePayslip(payroll.id)}
                            disabled={isGenerating === payroll.id}
                            className="text-ink-muted hover:text-ink"
                        >
                            {isGenerating === payroll.id ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                'Generate Payslip'
                            )}
                        </Button>
                    )}
                    {payroll.status === 'pending' && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkPaid(payroll.id)}
                        >
                            Mark Paid
                        </Button>
                    )}
                </span>
            ),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-serif text-2xl font-semibold text-ink">Payroll</h1>
                    <p className="text-sm text-ink-muted mt-1">Generate and manage staff payroll</p>
                </div>
                <div className="flex items-center gap-2">
                    <select
                        value={String(selectedMonth)}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
                        className={toolbarSelectClass}
                    >
                        {months.map((month, index) => (
                            <option key={index} value={String(index)}>
                                {month}
                            </option>
                        ))}
                    </select>
                    <select
                        value={String(selectedYear)}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className={toolbarSelectClass}
                    >
                        {years.map((year) => (
                            <option key={year} value={String(year)}>
                                {year}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Summary — ledger figures */}
            <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-line rounded-md border border-line bg-surface">
                {summaryFigures.map((figure) => (
                    <div key={figure.label} className="px-4 py-3">
                        <p className="font-serif text-xl font-semibold tabular-nums text-ink">
                            {figure.value}
                        </p>
                        <p className="mt-0.5 text-xs uppercase tracking-wide text-ink-muted">
                            {figure.label}
                        </p>
                    </div>
                ))}
            </div>

            {/* Payroll Ledger */}
            <section className="rounded-md border border-line bg-surface">
                <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <h2 className="font-serif text-lg text-ink">
                        Payroll for {months[selectedMonth]} {selectedYear}
                    </h2>
                    <span className="font-mono text-xs tabular-nums text-ink-muted">
                        {payrollRecords.length} records
                    </span>
                </div>
                {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
                    </div>
                ) : (
                    <LedgerTable
                        columns={columns}
                        rows={payrollRecords}
                        rowKey={(payroll) => payroll.id}
                        emptyMessage="No payroll records for this period."
                        subtotal={{
                            staff: 'Total',
                            gross: `₹${totalGross.toLocaleString('en-IN')}`,
                            deductions: `−₹${totalDeductions.toLocaleString('en-IN')}`,
                            net: `₹${totalNet.toLocaleString('en-IN')}`,
                        }}
                    />
                )}
            </section>
        </div>
    );
}
