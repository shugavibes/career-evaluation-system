import React, { useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoginCredentials } from '../types/types';
import GoogleLoginButton from '../components/GoogleLoginButton';

const LoginPage: React.FC = () => {
    const { user, login, loading, error } = useAuth();
    const [searchParams] = useSearchParams();
    const [credentials, setCredentials] = useState<LoginCredentials>({
        email: '',
        password: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCredentials, setShowCredentials] = useState(false);
    const [oauthError, setOauthError] = useState<string | null>(null);

    // Check for OAuth errors in URL params
    React.useEffect(() => {
        const errorParam = searchParams.get('error');
        if (errorParam) {
            switch (errorParam) {
                case 'oauth_failed':
                    setOauthError('Google sign-in failed. Please try again.');
                    break;
                case 'oauth_callback_failed':
                    setOauthError('Authentication failed. Please try again.');
                    break;
                case 'oauth_no_token':
                    setOauthError('Authentication incomplete. Please try again.');
                    break;
                default:
                    setOauthError('Authentication error. Please try again.');
            }
        }
    }, [searchParams]);

    // Redirect if already logged in
    if (user && !loading) {
        const redirectPath = user.role === 'manager' ? '/manager' : `/${user.slug}`;
        return <Navigate to={redirectPath} replace />;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!credentials.email || !credentials.password) {
            return;
        }

        try {
            setIsSubmitting(true);
            await login(credentials);
        } catch (error) {
            // Error is handled by the auth context
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fillManagerCredentials = () => {
        setCredentials({
            email: 'manager@company.com',
            password: 'manager123'
        });
    };

    const fillTeamMemberCredentials = () => {
        setCredentials({
            email: 'fede.cano@company.com',
            password: 'password123'
        });
    };

    const handleGoogleSuccess = (response: any) => {
        console.log('Google OAuth success:', response);
        // The AuthCallback component will handle the redirect
    };

    const handleGoogleError = (error: any) => {
        console.error('Google OAuth error:', error);
        setOauthError('Google sign-in failed. Please try again.');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Logo and Title */}
                <div className="text-center">
                    <div className="text-6xl mb-4">📊</div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Career Evaluation System
                    </h2>
                    <p className="text-gray-600">
                        Sign in to access your dashboard
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-xl shadow-lg p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {(error || oauthError) && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex">
                                    <div className="text-red-400 text-sm">⚠️</div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-800">{error || oauthError}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={credentials.email}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Enter your email"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={credentials.password}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-purple-500 focus:border-purple-500"
                                placeholder="Enter your password"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || !credentials.email || !credentials.password}
                            className="w-full py-2 px-4 bg-purple-600 text-white font-medium rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </span>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>
                    </div>

                    {/* Google Login */}
                    <div className="mt-6">
                        <GoogleLoginButton
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            disabled={isSubmitting}
                        />
                    </div>

                    {/* Demo Credentials */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                        <button
                            onClick={() => setShowCredentials(!showCredentials)}
                            className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                        >
                            {showCredentials ? 'Hide' : 'Show'} demo credentials
                        </button>
                        
                        {showCredentials && (
                            <div className="mt-4 space-y-3">
                                <div className="bg-purple-50 p-3 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-purple-900">Manager Access</p>
                                            <p className="text-xs text-purple-700">Full team management</p>
                                        </div>
                                        <button
                                            onClick={fillManagerCredentials}
                                            className="text-xs bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                                        >
                                            Use
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-blue-900">Team Member Access</p>
                                            <p className="text-xs text-blue-700">Personal dashboard only</p>
                                        </div>
                                        <button
                                            onClick={fillTeamMemberCredentials}
                                            className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                        >
                                            Use
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center text-sm text-gray-500">
                    Career Evaluation System v1.0
                </div>
            </div>
        </div>
    );
};

export default LoginPage; 