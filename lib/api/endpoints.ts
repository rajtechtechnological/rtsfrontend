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
        apiClient.post<AuthResponse>('/auth/login', data),

    signup: (data: SignupRequest) =>
        apiClient.post<AuthResponse>('/auth/signup', data),

    me: () =>
        apiClient.get<User>('/auth/me'),

    updateProfile: (data: Partial<User>) =>
        apiClient.patch<User>('/auth/profile', data),
};

// ============ Institution Endpoints ============
export const institutionsApi = {
    list: (page = 1, pageSize = 10) =>
        apiClient.get<PaginatedResponse<Institution>>('/institutions', {
            params: { page, page_size: pageSize }
        }),

    get: (id: string) =>
        apiClient.get<Institution>(`/institutions/${id}`),

    create: (data: CreateInstitutionRequest) =>
        apiClient.post<Institution>('/institutions', data),

    update: (id: string, data: Partial<CreateInstitutionRequest>) =>
        apiClient.patch<Institution>(`/institutions/${id}`, data),

    delete: (id: string) =>
        apiClient.delete(`/institutions/${id}`),

    getStats: (id: string) =>
        apiClient.get<DashboardStats>(`/institutions/${id}/stats`),
};

// ============ Student Endpoints ============
export const studentsApi = {
    list: (params: { page?: number; page_size?: number; search?: string; institution_id?: string }) =>
        apiClient.get<PaginatedResponse<Student>>('/students', { params }),

    get: (id: string) =>
        apiClient.get<Student>(`/students/${id}`),

    create: (data: CreateStudentRequest) =>
        apiClient.post<Student>('/students', data),

    update: (id: string, data: Partial<CreateStudentRequest>) =>
        apiClient.patch<Student>(`/students/${id}`, data),

    delete: (id: string) =>
        apiClient.delete(`/students/${id}`),

    uploadPhoto: (id: string, file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.post<{ photo_url: string }>(`/students/${id}/photo`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    },

    getCourses: (id: string) =>
        apiClient.get<StudentCourse[]>(`/students/${id}/courses`),

    enroll: (data: EnrollStudentRequest) =>
        apiClient.post<StudentCourse>('/students/enroll', data),

    getPayments: (id: string) =>
        apiClient.get<FeePayment[]>(`/students/${id}/payments`),

    recordPayment: (data: RecordPaymentRequest) =>
        apiClient.post<FeePayment>('/students/payments', data),
};

// ============ Course Endpoints ============
export const coursesApi = {
    list: (params: { page?: number; page_size?: number; institution_id?: string }) =>
        apiClient.get<PaginatedResponse<Course>>('/courses', { params }),

    get: (id: string) =>
        apiClient.get<Course>(`/courses/${id}`),

    create: (data: CreateCourseRequest) =>
        apiClient.post<Course>('/courses', data),

    update: (id: string, data: Partial<CreateCourseRequest>) =>
        apiClient.patch<Course>(`/courses/${id}`, data),

    delete: (id: string) =>
        apiClient.delete(`/courses/${id}`),
};

// ============ Staff Endpoints ============
export const staffApi = {
    list: (params: { page?: number; page_size?: number; institution_id?: string }) =>
        apiClient.get<PaginatedResponse<Staff>>('/staff', { params }),

    get: (id: string) =>
        apiClient.get<Staff>(`/staff/${id}`),

    create: (data: CreateStaffRequest) =>
        apiClient.post<Staff>('/staff', data),

    update: (id: string, data: Partial<CreateStaffRequest>) =>
        apiClient.patch<Staff>(`/staff/${id}`, data),

    delete: (id: string) =>
        apiClient.delete(`/staff/${id}`),
};

// ============ Attendance Endpoints ============
export const attendanceApi = {
    list: (params: { date?: string; staff_id?: string; month?: number; year?: number }) =>
        apiClient.get<Attendance[]>('/attendance', { params }),

    mark: (data: MarkAttendanceRequest) =>
        apiClient.post<Attendance>('/attendance', data),

    markBatch: (data: MarkAttendanceRequest[]) =>
        apiClient.post<Attendance[]>('/attendance/batch', data),

    getSummary: (params: { staff_id: string; month: number; year: number }) =>
        apiClient.get<{ days_present: number; days_half: number; days_absent: number; days_leave: number }>(
            '/attendance/summary',
            { params }
        ),
};

// ============ Payroll Endpoints ============
export const payrollApi = {
    list: (params: { staff_id?: string; month?: number; year?: number; status?: string }) =>
        apiClient.get<PaginatedResponse<Payroll>>('/payroll', { params }),

    get: (id: string) =>
        apiClient.get<Payroll>(`/payroll/${id}`),

    generate: (data: GeneratePayrollRequest) =>
        apiClient.post<Payroll>('/payroll/generate', data),

    generatePayslip: (id: string) =>
        apiClient.post<{ payslip_url: string }>(`/payroll/${id}/generate-payslip`),

    markPaid: (id: string) =>
        apiClient.patch<Payroll>(`/payroll/${id}/mark-paid`),
};

// ============ Certificate Endpoints ============
export const certificatesApi = {
    list: (params: { student_id?: string; course_id?: string }) =>
        apiClient.get<Certificate[]>('/certificates', { params }),

    get: (id: string) =>
        apiClient.get<Certificate>(`/certificates/${id}`),

    generate: (studentId: string, courseId: string) =>
        apiClient.post<Certificate>('/certificates/generate', { student_id: studentId, course_id: courseId }),
};

// ============ Chatbot Endpoints ============
export const chatbotApi = {
    sendMessage: (message: string) =>
        apiClient.post<{ response: string }>('/chatbot/message', { message }),
};

// ============ Dashboard Endpoints ============
export const dashboardApi = {
    getStats: () =>
        apiClient.get<DashboardStats>('/dashboard/stats'),
};
