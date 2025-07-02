import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/types';
import axios from 'axios';

interface TeamMemberStats extends User {
    self_evaluations: number;
    manager_evaluations: number;
    last_evaluation: string | null;
}

const ManagerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [teamMembers, setTeamMembers] = useState<TeamMemberStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTeamData();
    }, []);

    const fetchTeamData = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/manager/dashboard');
            setTeamMembers(response.data);
            setError(null);
        } catch (err: any) {
            setError('Failed to load team data');
            console.error('Error fetching team data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (position: string) => {
        switch (position.toLowerCase()) {
            case 'tech lead':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'senior engineer':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'semi-senior engineer':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'junior engineer':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getRoleIcon = (position: string) => {
        switch (position.toLowerCase()) {
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

    const getEvaluationStatus = (member: TeamMemberStats) => {
        const hasSelf = member.self_evaluations > 0;
        const hasManager = member.manager_evaluations > 0;
        
        if (hasSelf && hasManager) {
            return { status: 'complete', color: 'text-green-600', icon: '✅' };
        } else if (hasSelf || hasManager) {
            return { status: 'partial', color: 'text-yellow-600', icon: '⚠️' };
        } else {
            return { status: 'pending', color: 'text-red-600', icon: '❌' };
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchTeamData}
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
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Manager Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Welcome back, {user?.name}! Manage your team's evaluations and expectations.
                    </p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-purple-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Total Team Members</p>
                                <p className="text-2xl font-bold text-gray-900">{teamMembers.length}</p>
                            </div>
                            <div className="text-3xl">👥</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Complete Evaluations</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {teamMembers.filter(m => m.self_evaluations > 0 && m.manager_evaluations > 0).length}
                                </p>
                            </div>
                            <div className="text-3xl">✅</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Partial Evaluations</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {teamMembers.filter(m => (m.self_evaluations > 0) !== (m.manager_evaluations > 0)).length}
                                </p>
                            </div>
                            <div className="text-3xl">⚠️</div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-600">Pending Evaluations</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {teamMembers.filter(m => m.self_evaluations === 0 && m.manager_evaluations === 0).length}
                                </p>
                            </div>
                            <div className="text-3xl">❌</div>
                        </div>
                    </div>
                </div>

                {/* Team Members Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Member
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Position
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Evaluation Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Last Activity
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {teamMembers.map((member) => {
                                    const evalStatus = getEvaluationStatus(member);
                                    
                                    return (
                                        <tr key={member.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                        {member.name.split(' ').map(n => n[0]).join('')}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {member.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            {member.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg">{getRoleIcon(member.position)}</span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleColor(member.position)}`}>
                                                        {member.position}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-lg">{evalStatus.icon}</span>
                                                    <div>
                                                        <div className={`text-sm font-medium ${evalStatus.color}`}>
                                                            {evalStatus.status.charAt(0).toUpperCase() + evalStatus.status.slice(1)}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            Self: {member.self_evaluations} | Manager: {member.manager_evaluations}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {member.last_evaluation 
                                                    ? new Date(member.last_evaluation).toLocaleDateString()
                                                    : 'No evaluations'
                                                }
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                <div className="flex space-x-2">
                                                    <Link
                                                        to={`/${member.slug}`}
                                                        className="text-purple-600 hover:text-purple-900"
                                                    >
                                                        View Profile
                                                    </Link>
                                                    <span className="text-gray-300">|</span>
                                                    <Link
                                                        to={`/manager/expectations/${member.slug}`}
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Edit Expectations
                                                    </Link>
                                                    <span className="text-gray-300">|</span>
                                                    <Link
                                                        to={`/${member.slug}/evaluate-leader`}
                                                        className="text-green-600 hover:text-green-900"
                                                    >
                                                        Evaluate
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard; 