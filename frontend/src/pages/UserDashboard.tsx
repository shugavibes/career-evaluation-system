import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { User, ComparisonData } from '../types/types';
import RadarChart from '../components/RadarChart';
import axios from 'axios';

const UserDashboard: React.FC = () => {
    const { userSlug } = useParams<{ userSlug: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [evaluationData, setEvaluationData] = useState<ComparisonData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userSlug) {
            fetchUserData();
        }
    }, [userSlug]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const [userResponse, evaluationResponse] = await Promise.all([
                axios.get(`/api/users/${userSlug}`),
                axios.get(`/api/evaluations/${userSlug}/latest`).catch(() => ({ data: { self: null, leader: null } }))
            ]);
            
            setUser(userResponse.data);
            setEvaluationData(evaluationResponse.data);
            setError(null);
        } catch (err) {
            setError('Failed to load user data');
            console.error('Error fetching user data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getRoleColor = (role: string) => {
        switch (role.toLowerCase()) {
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">❌</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link
                        to="/"
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Back to Team Overview
                    </Link>
                </div>
            </div>
        );
    }

    const hasEvaluations = evaluationData?.self || evaluationData?.leader;
    const radarData = [];
    
    if (evaluationData?.self) {
        radarData.push({
            name: 'Self-Evaluation',
            technical_knowledge: evaluationData.self.technical_knowledge,
            system_design: evaluationData.self.system_design,
            problem_solving: evaluationData.self.problem_solving,
            code_quality: evaluationData.self.code_quality,
            collaboration: evaluationData.self.collaboration,
            technical_leadership: evaluationData.self.technical_leadership,
            impact_scope: evaluationData.self.impact_scope,
        });
    }

    if (evaluationData?.leader) {
        radarData.push({
            name: 'Leader Evaluation',
            technical_knowledge: evaluationData.leader.technical_knowledge,
            system_design: evaluationData.leader.system_design,
            problem_solving: evaluationData.leader.problem_solving,
            code_quality: evaluationData.leader.code_quality,
            collaboration: evaluationData.leader.collaboration,
            technical_leadership: evaluationData.leader.technical_leadership,
            impact_scope: evaluationData.leader.impact_scope,
        });
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                            {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
                            <div className="flex items-center space-x-2 mt-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role)}`}>
                                    {user.role}
                                </span>
                                <span className="text-gray-500">•</span>
                                <span className="text-gray-600">
                                    Member since {new Date(user.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <Link
                        to={`/${user.slug}/evaluate`}
                        className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-purple-500"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="text-2xl">✍️</div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Self-Evaluate</h3>
                                <p className="text-sm text-gray-600">
                                    {evaluationData?.self ? 'Update your evaluation' : 'Start your evaluation'}
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to={`/${user.slug}/evaluate-leader`}
                        className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="text-2xl">👨‍💼</div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Leader Evaluate</h3>
                                <p className="text-sm text-gray-600">
                                    {evaluationData?.leader ? 'Update leader evaluation' : 'Get evaluated by leader'}
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to={`/${user.slug}/comparison`}
                        className={`bg-white p-6 rounded-lg shadow-sm transition-shadow border-l-4 ${
                            hasEvaluations ? 'hover:shadow-md border-green-500' : 'border-gray-300 opacity-50 cursor-not-allowed'
                        }`}
                        {...(!hasEvaluations && { onClick: (e) => e.preventDefault() })}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="text-2xl">📈</div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Compare Results</h3>
                                <p className="text-sm text-gray-600">
                                    {hasEvaluations ? 'View detailed comparison' : 'Complete an evaluation first'}
                                </p>
                            </div>
                        </div>
                    </Link>

                    <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-gray-300">
                        <div className="flex items-center space-x-3">
                            <div className="text-2xl">📊</div>
                            <div>
                                <h3 className="font-semibold text-gray-900">History</h3>
                                <p className="text-sm text-gray-600">View past evaluations</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Evaluation Status & Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Status Cards */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">Evaluation Status</h2>
                        
                        {/* Self Evaluation Status */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-900">Self-Evaluation</h3>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    evaluationData?.self ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {evaluationData?.self ? 'Complete' : 'Pending'}
                                </span>
                            </div>
                            {evaluationData?.self ? (
                                <p className="text-sm text-gray-600">
                                    Last updated: {new Date(evaluationData.self.updated_at).toLocaleDateString()}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    Start your self-evaluation to track your progress
                                </p>
                            )}
                        </div>

                        {/* Leader Evaluation Status */}
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="font-medium text-gray-900">Leader Evaluation</h3>
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                    evaluationData?.leader ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                }`}>
                                    {evaluationData?.leader ? 'Complete' : 'Pending'}
                                </span>
                            </div>
                            {evaluationData?.leader ? (
                                <p className="text-sm text-gray-600">
                                    Last updated: {new Date(evaluationData.leader.updated_at).toLocaleDateString()}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-600">
                                    Ask your leader to complete your evaluation
                                </p>
                            )}
                        </div>

                        {/* Next Steps */}
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h3 className="font-medium text-blue-900 mb-2">Next Steps</h3>
                            <ul className="text-sm text-blue-800 space-y-1">
                                {!evaluationData?.self && (
                                    <li>• Complete your self-evaluation</li>
                                )}
                                {!evaluationData?.leader && (
                                    <li>• Request leader evaluation</li>
                                )}
                                {hasEvaluations && (
                                    <li>• Review comparison results</li>
                                )}
                                {!hasEvaluations && (
                                    <li>• Start with self-evaluation</li>
                                )}
                            </ul>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="lg:col-span-2">
                        {hasEvaluations ? (
                            <RadarChart
                                data={radarData}
                                title="Current Evaluation Results"
                                showLegend={radarData.length > 1}
                            />
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                                <div className="text-6xl mb-4">📊</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Evaluations Yet</h3>
                                <p className="text-gray-600 mb-6">
                                    Complete your first evaluation to see your radar chart visualization
                                </p>
                                <Link
                                    to={`/${user.slug}/evaluate`}
                                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                                >
                                    Start Self-Evaluation
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard; 