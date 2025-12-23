'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Wallet,
    Download,
    FileText,
    IndianRupee,
    Calculator,
    CheckCircle2,
    Clock,
    Loader2,
    Eye,
} from 'lucide-react';

// Mock data for payroll
const mockPayroll = [
    {
        id: '1',
        staff_name: 'Meera Iyer',
        month: 11,
        year: 2024,
        days_present: 22,
        days_half: 2,
        daily_rate: 1200,
        gross_amount: 27600,
        deductions: 1000,
        net_amount: 26600,
        status: 'paid',
        payslip_generated: true,
    },
    {
        id: '2',
        staff_name: 'Rajesh Kumar',
        month: 11,
        year: 2024,
        days_present: 20,
        days_half: 1,
        daily_rate: 800,
        gross_amount: 16400,
        deductions: 500,
        net_amount: 15900,
        status: 'pending',
        payslip_generated: false,
    },
    {
        id: '3',
        staff_name: 'Sunita Devi',
        month: 11,
        year: 2024,
        days_present: 24,
        days_half: 0,
        daily_rate: 900,
        gross_amount: 21600,
        deductions: 800,
        net_amount: 20800,
        status: 'paid',
        payslip_generated: true,
    },
    {
        id: '4',
        staff_name: 'Kiran Rao',
        month: 11,
        year: 2024,
        days_present: 18,
        days_half: 0,
        daily_rate: 750,
        gross_amount: 13500,
        deductions: 400,
        net_amount: 13100,
        status: 'pending',
        payslip_generated: false,
    },
];

const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
];

export default function PayrollPage() {
    const [selectedMonth, setSelectedMonth] = useState(10); // November (0-indexed)
    const [selectedYear, setSelectedYear] = useState(2024);
    const [isGenerating, setIsGenerating] = useState<string | null>(null);

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

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
    const totalGross = mockPayroll.reduce((acc, p) => acc + p.gross_amount, 0);
    const totalNet = mockPayroll.reduce((acc, p) => acc + p.net_amount, 0);
    const totalDeductions = mockPayroll.reduce((acc, p) => acc + p.deductions, 0);
    const pendingCount = mockPayroll.filter((p) => p.status === 'pending').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Wallet className="h-7 w-7 text-amber-400" />
                        Payroll Management
                    </h1>
                    <p className="text-slate-400 mt-1">Generate and manage staff payroll</p>
                </div>
                <div className="flex items-center gap-2">
                    <Select
                        value={String(selectedMonth)}
                        onValueChange={(value) => setSelectedMonth(Number(value))}
                    >
                        <SelectTrigger className="w-[140px] bg-slate-800/50 border-slate-700 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800">
                            {months.map((month, index) => (
                                <SelectItem key={index} value={String(index)} className="text-white hover:bg-slate-800">
                                    {month}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select
                        value={String(selectedYear)}
                        onValueChange={(value) => setSelectedYear(Number(value))}
                    >
                        <SelectTrigger className="w-[100px] bg-slate-800/50 border-slate-700 text-white">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800">
                            {years.map((year) => (
                                <SelectItem key={year} value={String(year)} className="text-white hover:bg-slate-800">
                                    {year}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-amber-500/10">
                            <IndianRupee className="h-6 w-6 text-amber-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Total Gross</p>
                            <p className="text-2xl font-bold text-white">₹{totalGross.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-emerald-500/10">
                            <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Net Payable</p>
                            <p className="text-2xl font-bold text-white">₹{totalNet.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-red-500/10">
                            <Calculator className="h-6 w-6 text-red-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Deductions</p>
                            <p className="text-2xl font-bold text-white">₹{totalDeductions.toLocaleString()}</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-blue-500/10">
                            <Clock className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-400">Pending</p>
                            <p className="text-2xl font-bold text-white">{pendingCount} staff</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Payroll Table */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white">
                        Payroll for {months[selectedMonth]} {selectedYear}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400">Staff</TableHead>
                                    <TableHead className="text-slate-400">Days</TableHead>
                                    <TableHead className="text-slate-400">Daily Rate</TableHead>
                                    <TableHead className="text-slate-400">Gross</TableHead>
                                    <TableHead className="text-slate-400">Deductions</TableHead>
                                    <TableHead className="text-slate-400">Net Amount</TableHead>
                                    <TableHead className="text-slate-400">Status</TableHead>
                                    <TableHead className="text-slate-400 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mockPayroll.map((payroll) => (
                                    <TableRow
                                        key={payroll.id}
                                        className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                                    >
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10 ring-2 ring-amber-500/20">
                                                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                                                        {payroll.staff_name
                                                            .split(' ')
                                                            .map((n) => n[0])
                                                            .join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <p className="font-medium text-white">{payroll.staff_name}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-white">
                                                <span className="text-emerald-400">{payroll.days_present}P</span>
                                                {payroll.days_half > 0 && (
                                                    <span className="text-amber-400 ml-1">+{payroll.days_half}H</span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-white">
                                            ₹{payroll.daily_rate.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-white font-medium">
                                            ₹{payroll.gross_amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-red-400">
                                            -₹{payroll.deductions.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-emerald-400 font-semibold">
                                            ₹{payroll.net_amount.toLocaleString()}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                className={
                                                    payroll.status === 'paid'
                                                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                        : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                                                }
                                            >
                                                {payroll.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {payroll.payslip_generated ? (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                    >
                                                        <Download className="h-4 w-4 mr-1" />
                                                        Download
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleGeneratePayslip(payroll.id)}
                                                        disabled={isGenerating === payroll.id}
                                                        className="text-slate-400 hover:text-white hover:bg-slate-800"
                                                    >
                                                        {isGenerating === payroll.id ? (
                                                            <>
                                                                <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                                Generating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <FileText className="h-4 w-4 mr-1" />
                                                                Generate
                                                            </>
                                                        )}
                                                    </Button>
                                                )}
                                                {payroll.status === 'pending' && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleMarkPaid(payroll.id)}
                                                        className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                                                    >
                                                        <CheckCircle2 className="h-4 w-4 mr-1" />
                                                        Mark Paid
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
