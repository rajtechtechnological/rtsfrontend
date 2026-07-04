'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole, LoginRequest } from '@/types';
import { authApi } from '@/lib/api/endpoints';
import { AxiosError } from 'axios';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (data: LoginRequest) => Promise<void>;
    logout: () => void;
    hasRole: (roles: UserRole | UserRole[]) => boolean;
    refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Initialize auth state from localStorage
    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = localStorage.getItem('access_token');
                const storedUser = localStorage.getItem('user');

                if (token && storedUser) {
                    setUser(JSON.parse(storedUser));
                    // TODO: Re-enable when backend is connected
                    // Verify token is still valid by fetching user
                    // try {
                    //     const response = await authApi.me();
                    //     setUser(response.data);
                    //     localStorage.setItem('user', JSON.stringify(response.data));
                    // } catch {
                    //     // Token invalid, clear storage
                    //     localStorage.removeItem('access_token');
                    //     localStorage.removeItem('user');
                    //     setUser(null);
                    // }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = useCallback(async (data: LoginRequest) => {
        try {
            const response = await authApi.login(data);
            const { access_token, user: userData } = response.data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            const axiosError = error as AxiosError<{ detail: string }>;
            throw new Error(axiosError.response?.data?.detail || 'Login failed');
        }
    }, []);

    const logout = useCallback(async () => {
        try {
            // Revoke the rotating refresh token server-side (clears the cookie).
            await authApi.logout();
        } catch (error) {
            // Even if revocation fails (network, already expired), finish the
            // local logout — the token expires server-side regardless.
            console.error('Logout request failed:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            setUser(null);
            window.location.href = '/login';
        }
    }, []);

    const hasRole = useCallback((roles: UserRole | UserRole[]) => {
        if (!user) return false;
        const roleArray = Array.isArray(roles) ? roles : [roles];
        return roleArray.includes(user.role);
    }, [user]);

    const refreshUser = useCallback(async () => {
        try {
            const response = await authApi.me();
            setUser(response.data);
            localStorage.setItem('user', JSON.stringify(response.data));
        } catch (error) {
            console.error('Failed to refresh user:', error);
        }
    }, []);

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        hasRole,
        refreshUser,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Hook to require authentication
export function useRequireAuth() {
    const { isAuthenticated, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            window.location.href = '/login';
        }
    }, [isAuthenticated, isLoading]);

    return { isAuthenticated, isLoading };
}
