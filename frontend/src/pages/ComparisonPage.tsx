import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { User, ComparisonData } from '../types/types';
import ComparisonView from '../components/ComparisonView';
import axios from 'axios';

const ComparisonPage: React.FC = () => {
    const { userSlug } = useParams<{ userSlug: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [comparisonData, setComparisonData] = useState<ComparisonData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (userSlug) {
            fetchData();
        }
    }, [userSlug]); // eslint-disable-line react-hooks/exhaustive-deps

    const fetchData = async () => {
        try {
            setLoading(true);
            const [userResponse, evaluationResponse] = await Promise.all([
                axios.get(`/api/users/${userSlug}`),
                axios.get(`/api/evaluations/${userSlug}/latest`)
            ]);
            
            setUser(userResponse.data);
            setComparisonData(evaluationResponse.data);
            setError(null);
        } catch (err) {
            setError('Failed to load comparison data');
            console.error('Error fetching comparison data:', err);
        } finally {
            setLoading(false);
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Comparison</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <Link
                        to={user ? `/${user.slug}` : '/'}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        {user ? 'Back to Dashboard' : 'Back to Home'}
                    </Link>
                </div>
            </div>
        );
    }

    if (!comparisonData?.self && !comparisonData?.leader) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-yellow-500 text-6xl mb-4">📊</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">No Evaluations to Compare</h2>
                    <p className="text-gray-600 mb-8 max-w-md">
                        You need to complete at least one evaluation before you can view comparisons.
                    </p>
                    <div className="space-x-4">
                        <Link
                            to={`/${user.slug}/evaluate`}
                            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                            Start Self-Evaluation
                        </Link>
                        <Link
                            to={`/${user.slug}`}
                            className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                            Back to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="px-4 sm:px-6 lg:px-8">
                <ComparisonView 
                    data={comparisonData} 
                    userName={user.name}
                />
            </div>
        </div>
    );
};

export default ComparisonPage; 