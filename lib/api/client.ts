import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// Create axios instance with default config.
// withCredentials: the refresh token travels as an httpOnly cookie scoped to
// /api/auth — the browser must be allowed to send/receive it.
const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
    withCredentials: true,
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

function clearAuthAndRedirect() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    // Only redirect if not already on login page
    if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
    }
}

// Single-flight refresh: concurrent 401s share one /refresh call so the
// rotating refresh token is not burned twice (rotation invalidates the old one).
let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
    if (!refreshPromise) {
        refreshPromise = axios
            .post<{ access_token: string; user: unknown }>(
                `${API_URL}/api/auth/refresh`,
                null,
                { withCredentials: true }
            )
            .then((response) => {
                const { access_token, user } = response.data;
                localStorage.setItem('access_token', access_token);
                if (user) {
                    localStorage.setItem('user', JSON.stringify(user));
                }
                return access_token;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
}

// Response interceptor: on 401, refresh the 15-min access token via the
// httpOnly refresh cookie and retry the original request once. If the refresh
// itself fails, the session is over — clear auth state and redirect to /login.
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as
            | (InternalAxiosRequestConfig & { _retry?: boolean })
            | undefined;

        if (
            error.response?.status === 401 &&
            typeof window !== 'undefined' &&
            originalRequest &&
            !originalRequest._retry &&
            // Never try to refresh the auth endpoints themselves
            !originalRequest.url?.includes('/api/auth/login') &&
            !originalRequest.url?.includes('/api/auth/refresh')
        ) {
            originalRequest._retry = true;
            try {
                const newToken = await refreshAccessToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                const status = (refreshError as AxiosError).response?.status;
                if (status === 401 || status === 403) {
                    clearAuthAndRedirect();
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
