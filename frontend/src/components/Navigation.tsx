import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavigationProps {
    userSlug?: string;
}

const Navigation: React.FC<NavigationProps> = ({ userSlug }) => {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const navLinks = [
        { path: '/', label: 'Team Overview', icon: '👥' },
        ...(userSlug ? [
            { path: `/${userSlug}`, label: 'Dashboard', icon: '📊' },
            { path: `/${userSlug}/evaluate`, label: 'Self-Evaluate', icon: '✍️' },
            { path: `/${userSlug}/evaluate-leader`, label: 'Leader Evaluate', icon: '👨‍💼' },
            { path: `/${userSlug}/comparison`, label: 'Compare Results', icon: '📈' },
        ] : [])
    ];

    return (
        <nav className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center space-x-8">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">CE</span>
                            </div>
                            <span className="font-bold text-gray-900 text-lg">Career Evaluation</span>
                        </Link>

                        {/* Navigation Links */}
                        <div className="hidden md:flex items-center space-x-4">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        isActive(link.path)
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                    }`}
                                >
                                    <span>{link.icon}</span>
                                    <span>{link.label}</span>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            type="button"
                            className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2"
                            aria-label="Menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden">
                <div className="px-2 pt-2 pb-3 space-y-1 bg-gray-50">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                isActive(link.path)
                                    ? 'bg-purple-100 text-purple-700'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                            }`}
                        >
                            <span>{link.icon}</span>
                            <span>{link.label}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
};

export default Navigation; 