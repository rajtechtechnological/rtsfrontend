'use client';

import { useState, useEffect } from 'react';
import { paymentsApi, studentsApi, coursesApi } from '@/lib/api/endpoints';
import { useAuth } from '@/lib/auth/auth-context';
import type { FeePayment, Student, Course, StudentCourse, RecordPaymentRequest } from '@/types';
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
import { LedgerTable, type LedgerColumn } from '@/components/ui/ledger-table';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const fieldLabelClass = 'text-xs uppercase tracking-wide text-ink-muted';

export default function PaymentsPage() {
    const { user } = useAuth();
    const isStudent = user?.role === 'student';
    const canRecordPayments = ['super_admin', 'institution_director', 'staff_manager', 'receptionist', 'accountant'].includes(user?.role || '');

    const [payments, setPayments] = useState<FeePayment[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [currentStudentRecord, setCurrentStudentRecord] = useState<Student | null>(null);
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
    const [studentCourses, setStudentCourses] = useState<StudentCourse[]>([]);
    const [searchError, setSearchError] = useState('');

    useEffect(() => {
        loadData();
    }, [filterStudentId, user?.id]);

    const loadData = async () => {
        try {
            setLoading(true);

            // For students, first find their student record, then load their payments
            if (isStudent && user?.id) {
                const studentsRes = await studentsApi.list();
                const allStudents = studentsRes.data || [];
                const studentRecord = allStudents.find((s: Student) => s.user_id === user.id);

                if (studentRecord) {
                    setCurrentStudentRecord(studentRecord);
                    const [paymentsRes, coursesRes] = await Promise.all([
                        paymentsApi.list({ student_id: studentRecord.id }),
                        coursesApi.list(),
                    ]);
                    setPayments(paymentsRes.data);
                    setCourses(coursesRes.data);
                } else {
                    setPayments([]);
                }
            } else {
                // Staff/Admin view - load all data
                const [paymentsRes, studentsRes, coursesRes] = await Promise.all([
                    paymentsApi.list({ student_id: filterStudentId || undefined }),
                    studentsApi.list(),
                    coursesApi.list(),
                ]);
                setPayments(paymentsRes.data);
                setStudents(studentsRes.data || []);
                setCourses(coursesRes.data);
            }
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

    const totalAmount = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

    const columns: LedgerColumn<FeePayment>[] = [
        {
            key: 'receipt',
            header: 'Receipt No.',
            cell: (payment) => (
                <span className="font-mono tabular-nums">{payment.receipt_number}</span>
            ),
        },
        {
            key: 'date',
            header: 'Date',
            cell: (payment) =>
                new Date(payment.paid_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                }),
        },
        ...(!isStudent
            ? [
                  {
                      key: 'student',
                      header: 'Student',
                      cell: (payment) => (
                          <span className="font-medium">{getStudentName(payment.student_id)}</span>
                      ),
                  } satisfies LedgerColumn<FeePayment>,
              ]
            : []),
        {
            key: 'course',
            header: 'Course',
            cell: (payment) => getCourseName(payment.course_id),
        },
        {
            key: 'method',
            header: 'Method',
            cell: (payment) => (
                <span className="text-xs uppercase tracking-wide text-ink-muted">
                    {payment.payment_method.replace('_', ' ')}
                </span>
            ),
        },
        {
            key: 'transaction',
            header: 'Transaction ID',
            cell: (payment) => (
                <span className="font-mono tabular-nums text-ink-muted">
                    {payment.transaction_id || '—'}
                </span>
            ),
        },
        {
            key: 'amount',
            header: 'Amount',
            numeric: true,
            cell: (payment) => `₹${payment.amount.toLocaleString('en-IN')}`,
        },
        {
            key: 'actions',
            header: '',
            align: 'right',
            cell: (payment) => (
                <Button
                    onClick={() => handleDownloadReceipt(payment.id, payment.receipt_number)}
                    size="sm"
                    variant="outline"
                >
                    Receipt
                </Button>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-6 w-6 animate-spin text-ink-muted" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="font-serif text-2xl font-semibold text-ink">
                        {isStudent ? 'My Payment History' : 'Payments'}
                    </h1>
                    <p className="text-sm text-ink-muted mt-1">
                        {isStudent
                            ? 'Your fee payment history and receipts'
                            : 'Record and manage student fee payments'
                        }
                    </p>
                    {isStudent && currentStudentRecord && (
                        <p className="text-sm text-ink-muted mt-1">
                            Student ID: <span className="font-mono tabular-nums text-ink">{currentStudentRecord.student_id}</span>
                        </p>
                    )}
                </div>
                {canRecordPayments && (
                    <Button
                        variant={showForm ? 'outline' : 'default'}
                        onClick={() => {
                            if (showForm) {
                                resetForm();
                            }
                            setShowForm(!showForm);
                        }}
                    >
                        {showForm ? 'Cancel' : 'Record Payment'}
                    </Button>
                )}
            </div>

            {/* Payment Recording Form */}
            {showForm && (
                <section className="rounded-md border border-line bg-surface">
                    <div className="border-b border-line px-4 py-3">
                        <h2 className="font-serif text-lg text-ink">Record New Payment</h2>
                    </div>
                    <div className="p-4">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Student Search Section */}
                            <div className="rounded-md border border-line p-4">
                                <h3 className={`${fieldLabelClass} mb-3`}>Student Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Student ID Input */}
                                    <div className="space-y-2">
                                        <Label className={fieldLabelClass}>Student ID (required)</Label>
                                        <Input
                                            value={studentIdInput}
                                            onChange={(e) => setStudentIdInput(e.target.value.toUpperCase())}
                                            className="uppercase font-mono"
                                            placeholder="RTS-NAL-RCC-12-2025-0001"
                                            disabled={!!foundStudent}
                                        />
                                    </div>

                                    {/* Student Name Input */}
                                    <div className="space-y-2">
                                        <Label className={fieldLabelClass}>
                                            Student Name
                                            <span className="normal-case tracking-normal">(for verification)</span>
                                        </Label>
                                        <Input
                                            value={studentNameInput}
                                            onChange={(e) => setStudentNameInput(e.target.value)}
                                            placeholder="Enter student name"
                                            disabled={!!foundStudent}
                                        />
                                    </div>

                                    {/* Search Button */}
                                    <div className="space-y-2">
                                        <Label className={`${fieldLabelClass} opacity-0`}>Search</Label>
                                        {!foundStudent ? (
                                            <Button
                                                type="button"
                                                onClick={handleSearchStudent}
                                                variant="outline"
                                                className="w-full"
                                            >
                                                Find Student
                                            </Button>
                                        ) : (
                                            <Button
                                                type="button"
                                                onClick={resetForm}
                                                variant="outline"
                                                className="w-full"
                                            >
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                </div>

                                {/* Search Error */}
                                {searchError && (
                                    <p className="text-sm text-danger mt-2">{searchError}</p>
                                )}

                                {/* Found Student Display */}
                                {foundStudent && (
                                    <div className="mt-3 rounded-md border border-line bg-accent-soft p-3">
                                        <p className="text-sm text-ink">
                                            Student found: <span className="font-medium">{foundStudent.user?.full_name}</span>
                                        </p>
                                        <p className="mt-1 font-mono text-xs tabular-nums text-ink-muted">
                                            {foundStudent.student_id}
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
                                            <Label className={fieldLabelClass}>Course (required)</Label>
                                            <Select
                                                required
                                                value={formData.course_id}
                                                onValueChange={(value) => {
                                                    setFormData({ ...formData, course_id: value });
                                                    // Auto-fill amount from course fee
                                                    const course = studentCourses.find(c => c.course_id === value);
                                                    if (course?.course) {
                                                        setFormData(prev => ({ ...prev, course_id: value, amount: course.course!.fee_amount }));
                                                    }
                                                }}
                                            >
                                                <SelectTrigger>
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
                                                <p className="text-xs text-warning">Student has no enrolled courses</p>
                                            )}
                                        </div>

                                        {/* Amount */}
                                        <div className="space-y-2">
                                            <Label className={fieldLabelClass}>Amount (required)</Label>
                                            <Input
                                                type="number"
                                                required
                                                min="0"
                                                step="0.01"
                                                value={formData.amount}
                                                onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
                                                className="font-mono"
                                                placeholder="Enter amount"
                                            />
                                        </div>

                                        {/* Payment Method */}
                                        <div className="space-y-2">
                                            <Label className={fieldLabelClass}>Payment Method (required)</Label>
                                            <Select
                                                required
                                                value={formData.payment_method}
                                                onValueChange={(value) => setFormData({ ...formData, payment_method: value })}
                                            >
                                                <SelectTrigger>
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
                                                <Label className={fieldLabelClass}>Transaction ID (required)</Label>
                                                <Input
                                                    type="text"
                                                    required
                                                    value={formData.transaction_id}
                                                    onChange={(e) => setFormData({ ...formData, transaction_id: e.target.value })}
                                                    className="font-mono"
                                                    placeholder="Enter transaction ID"
                                                />
                                            </div>
                                        )}

                                        {/* Payment Date */}
                                        <div className="space-y-2">
                                            <Label className={fieldLabelClass}>Payment Date</Label>
                                            <Input
                                                type="date"
                                                value={formData.paid_at || ''}
                                                onChange={(e) => setFormData({ ...formData, paid_at: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {/* Notes */}
                                    <div className="space-y-2">
                                        <Label className={fieldLabelClass}>Notes</Label>
                                        <Textarea
                                            value={formData.notes}
                                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                            rows={3}
                                            placeholder="Additional notes (optional)"
                                        />
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-2">
                                        <Button type="submit">Record Payment</Button>
                                        <Button
                                            type="button"
                                            onClick={() => {
                                                resetForm();
                                                setShowForm(false);
                                            }}
                                            variant="outline"
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </>
                            )}
                        </form>
                    </div>
                </section>
            )}

            {/* Payment Ledger */}
            <section className="rounded-md border border-line bg-surface">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
                    <h2 className="font-serif text-lg text-ink">
                        {isStudent ? 'My Payments' : 'Payment Ledger'}
                    </h2>
                    <div className="flex items-center gap-3">
                        {!isStudent && (
                            <select
                                value={filterStudentId}
                                onChange={(e) => setFilterStudentId(e.target.value)}
                                className="h-9 rounded-md border border-line bg-surface px-2 text-sm text-ink focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                                <option value="">All students</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.id}>
                                        {student.user?.full_name || student.id}
                                    </option>
                                ))}
                            </select>
                        )}
                        <span className="font-mono text-xs tabular-nums text-ink-muted">
                            {payments.length} entries
                        </span>
                    </div>
                </div>
                <LedgerTable
                    columns={columns}
                    rows={payments}
                    rowKey={(payment) => payment.id}
                    emptyMessage="No payments have been recorded."
                    subtotal={{
                        receipt: 'Total',
                        amount: `₹${totalAmount.toLocaleString('en-IN')}`,
                    }}
                />
            </section>
        </div>
    );
}
