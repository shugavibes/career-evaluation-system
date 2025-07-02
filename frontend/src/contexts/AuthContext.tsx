import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { AuthUser, LoginCredentials, AuthContextType } from '../types/types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Configure axios defaults
    axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    axios.defaults.withCredentials = true;

    // Add request interceptor to include auth token
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    // Add response interceptor to handle auth errors
    axios.interceptors.response.use(
        (response) => response,
        (error) => {
            if (error.response?.status === 401) {
                // Token expired or invalid
                localStorage.removeItem('authToken');
                setUser(null);
                setError('Session expired. Please login again.');
            }
            return Promise.reject(error);
        }
    );

    // Check if user is logged in on app start
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await axios.get('/api/auth/me');
            setUser({ ...response.data.user, token });
            setError(null);
        } catch (error) {
            console.error('Auth check failed:', error);
            localStorage.removeItem('authToken');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (credentials: LoginCredentials) => {
        try {
            setLoading(true);
            setError(null);

            const response = await axios.post('/api/auth/login', credentials);
            const { user: userData, token } = response.data;

            // Store token
            localStorage.setItem('authToken', token);
            
            // Set user state
            setUser({ ...userData, token });

        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Login failed. Please try again.';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            // Call logout endpoint
            await axios.post('/api/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            // Always clean up local state
            localStorage.removeItem('authToken');
            setUser(null);
            setError(null);
        }
    };

    const value: AuthContextType = {
        user,
        login,
        logout,
        loading,
        error
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 