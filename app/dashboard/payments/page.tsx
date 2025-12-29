'use client';

import { useState, useEffect } from 'react';
import { paymentsApi, studentsApi, coursesApi } from '@/lib/api/endpoints';
import type { FeePayment, Student, Course, RecordPaymentRequest } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
    Wallet,
    Plus,
    X,
    Download,
    Loader2,
    Search,
    Receipt,
} from 'lucide-react';
import { toast } from 'sonner';

export default function PaymentsPage() {
    const [payments, setPayments] = useState<FeePayment[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState<RecordPaymentRequest>({
        student_id: '',
        course_id: '',
        amount: 0,
        payment_method: 'cash',
        transaction_id: '',
        notes: '',
    });
    const [filterStudentId, setFilterStudentId] = useState<string>('');

    // New fields for student ID and name input
    const [studentIdInput, setStudentIdInput] = useState('');
    const [studentNameInput, setStudentNameInput] = useState('');
    const [foundStudent, setFoundStudent] = useState<Student | null>(null);
    const [studentCourses, setStudentCourses] = useState<Course[]>([]);
    const [searchError, setSearchError] = useState('');

    useEffect(() => {
        loadData();
    }, [filterStudentId]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [paymentsRes, studentsRes, coursesRes] = await Promise.all([
                paymentsApi.list({ student_id: filterStudentId || undefined }),
                studentsApi.list({}),
                coursesApi.list(),
            ]);
            setPayments(paymentsRes.data);
            setStudents(studentsRes.data.data || []);
            setCourses(coursesRes.data);
        } catch (error) {
            console.error('Error loading data:', error);
            toast.error('Failed to load payment data');
        } finally {
            setLoading(false);
        }
    };

    const handleSearchStudent = async () => {
        if (!studentIdInput.trim()) {
            setSearchError('Please enter student ID');
            return;
        }

        try {
            setSearchError('');
            const studentRes = await studentsApi.search(studentIdInput.trim());
            const student = studentRes.data;

            // Verify name matches (optional - for confirmation)
            if (studentNameInput.trim() && student.user?.full_name.toLowerCase() !== studentNameInput.trim().toLowerCase()) {
                setSearchError('Student name does not match. Please verify.');
                return;
            }

            setFoundStudent(student);
            setFormData({ ...formData, student_id: student.id });

            // Load student's enrolled courses
            const coursesRes = await studentsApi.getCourses(student.id);
            setStudentCourses(coursesRes.data);

            toast.success(`Student found: ${student.user?.full_name}`);
        } catch (error: any) {
            console.error('Error searching student:', error);
            setSearchError(error.response?.data?.detail || 'Student not found');
            setFoundStudent(null);
            setStudentCourses([]);
            toast.error('Student not found with this ID');
        }
    };

    const resetForm = () => {
        setFormData({
            student_id: '',
            course_id: '',
            amount: 0,
            payment_method: 'cash',
            transaction_id: '',
            notes: '',
        });
        setFoundStudent(null);
        setStudentIdInput('');
        setStudentNameInput('');
        setStudentCourses([]);
        setSearchError('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!foundStudent) {
            toast.error('Please search and select a student first');
            return;
        }

        try {
            await paymentsApi.create(formData);
            toast.success('Payment recorded successfully!');
            setShowForm(false);
            resetForm();
            loadData();
        } catch (error: any) {
            console.error('Error recording payment:', error);
            toast.error(error.response?.data?.detail || 'Failed to record payment');
        }
    };

    const handleDownloadReceipt = async (paymentId: string, receiptNumber: string) => {
        try {
            const response = await paymentsApi.downloadReceipt(paymentId);
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `Receipt_${receiptNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            toast.success('Receipt downloaded successfully');
        } catch (error) {
            console.error('Error downloading receipt:', error);
            toast.error('Failed to download receipt');
        }
    };

    const getStudentName = (studentId: string) => {
        const student = students.find(s => s.id === studentId);
        return student?.user?.full_name || 'Unknown';
    };

    const getCourseName = (courseId: string) => {
        const course = courses.find(c => c.id === courseId);
        return course?.name || 'Unknown';
    };

    const requiresTransactionId = (method: string) => {
        return ['online', 'upi', 'card'].includes(method);
    };

    const getPaymentMethodBadge = (method: string) => {
        const config: Record<string, { className: string }> = {
            online: { className: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
            upi: { className: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
            card: { className: 'bg-pink-500/10 text-pink-400 border-pink-500/30' },
            cash: { className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
            bank_transfer: { className: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
            offline: { className: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
        };
        const methodConfig = config[method] || config.offline;
        return <Badge className={methodConfig.className}>{method.toUpperCase()}</Badge>;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                        <Wallet className="h-7 w-7 text-blue-400" />
                        Payment Management
                    </h1>
                    <p className="text-slate-400 mt-1">Record and manage student fee payments</p>
                </div>
                <Button
                    onClick={() => {
                        if (showForm) {
                            resetForm();
                        }
                        setShowForm(!showForm);
                    }}
                    className={showForm
                        ? "bg-slate-700 hover:bg-slate-600 text-white"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                    }
                >
                    {showForm ? (
                        <>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4 mr-2" />
                            Record Payment
                        </>
                    )}
                </Button>
            </div>

            {/* Payment Recording Form */}
            {showForm && (
                <Card className="bg-slate-900/50 border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-white">Record New Payment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Student Search Section */}
                            <div className="border border-slate-700 rounded-lg p-4 bg-slate-800/30">
                                <h3 className="text-sm font-semibold text-white mb-3">Student Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Student ID Input */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">
                                            Student ID <span className="text-red-400">*</span>
                                        </Label>
                                        <Input
                                            value={studentIdInput}
                                            onChange={(e) => setStudentIdInput(e.target.value.toUpperCase())}
                                            className="bg-slate-800/50 border-slate-700 text-white uppercase font-mono"
                                            placeholder="RTS-NAL-RCC-12-2025-0001"
                                            disabled={!!foundStudent}
                                        />
                                    </div>

                                    {/* Student Name Input */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">
                                            Student Name
                                            <span className="text-xs text-slate-500 ml-1">(for verification)</span>
                                        </Label>
                                        <Input
                                            value={studentNameInput}
                                            onChange={(e) => setStudentNameInput(e.target.value)}
                                            className="bg-slate-800/50 border-slate-700 text-white"
                                            placeholder="Enter student name"
                                            disabled={!!foundStudent}
                                        />
                                    </div>

                                    {/* Search Button */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-300 opacity-0">Search</Label>
                                        {!foundStudent ? (
                                            <Button
                                                type="button"
                                                onClick={handleSearchStudent}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                <Search className="h-4 w-4 mr-2" />
                                                Find Student
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                onClick={resetForm}
                                                variant="outline"
                                                className="w-full border-slate-700 text-slate-300 hover:bg-slate-800"
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Search Error */}
                                {searchError && (
                                    <p className="text-sm text-red-400 mt-2">{searchError}</p>
                                )}

                                {/* Found Student Display */}
                                {foundStudent && (
                                    <div className="mt-3 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
                                        <p className="text-sm text-green-400">
                                            ✓ Student found: <span className="font-semibold">{foundStudent.user?.full_name}</span>
                                        </p>
                                        <p className="text-xs text-slate-400 mt-1">
                                            ID: {foundStudent.student_id}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Payment Details - Only show if student found */}
                            {foundStudent && (
                                <>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Course Selection */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">
                                                Course <span className="text-red-400">*</span>
                                            </Label>
                                            <Select
                                                required
                                                value={formData.course_id}
                                                onValueChange={(value) => {
                                                    setFormData({ ...formData, course_id: value });
                                                    // Auto-fill amount from course fee
                                                    const course = studentCourses.find(c => c.course_id === value);
                                                    if (course?.course) {
                                                        setFormData(prev => ({ ...prev, course_id: value, amount: course.course.fee_amount }));
                                                    }
                                                }}
                                            >
                                                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                                    <SelectValue placeholder="Select enrolled course" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {studentCourses.map(enrollment => (
                                                        <SelectItem key={enrollment.id} value={enrollment.course_id}>
                                                            {enrollment.course?.name} - ₹{enrollment.course?.fee_amount}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            {studentCourses.length === 0 && (
                                                <p className="text-xs text-amber-400">Student has no enrolled courses</p>
                                            )}
                                        </div>

                                        {/* Amount */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">
                                                Amount <span className="text-red-400">*</span>
                                            </Label>
                                            <Input
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                                className="bg-slate-800/50 border-slate-700 text-white"
                                                placeholder="Enter amount"
                                            />
                                        </div>

                                        {/* Payment Method */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">
                                                Payment Method <span className="text-red-400">*</span>
                                            </Label>
                                            <Select
                                                required
                                                value={formData.payment_method}
                                                onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                                            >
                                                <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cash">Cash</SelectItem>
                                                    <SelectItem value="online">Online</SelectItem>
                                                    <SelectItem value="upi">UPI</SelectItem>
                                                    <SelectItem value="card">Card</SelectItem>
                                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                                    <SelectItem value="offline">Offline</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        {/* Transaction ID (conditional) */}
                                        {requiresTransactionId(formData.payment_method) && (
                                            <div className="space-y-2">
                                                <Label className="text-slate-300">
                                                    Transaction ID <span className="text-red-400">*</span>
                                                </Label>
                                                <Input
                                                    type="text"
                                                    required
                                                    value={formData.transaction_id}
                                                    onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                                                    className="bg-slate-800/50 border-slate-700 text-white"
                                                    placeholder="Enter transaction ID"
                                                />
                                            </div>
                                        )}

                                        {/* Payment Date */}
                                        <div className="space-y-2">
                                            <Label className="text-slate-300">Payment Date</Label>
                                            <Input
                                                type="date"
                                                value={formData.payment_date || ''}
                                                onChange={(e) => setFormData({ ...formData, payment_date: e.target.value })}
                                                className="bg-slate-800/50 border-slate-700 text-white"
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Notes</Label>
                                        <Textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            className="bg-slate-800/50 border-slate-700 text-white"
                                            rows={3}
                                            placeholder="Additional notes (optional)"
                                        />
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-2">
                                        <Button
                                            type="submit"
                                            className="bg-gradient-to-r from-emerald-600 to-green-600 text-white hover:from-emerald-700 hover:to-green-700"
                                        >
                                            Record Payment
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                resetForm();
                                                setShowForm(false);
                                            }}
                                            variant="outline"
                                            className="border-slate-700 text-slate-300 hover:bg-slate-800"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            )}
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Filter */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                        <Label className="text-slate-300">Filter by Student:</Label>
                        <Select
                            value={filterStudentId || undefined}
                            onValueChange={(value) => setFilterStudentId(value || '')}
                        >
                            <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white max-w-xs">
                                <SelectValue placeholder="All Students" />
                            </SelectTrigger>
                            <SelectContent>
                                {students.map(student => (
                                    <SelectItem key={student.id} value={student.id}>
                                        {student.user?.full_name || student.id}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Payment History Table */}
            <Card className="bg-slate-900/50 border-slate-800">
                <CardHeader>
                    <CardTitle className="text-white">
                        Payment History
                        <Badge variant="secondary" className="ml-2 bg-slate-800 text-slate-300">
                            {payments.length}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className="border-slate-800 hover:bg-transparent">
                                    <TableHead className="text-slate-400">Receipt No.</TableHead>
                                    <TableHead className="text-slate-400">Date</TableHead>
                                    <TableHead className="text-slate-400">Student</TableHead>
                                    <TableHead className="text-slate-400">Course</TableHead>
                                    <TableHead className="text-slate-400">Amount</TableHead>
                                    <TableHead className="text-slate-400">Method</TableHead>
                                    <TableHead className="text-slate-400">Transaction ID</TableHead>
                                    <TableHead className="text-slate-400 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payments.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-12">
                                            <Receipt className="h-12 w-12 text-slate-600 mx-auto mb-4" />
                                            <p className="text-slate-400">No payments found</p>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    payments.map(payment => (
                                        <TableRow
                                            key={payment.id}
                                            className="border-slate-800 hover:bg-slate-800/50 transition-colors"
                                        >
                                            <TableCell className="font-mono text-slate-300">
                                                {payment.receipt_number}
                                            </TableCell>
                                            <TableCell className="text-slate-300">
                                                {new Date(payment.payment_date).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                })}
                                            </TableCell>
                                            <TableCell className="text-white">
                                                {getStudentName(payment.student_id)}
                                            </TableCell>
                                            <TableCell className="text-slate-300">
                                                {getCourseName(payment.course_id)}
                                            </TableCell>
                                            <TableCell className="text-emerald-400 font-semibold">
                                                ₹{payment.amount.toLocaleString()}
                                            </TableCell>
                                            <TableCell>
                                                {getPaymentMethodBadge(payment.payment_method)}
                                            </TableCell>
                                            <TableCell className="font-mono text-slate-400">
                                                {payment.transaction_id || '-'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    onClick={() => handleDownloadReceipt(payment.id, payment.receipt_number)}
                                                    size="sm"
                                                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700"
                                                >
                                                    <Download className="h-4 w-4 mr-1" />
                                                    Receipt
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
