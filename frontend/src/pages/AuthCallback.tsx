import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AuthCallback: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login } = useAuth();

    useEffect(() => {
        const handleOAuthCallback = async () => {
            const token = searchParams.get('token');
            const error = searchParams.get('error');

            if (error) {
                console.error('OAuth error:', error);
                navigate('/login?error=oauth_failed');
                return;
            }

            if (token) {
                try {
                    // Store the token
                    localStorage.setItem('authToken', token);
                    
                    // Fetch user info using the token
                    const response = await fetch('/api/auth/me', {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const { user } = await response.json();
                        
                        // Update auth context with user info
                        // Note: This is a bit of a workaround since the login function expects credentials
                        // but we already have the token. In a real app, you might want to create a separate
                        // method for OAuth login in the auth context.
                        
                        // Redirect based on user role
                        const redirectPath = user.role === 'manager' ? '/manager' : `/${user.slug}`;
                        navigate(redirectPath, { replace: true });
                        
                        // Refresh the page to update auth state
                        window.location.reload();
                    } else {
                        throw new Error('Failed to get user info');
                    }
                } catch (error) {
                    console.error('Error processing OAuth callback:', error);
                    navigate('/login?error=oauth_callback_failed');
                }
            } else {
                // No token provided, redirect to login
                navigate('/login?error=oauth_no_token');
            }
        };

        handleOAuthCallback();
    }, [searchParams, navigate, login]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing Sign In</h2>
                <p className="text-gray-600">Please wait while we complete your authentication...</p>
            </div>
        </div>
    );
};

export default AuthCallback; 