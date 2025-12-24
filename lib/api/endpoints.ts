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
    DashboardStats,
    PaginatedResponse,
    StudentCourse,
    FeePayment,
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
    list: (params: { page?: number; page_size?: number; search?: string; institution_id?: string }) =>
        apiClient.get<PaginatedResponse<Student>>('/api/students', { params }),

    get: (id: string) =>
        apiClient.get<Student>(`/api/students/${id}`),

    create: (data: CreateStudentRequest) =>
        apiClient.post<Student>('/api/students', data),

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
};

// ============ Course Endpoints ============
export const coursesApi = {
    list: (params: { page?: number; page_size?: number; institution_id?: string }) =>
        apiClient.get<PaginatedResponse<Course>>('/api/courses', { params }),

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
        apiClient.get<PaginatedResponse<Staff>>('/api/staff', { params }),

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

// ============ Dashboard Endpoints ============
export const dashboardApi = {
    getStats: () =>
        apiClient.get<DashboardStats>('/api/dashboard/stats'),
};
