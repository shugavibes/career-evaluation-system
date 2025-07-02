import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ProtectedRouteProps } from '../types/types';

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
    children, 
    requireRole, 
    requireSelfOrManager = false 
}) => {
    const { user, loading } = useAuth();
    const { userSlug } = useParams<{ userSlug: string }>();

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Check role-based access
    if (requireRole && user.role !== requireRole) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">🚫</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                    <p className="text-gray-600 mb-4">
                        You don't have permission to access this page.
                    </p>
                    <p className="text-sm text-gray-500">
                        Required role: {requireRole} | Your role: {user.role}
                    </p>
                </div>
            </div>
        );
    }

    // Check self or manager access
    if (requireSelfOrManager && userSlug) {
        const isManager = user.role === 'manager';
        const isSelf = user.slug === userSlug;
        
        if (!isManager && !isSelf) {
            return (
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-red-500 text-xl mb-4">🚫</div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h2>
                        <p className="text-gray-600 mb-4">
                            You can only access your own profile.
                        </p>
                        <button
                            onClick={() => window.history.back()}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            );
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute; 