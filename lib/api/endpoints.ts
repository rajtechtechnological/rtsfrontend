import apiClient from './client';
import type {
    User,
    Institution,
    Student,
    Course,
    Staff,
    Attendance,
    Payroll,
    Certificate,
    AuthResponse,
    LoginRequest,
    SignupRequest,
    CreateStudentRequest,
    CreateStaffRequest,
    CreateCourseRequest,
    CreateInstitutionRequest,
    MarkAttendanceRequest,
    GeneratePayrollRequest,
    EnrollStudentRequest,
    RecordPaymentRequest,
    PaymentSummary,
    DashboardStats,
    PaginatedResponse,
    StudentCourse,
    FeePayment,
    Exam,
    ExamDetail,
    Question,
    ExamSchedule,
    ExamAttempt,
    AvailableExam,
    ExamAttemptStart,
    ExamAttemptState,
    ExamResult,
    CreateExamRequest,
    CreateQuestionRequest,
    CreateScheduleRequest,
} from '@/types';

// ============ Auth Endpoints ============
export const authApi = {
    login: (data: LoginRequest) =>
        apiClient.post<AuthResponse>('/api/auth/login', data),

    signup: (data: SignupRequest) =>
        apiClient.post<AuthResponse>('/api/auth/signup', data),

    me: () =>
        apiClient.get<User>('/api/auth/me'),

    updateProfile: (data: Partial<User>) =>
        apiClient.patch<User>('/api/auth/profile', data),
};

// ============ Institution Endpoints ============
export const institutionsApi = {
    list: (page = 1, pageSize = 10) =>
        apiClient.get<PaginatedResponse<Institution>>('/api/institutions', {
            params: { page, page_size: pageSize }
        }),

    get: (id: string) =>
        apiClient.get<Institution>(`/api/institutions/${id}`),

    create: (data: CreateInstitutionRequest) =>
        apiClient.post<Institution>('/api/institutions', data),

    update: (id: string, data: Partial<CreateInstitutionRequest>) =>
        apiClient.patch<Institution>(`/api/institutions/${id}`, data),

    delete: (id: string) =>
        apiClient.delete(`/api/institutions/${id}`),

    getStats: (id: string) =>
        apiClient.get<DashboardStats>(`/api/institutions/${id}/stats`),
    
    getSummary: () =>
        apiClient.get<{
            institutions: Array<{
                id: string;
                name: string;
                district_code: string | null;
                address: string | null;
                contact_email: string | null;
                contact_phone: string | null;
                director_name: string | null;
                staff_count: number;
                student_count: number;
                status: string;
                created_at: string | null;
            }>;
            total_franchises: number;
            total_staff: number;
            total_students: number;
        }>('/api/institutions/stats/summary'),
};

// ============ Student Endpoints ============
export const studentsApi = {
    list: (params?: { page?: number; page_size?: number; search?: string; institution_id?: string }) =>
        apiClient.get<Student[]>('/api/students', { params }),

    get: (id: string) =>
        apiClient.get<Student>(`/api/students/${id}`),

    search: (studentId: string) =>
        apiClient.get<Student>('/api/students/search', { params: { student_id: studentId } }),

    create: (data: CreateStudentRequest) =>
        apiClient.post<Student>('/api/students', data),

    register: (data: {
        full_name: string;
        email: string;
        phone?: string;
        date_of_birth?: string;
        father_name?: string;
        guardian_name?: string;
        guardian_phone?: string;
        address?: string;
        aadhar_number?: string;
        apaar_id?: string;
        last_qualification?: string;
        batch_time?: string;
        batch_month?: string;
        batch_year?: string;
        batch_identifier?: string;
        course_id?: string;
    }) => apiClient.post<Student>('/api/students/register', data),

    update: (id: string, data: Partial<CreateStudentRequest>) =>
        apiClient.patch<Student>(`/api/students/${id}`, data),

    delete: (id: string) =>
        apiClient.delete(`/api/students/${id}`),

    uploadPhoto: (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post<{ photo_url: string }>(`/api/students/${id}/photo`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    getCourses: (id: string) =>
        apiClient.get<StudentCourse[]>(`/api/students/${id}/courses`),

    enroll: (data: EnrollStudentRequest) =>
        apiClient.post<StudentCourse>('/api/students/enroll', data),

    getPayments: (id: string) =>
        apiClient.get<FeePayment[]>(`/api/students/${id}/payments`),

    recordPayment: (data: RecordPaymentRequest) =>
        apiClient.post<FeePayment>('/api/students/payments', data),

    getById: (id: string) =>
        apiClient.get<Student>(`/api/students/${id}`),

    getCourseProgress: (studentId: string, courseId: string) =>
        apiClient.get<any>(`/api/students/${studentId}/courses/${courseId}/progress`),
};

// ============ Course Endpoints ============
export const coursesApi = {
    list: () =>
        apiClient.get<Course[]>('/api/courses'),

    get: (id: string) =>
        apiClient.get<Course>(`/api/courses/${id}`),

    create: (data: CreateCourseRequest) =>
        apiClient.post<Course>('/api/courses', data),

    update: (id: string, data: Partial<CreateCourseRequest>) =>
        apiClient.patch<Course>(`/api/courses/${id}`, data),

    delete: (id: string) =>
        apiClient.delete(`/api/courses/${id}`),
};

// ============ Staff Endpoints ============
export const staffApi = {
    list: (params: { page?: number; page_size?: number; institution_id?: string }) =>
        apiClient.get<Staff[]>('/api/staff', { params }),

    get: (id: string) =>
        apiClient.get<Staff>(`/api/staff/${id}`),

    create: (data: CreateStaffRequest) =>
        apiClient.post<Staff>('/api/staff', data),

    update: (id: string, data: Partial<CreateStaffRequest>) =>
        apiClient.patch<Staff>(`/api/staff/${id}`, data),

    delete: (id: string) =>
        apiClient.delete(`/api/staff/${id}`),
};

// ============ Attendance Endpoints ============
export const attendanceApi = {
    list: (params: { date?: string; staff_id?: string; month?: number; year?: number }) =>
        apiClient.get<Attendance[]>('/api/attendance', { params }),

    mark: (data: MarkAttendanceRequest) =>
        apiClient.post<Attendance>('/api/attendance', data),

    markBatch: (data: MarkAttendanceRequest[]) =>
        apiClient.post<Attendance[]>('/api/attendance/batch', data),

    getSummary: (params: { staff_id: string; month: number; year: number }) =>
        apiClient.get<{ days_present: number; days_half: number; days_absent: number; days_leave: number }>(
            '/api/attendance/summary',
            { params }
        ),
};

// ============ Payroll Endpoints ============
export const payrollApi = {
    list: (params: { staff_id?: string; month?: number; year?: number; status?: string }) =>
        apiClient.get<PaginatedResponse<Payroll>>('/api/payroll', { params }),

    get: (id: string) =>
        apiClient.get<Payroll>(`/api/payroll/${id}`),

    generate: (data: GeneratePayrollRequest) =>
        apiClient.post<Payroll>('/api/payroll/generate', data),

    generatePayslip: (id: string) =>
        apiClient.post<{ payslip_url: string }>(`/api/payroll/${id}/generate-payslip`),

    markPaid: (id: string) =>
        apiClient.patch<Payroll>(`/api/payroll/${id}/mark-paid`),
};

// ============ Certificate Endpoints ============
export const certificatesApi = {
    list: (params: { student_id?: string; course_id?: string }) =>
        apiClient.get<Certificate[]>('/api/certificates', { params }),

    get: (id: string) =>
        apiClient.get<Certificate>(`/api/certificates/${id}`),

    generate: (studentId: string, courseId: string) =>
        apiClient.post<Certificate>('/api/certificates/generate', { student_id: studentId, course_id: courseId }),
};

// ============ Chatbot Endpoints ============
export const chatbotApi = {
    sendMessage: (message: string) =>
        apiClient.post<{ response: string }>('/api/chatbot/message', { message }),
};

// ============ Payment Endpoints ============
export const paymentsApi = {
    list: (params?: { student_id?: string; course_id?: string; payment_method?: string }) =>
        apiClient.get<FeePayment[]>('/api/payments', { params }),

    get: (id: string) =>
        apiClient.get<FeePayment>(`/api/payments/${id}`),

    create: (data: RecordPaymentRequest) =>
        apiClient.post<FeePayment>('/api/payments', data),

    getStudentSummary: (studentId: string) =>
        apiClient.get<PaymentSummary>(`/api/payments/student/${studentId}/summary`),

    downloadReceipt: (paymentId: string) =>
        apiClient.get(`/api/payments/${paymentId}/receipt`, { responseType: 'blob' }),
};

// ============ Dashboard Endpoints ============
export const dashboardApi = {
    getStats: () =>
        apiClient.get<DashboardStats>('/api/dashboard/stats'),
};

// ============ Exam Endpoints (Manager) ============
export const examsApi = {
    // Exam CRUD
    list: (params?: { course_id?: string; module_id?: string; is_active?: boolean }) =>
        apiClient.get<Exam[]>('/api/exams', { params }),

    get: (id: string) =>
        apiClient.get<ExamDetail>(`/api/exams/${id}`),

    create: (data: CreateExamRequest) =>
        apiClient.post<Exam>('/api/exams', data),

    update: (id: string, data: Partial<CreateExamRequest>) =>
        apiClient.patch<Exam>(`/api/exams/${id}`, data),

    delete: (id: string) =>
        apiClient.delete(`/api/exams/${id}`),

    // Questions
    getQuestions: (examId: string) =>
        apiClient.get<Question[]>(`/api/exams/${examId}/questions`),

    addQuestion: (examId: string, data: CreateQuestionRequest) =>
        apiClient.post<Question>(`/api/exams/${examId}/questions`, data),

    addQuestionsBulk: (examId: string, questions: CreateQuestionRequest[]) =>
        apiClient.post<Question[]>(`/api/exams/${examId}/questions/bulk`, { questions }),

    updateQuestion: (questionId: string, data: Partial<CreateQuestionRequest>) =>
        apiClient.patch<Question>(`/api/exams/questions/${questionId}`, data),

    deleteQuestion: (questionId: string) =>
        apiClient.delete(`/api/exams/questions/${questionId}`),

    // Schedules
    listSchedules: (params?: { exam_id?: string; batch_time?: string; scheduled_date?: string }) =>
        apiClient.get<ExamSchedule[]>('/api/exams/schedules', { params }),

    createSchedule: (data: CreateScheduleRequest) =>
        apiClient.post<ExamSchedule>('/api/exams/schedules', data),

    cancelSchedule: (scheduleId: string) =>
        apiClient.delete(`/api/exams/schedules/${scheduleId}`),

    // Verification
    getPendingVerifications: (examId?: string) =>
        apiClient.get<ExamAttempt[]>('/api/exams/attempts/pending', { params: { exam_id: examId } }),

    reviewAttempt: (attemptId: string) =>
        apiClient.get<any>(`/api/exams/attempts/${attemptId}/review`),

    verifyAttempt: (attemptId: string, notes?: string) =>
        apiClient.post<ExamAttempt>(`/api/exams/attempts/${attemptId}/verify`, { notes }),

    allowRetake: (attemptId: string, notes?: string) =>
        apiClient.post<ExamAttempt>(`/api/exams/attempts/${attemptId}/allow-retake`, { notes }),

    verifyBulk: (attemptIds: string[]) =>
        apiClient.post<{ verified_count: number; total_requested: number }>('/api/exams/attempts/verify-bulk', attemptIds),

    getVerificationStats: () =>
        apiClient.get<{
            pending_verification: number;
            verified_today: number;
            total_verified: number;
            pass_rate: number;
            average_score: number;
        }>('/api/exams/attempts/statistics'),
};

// ============ Student Exam Endpoints ============
export const studentExamsApi = {
    // Available exams
    getAvailable: () =>
        apiClient.get<AvailableExam[]>('/api/student/exams/available'),

    // Start/Resume exam
    startExam: (examId: string) =>
        apiClient.post<ExamAttemptStart>(`/api/student/exams/${examId}/start`),

    // Get attempt state
    getAttemptState: (attemptId: string) =>
        apiClient.get<ExamAttemptState>(`/api/student/exams/attempts/${attemptId}`),

    // Submit answer (auto-save)
    submitAnswer: (attemptId: string, questionId: string, selectedOption: string | null, markedForReview: boolean = false) =>
        apiClient.post<{ status: string; time_remaining: number }>(`/api/student/exams/attempts/${attemptId}/answer`, {
            question_id: questionId,
            selected_option: selectedOption,
            marked_for_review: markedForReview,
        }),

    // Submit exam
    submitExam: (attemptId: string) =>
        apiClient.post<ExamAttempt>(`/api/student/exams/attempts/${attemptId}/submit`),

    // Get results
    getResults: () =>
        apiClient.get<ExamResult[]>('/api/student/exams/results'),
};
