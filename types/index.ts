// User roles in the system
export type UserRole = 'super_admin' | 'institution_director' | 'staff_manager' | 'staff' | 'student';

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
    address: string | null;
    contact_email: string | null;
    contact_phone: string | null;
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

// Student entity
export interface Student extends BaseEntity {
    user_id: string;
    institution_id: string;
    enrollment_date: string;
    address: string | null;
    date_of_birth: string | null;
    photo_url: string | null;
    user?: User;
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
    student_id: string;
    course_id: string;
    amount: number;
    payment_date: string;
    payment_method: string | null;
    receipt_number: string | null;
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

export interface SignupRequest {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

// Form types for creating/updating entities
export interface CreateStudentRequest {
    email: string;
    password: string;
    full_name: string;
    phone?: string;
    address?: string;
    date_of_birth?: string;
}

export interface CreateStaffRequest {
    full_name: string;
    email: string;
    phone: string; // Required - used as default password
    role: 'staff' | 'staff_manager';
    daily_rate: number;
    institution_id: string;
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
    student_id: string;
    course_id: string;
}

export interface RecordPaymentRequest {
    student_id: string;
    course_id: string;
    amount: number;
    payment_method?: string;
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
