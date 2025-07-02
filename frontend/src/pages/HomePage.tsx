import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User } from '../types/types';
import axios from 'axios';

const HomePage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('/api/users');
            const sortedUsers = sortUsersByRole(response.data);
            setUsers(sortedUsers);
            setError(null);
        } catch (err) {
            setError('Failed to load team members');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    const sortUsersByRole = (users: User[]) => {
        const roleOrder = {
            'tech lead': 1,
            'senior engineer': 2,
            'semi-senior engineer': 3,
            'junior engineer': 4
        };

        return users.sort((a, b) => {
            const roleA = roleOrder[a.position.toLowerCase() as keyof typeof roleOrder] || 999;
            const roleB = roleOrder[b.position.toLowerCase() as keyof typeof roleOrder] || 999;
            
            // Primary sort by position hierarchy
            if (roleA !== roleB) {
                return roleA - roleB;
            }
            
            // Secondary sort by name alphabetically within same position
            return a.name.localeCompare(b.name);
        });
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
            case 'tech lead':
                return 'bg-purple-100 text-purple-800';
            case 'senior engineer':
                return 'bg-blue-100 text-blue-800';
            case 'semi-senior engineer':
                return 'bg-green-100 text-green-800';
            case 'junior engineer':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role.toLowerCase()) {
            case 'tech lead':
                return '👑';
            case 'senior engineer':
                return '🚀';
            case 'semi-senior engineer':
                return '⭐';
            case 'junior engineer':
                return '🌱';
            default:
                return '👤';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">❌</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Data</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchUsers}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Career Evaluation System
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Track growth, identify areas for improvement, and align expectations between team members and leaders.
                    </p>
                </div>

                {/* Team Overview */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Members</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <Link
                                key={user.id}
                                to={`/${user.slug}`}
                                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 hover:border-purple-300"
                            >
                                <div className="flex items-center space-x-4 mb-4">
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                        {user.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg">{user.name}</h3>
                                        <div className="flex items-center space-x-2 mt-1">
                                            <span className="text-lg">{getRoleIcon(user.position)}</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.position)}`}>
                                                {user.position}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-gray-600">Member since:</span>
                                        <span className="text-gray-900">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-purple-600 font-medium">View Dashboard</span>
                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Features Overview */}
                <div className="mt-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Platform Features</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                            <div className="text-3xl mb-3">✍️</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Self-Evaluation</h3>
                            <p className="text-gray-600 text-sm">Assess your own skills across 7 key criteria</p>
                        </div>
                        
                        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                            <div className="text-3xl mb-3">👨‍💼</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Leader Assessment</h3>
                            <p className="text-gray-600 text-sm">Get evaluated by your team lead or manager</p>
                        </div>
                        
                        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                            <div className="text-3xl mb-3">📊</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Radar Charts</h3>
                            <p className="text-gray-600 text-sm">Visualize evaluation results with interactive charts</p>
                        </div>
                        
                        <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                            <div className="text-3xl mb-3">📈</div>
                            <h3 className="font-semibold text-gray-900 mb-2">Gap Analysis</h3>
                            <p className="text-gray-600 text-sm">Identify differences between self and leader evaluations</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomePage; 