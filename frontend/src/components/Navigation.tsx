import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface NavigationProps {
    userSlug?: string;
}

const Navigation: React.FC<NavigationProps> = ({ userSlug }) => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const handleLogout = () => {
        logout();
    };

    // If no user is logged in, don't show navigation
    if (!user) {
        return null;
    }

    // Navigation links based on user role
    const getNavLinks = () => {
        if (user.role === 'manager') {
            return [
                { path: '/manager', label: 'Manager Dashboard', icon: '👨‍💼' },
                { path: '/', label: 'Team Overview', icon: '👥' },
            ];
        } else {
            // Team member navigation
            return [
                { path: `/${user.slug}`, label: 'My Dashboard', icon: '📊' },
                { path: `/${user.slug}/evaluate`, label: 'Self-Evaluate', icon: '✍️' },
                { path: `/${user.slug}/comparison`, label: 'Compare Results', icon: '📈' },
            ];
        }
    };

    const navLinks = getNavLinks();

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    {/* Left side - Logo and main navigation */}
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="flex items-center space-x-2">
                            <span className="text-2xl">📊</span>
                            <span className="font-bold text-xl text-gray-900">Career Evaluation</span>
                        </Link>
                        
                        <div className="hidden md:flex space-x-6">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive(link.path)
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                                >
                                    <span>{link.icon}</span>
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right side - User menu */}
                    <div className="flex items-center space-x-4">
                        {/* User info */}
                        <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {user.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="hidden md:block">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</div>
                            </div>
                        </div>

                        {/* Logout button */}
                        <button
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button - simplified for now */}
                    <div className="md:hidden flex items-center">
                        <button className="text-gray-600 hover:text-gray-900 p-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile navigation - could be enhanced with a dropdown */}
                <div className="md:hidden border-t border-gray-200 pt-4 pb-3">
                    <div className="space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium transition-colors ${
                                    isActive(link.path)
                                        ? 'bg-purple-100 text-purple-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                            >
                                <span>{link.icon}</span>
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 