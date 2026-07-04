// User roles in the system
export type UserRole = 'super_admin' | 'institution_director' | 'staff_manager' | 'receptionist' | 'staff' | 'student';

// Base entity with common fields
export interface BaseEntity {
    id: string;
    created_at: string;
    updated_at: string | null;
}

// User entity
export interface User extends BaseEntity {
    email: string;
    full_name: string;
    phone: string | null;
    role: UserRole;
    institution_id: string | null;
    is_active: boolean;
}

// Institution/Franchise entity
export interface Institution extends BaseEntity {
    name: string;
    district_code: string | null;  // e.g., NAL for Nalanda, PAT for Patna
    address: string | null;
    contact_email: string | null;
    contact_phone: string | null;
    upi_vpa: string | null;
    director_id: string | null;
}

// Course entity
export interface Course extends BaseEntity {
    name: string;
    description: string | null;
    duration_months: number;
    fee_amount: number;
    institution_id: string | null;
}

// Batch entity (batches table — replaces the old batch_* string fields)
export interface Batch extends BaseEntity {
    institution_id: string;
    name: string;
    start_time: string;  // "HH:MM:SS"
    end_time: string;    // "HH:MM:SS"
    month: number;       // 1-12
    year: number;
    identifier: string;  // "A" | "B" | ...
    is_active: boolean;
}

export type StudentStatus = 'active' | 'completed' | 'dropped';

// Student entity
export interface Student extends BaseEntity {
    user_id: string | null;
    institution_id: string;
    batch_id: string;
    student_id: string;  // Format: RTS-INST-MM-YYYY-NNNN
    status: StudentStatus;
    enrollment_date: string;
    address: string | null;
    date_of_birth: string | null;
    father_name: string | null;
    guardian_name: string | null;
    guardian_phone: string | null;
    photo_url: string | null;
    aadhar_number?: string | null;  // detail shape only (excluded from lists)
    apaar_id: string | null;
    last_qualification: string | null;
    user?: User | null;
    course_enrollments?: StudentCourse[];
}

// Student Course Enrollment
export interface StudentCourse extends BaseEntity {
    student_id: string;
    course_id: string;
    enrollment_date: string;
    completion_date: string | null;
    status: 'enrolled' | 'completed' | 'dropped';
    course?: Course;
}

// Fee Payment
export interface FeePayment extends BaseEntity {
    institution_id: string;
    student_id: string;
    course_id: string;
    amount: number;
    paid_at: string;
    payment_method: string; // online, offline, cash, upi, card, bank_transfer
    transaction_id: string | null;
    receipt_number: string;
    notes: string | null;
    recorded_by: string | null;
}

// Staff entity
export interface Staff extends BaseEntity {
    user_id: string;
    institution_id: string;
    daily_rate: number;
    join_date: string;
    // User information included in response
    full_name: string;
    email: string;
    phone: string; // Required
    role: string;
    status: string; // 'active' or 'inactive'
    user?: User; // Optional nested user object
}

// Attendance record
export interface Attendance extends BaseEntity {
    staff_id: string;
    date: string;
    status: 'present' | 'absent' | 'half_day' | 'leave';
    notes: string | null;
    staff?: Staff;
}

// Attendance status type
export type AttendanceStatus = 'present' | 'absent' | 'half_day' | 'leave';

// Payroll record
export interface Payroll extends BaseEntity {
    staff_id: string;
    month: number;
    year: number;
    days_present: number;
    days_half: number;
    total_days: number;
    daily_rate: number;
    gross_amount: number;
    deductions: number;
    net_amount: number;
    payslip_url: string | null;
    status: 'pending' | 'paid' | 'cancelled';
    staff?: Staff;
}

// Certificate entity
export interface Certificate extends BaseEntity {
    student_id: string;
    course_id: string;
    certificate_number: string;
    issue_date: string;
    certificate_url: string | null;
    student?: Student;
    course?: Course;
}

// Chat message for AI chatbot
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
}

// API Response types
export interface ApiResponse<T> {
    data: T;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

// Auth types
export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

// Form types for creating/updating entities

// Staff-driven student registration (creates user + student; server derives
// institution_id from the caller's tenant context).
export interface RegisterStudentRequest {
    full_name: string;
    email: string;
    phone?: string;
    batch_id: string;
    date_of_birth?: string;
    father_name?: string;
    guardian_name?: string;
    guardian_phone?: string;
    address?: string;
    aadhar_number?: string;
    apaar_id?: string;
    last_qualification?: string;
    course_id?: string;
}

export interface UpdateStudentRequest {
    student_id?: string;
    batch_id?: string;
    status?: StudentStatus;
    date_of_birth?: string;
    father_name?: string;
    guardian_name?: string;
    guardian_phone?: string;
    address?: string;
    aadhar_number?: string;
    apaar_id?: string;
    last_qualification?: string;
}

export interface CreateBatchRequest {
    name: string;
    start_time: string;  // "HH:MM"
    end_time: string;    // "HH:MM"
    month: number;       // 1-12
    year: number;
    identifier?: string;
}

export interface UpdateBatchRequest extends Partial<CreateBatchRequest> {
    is_active?: boolean;
}

// No institution_id — the server always derives it from the caller's tenant.
export interface CreateStaffRequest {
    full_name: string;
    email: string;
    phone: string; // Required - used as default password
    role: 'staff' | 'staff_manager' | 'receptionist';
    daily_rate: number;
}

export interface CreateCourseRequest {
    name: string;
    description?: string;
    duration_months: number;
    fee_amount: number;
    institution_id?: string;
}

export interface CreateInstitutionRequest {
    name: string;
    district_code?: string;  // e.g., NAL, PAT, DEL
    address?: string;
    contact_email?: string;
    contact_phone?: string;
}

export interface MarkAttendanceRequest {
    staff_id: string;
    date: string;
    status: AttendanceStatus;
    notes?: string;
}

export interface GeneratePayrollRequest {
    staff_id: string;
    month: number;
    year: number;
}

export interface EnrollStudentRequest {
    course_id: string;
}

export interface RecordPaymentRequest {
    student_id: string;
    course_id: string;
    amount: number;
    paid_at?: string;
    payment_method: string; // online, offline, cash, upi, card, bank_transfer
    transaction_id?: string; // Required for online/upi/card
    notes?: string;
}

export interface PaymentSummary {
    student_id: string;
    student_name: string;
    courses: Array<{
        course_id: string;
        course_name: string;
        total_fee: number;
        total_paid: number;
        balance: number;
        payment_count: number;
        status: 'paid' | 'pending';
    }>;
}

// Logged-in student's own fee position (/api/payments/my/summary)
export interface MyPaymentSummary {
    student_id: string;
    student_code: string;
    total_balance: number;
    courses: Array<{
        course_id: string;
        course_name: string;
        total_fee: number;
        total_paid: number;
        balance: number;
        status: 'paid' | 'pending';
    }>;
    recent_payments: Array<{
        id: string;
        amount: number;
        paid_at: string | null;
        payment_method: string;
        receipt_number: string | null;
        course_name: string | null;
    }>;
}

// ============ Exam Types ============

export interface Exam {
    id: string;
    course_id: string;
    module_id: string;
    institution_id: string;
    title: string;
    description: string | null;
    total_questions: number;
    passing_marks: number;
    duration_minutes: number;
    is_active: boolean;
    allow_retakes: boolean;
    max_retakes: number;
    shuffle_questions: boolean;
    shuffle_options: boolean;
    show_result_immediately: boolean;
    created_by: string;
    created_at: string;
    updated_at: string | null;
}

export interface ExamDetail extends Exam {
    questions: Question[];
    course_name?: string;
    module_name?: string;
}

export interface Question {
    id: string;
    exam_id: string;
    image_url?: string | null;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: 'A' | 'B' | 'C' | 'D';
    marks: number;
    order_index: number;
    explanation: string | null;
    is_active: boolean;
    created_at: string;
}

export interface ExamSchedule {
    id: string;
    exam_id: string;
    institution_id: string;
    batch_id: string;  // a schedule targets exactly one batch
    scheduled_date: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
    created_by: string;
    created_at: string;
    exam_title?: string | null;
    course_name?: string | null;
    module_name?: string | null;
    batch_name?: string | null;
}

export interface ExamAttempt {
    id: string;
    exam_id: string;
    student_id: string;
    attempt_number: number;
    status: 'in_progress' | 'completed' | 'submitted' | 'timed_out';
    start_time: string;
    deadline_at: string;  // server-authoritative deadline (F-13)
    end_time: string | null;
    total_marks: number | null;
    obtained_marks: number | null;
    percentage: number | null;
    passed: boolean | null;
    total_answered: number;
    correct_answers: number | null;
    is_verified: boolean;
    verified_at: string | null;
    created_at: string;
    exam_title?: string;
    student_name?: string;
    student_email?: string;
}

export interface AvailableExam {
    exam_id: string;
    exam_title: string;
    course_id: string;
    course_name: string;
    module_id: string;
    module_name: string;
    total_questions: number;
    duration_minutes: number;
    passing_marks: number;
    is_locked: boolean;
    lock_reason: string | null;
    schedule_id: string | null;
    scheduled_date: string | null;
    start_time: string | null;
    end_time: string | null;
    previous_attempts: number;
    can_retake: boolean;
    best_score: number | null;
}

export interface ExamAttemptStart {
    attempt_id: string;
    exam_id: string;
    exam_title: string;
    duration_minutes: number;
    total_questions: number;
    start_time: string;
    end_time: string;  // = deadline (kept for backward compat)
    deadline: string;  // server-authoritative deadline_at (F-13)
    questions: ExamQuestion[];
}

export interface ExamQuestion {
    id: string;
    index: number | null;
    question_text: string;
    image_url?: string | null;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    marks: number;
}

export interface ExamAttemptState {
    attempt_id: string;
    exam_id: string;
    exam_title: string;
    status: string;
    current_question_index: number;
    total_questions: number;
    time_remaining_seconds: number;  // display hint only — deadline is authoritative
    deadline: string;  // server-authoritative deadline_at (F-13)
    answers: Record<string, string | null>;
    marked_for_review: string[];
}

export interface ExamResult {
    attempt_id: string;
    exam_id: string;
    exam_title: string;
    course_name: string;
    module_name: string;
    attempt_number: number;
    status: string;
    start_time: string;
    end_time: string | null;
    duration_taken_minutes: number | null;
    total_questions: number;
    total_answered: number;
    correct_answers: number;
    total_marks: number;
    obtained_marks: number;
    percentage: number;
    passed: boolean;
    is_verified: boolean;
    verified_at: string | null;
}

// Batch targeting lives on exam SCHEDULES, not on the exam itself.
export interface CreateExamRequest {
    course_id: string;
    module_id: string;
    title: string;
    description?: string;
    passing_marks?: number;
    duration_minutes?: number;
    allow_retakes?: boolean;
    max_retakes?: number;
    shuffle_questions?: boolean;
    shuffle_options?: boolean;
    show_result_immediately?: boolean;
}

export interface CreateQuestionRequest {
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_option: 'A' | 'B' | 'C' | 'D';
    marks?: number;
    explanation?: string;
    order_index?: number;
}

export interface CreateScheduleRequest {
    exam_id: string;
    batch_id: string;  // a schedule targets exactly one batch
    scheduled_date: string;
    start_time: string;
    end_time: string;
}

// Dashboard stats
export interface DashboardStats {
    stats: Array<{
        title: string;
        value: string;
        description: string;
        trend?: {
            value: number;
            isPositive: boolean;
        } | null;
    }>;
    popularCourses?: Array<{
        course: string;
        franchise: string;
        enrollments: number;
        trend: number;
    }>;
    revenueByFranchise?: Array<{
        name: string;
        revenue: number;
        percentage: number;
    }>;
    recentEnrollments?: Array<{
        student_name: string;
        course: string;
        time_ago: string;
    }>;
}
