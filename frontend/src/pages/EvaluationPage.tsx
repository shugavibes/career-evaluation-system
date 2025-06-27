import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { User, EvaluationData } from '../types/types';
import EvaluationForm from '../components/EvaluationForm';
import Toast from '../components/Toast';
import axios from 'axios';

const EvaluationPage: React.FC = () => {
    const { userSlug } = useParams<{ userSlug: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const isLeaderEvaluation = location.pathname.includes('evaluate-leader');
    
    const [user, setUser] = useState<User | null>(null);
    const [initialData, setInitialData] = useState<EvaluationData | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [toast, setToast] = useState<{
        type: 'success' | 'error' | 'info';
        message: string;
        isVisible: boolean;
    }>({
        type: 'info',
        message: '',
        isVisible: false
    });

    const [leaderPassword, setLeaderPassword] = useState('');
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    useEffect(() => {
        if (userSlug) {
            fetchUserData();
        }
    }, [userSlug]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (isLeaderEvaluation) {
            setShowPasswordModal(true);
        }
    }, [isLeaderEvaluation]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const [userResponse, evaluationResponse] = await Promise.all([
                axios.get(`/api/users/${userSlug}`),
                axios.get(`/api/evaluations/${userSlug}/latest`).catch(() => ({ data: { self: null, leader: null } }))
            ]);
            
            setUser(userResponse.data);
            
            // Set initial data based on evaluation type
            const evaluationType = isLeaderEvaluation ? 'leader' : 'self';
            const existingEvaluation = evaluationResponse.data[evaluationType];
            
            if (existingEvaluation) {
                setInitialData({
                    technical_knowledge: existingEvaluation.technical_knowledge,
                    system_design: existingEvaluation.system_design,
                    problem_solving: existingEvaluation.problem_solving,
                    code_quality: existingEvaluation.code_quality,
                    collaboration: existingEvaluation.collaboration,
                    technical_leadership: existingEvaluation.technical_leadership,
                    impact_scope: existingEvaluation.impact_scope,
                });
            }
            
            setError(null);
        } catch (err) {
            setError('Failed to load user data');
            console.error('Error fetching user data:', err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (type: 'success' | 'error' | 'info', message: string) => {
        setToast({ type, message, isVisible: true });
    };

    const hideToast = () => {
        setToast(prev => ({ ...prev, isVisible: false }));
    };

    const handlePasswordSubmit = () => {
        if (!leaderPassword.trim()) {
            showToast('error', 'Please enter the leader password');
            return;
        }
        setShowPasswordModal(false);
    };

    const handleSave = async (data: EvaluationData) => {
        // Auto-save functionality
        try {
            await submitEvaluation(data, false);
        } catch (err) {
            console.error('Auto-save failed:', err);
        }
    };

    const handleSubmit = async (data: EvaluationData) => {
        await submitEvaluation(data, true);
    };

    const submitEvaluation = async (data: EvaluationData, isSubmission: boolean) => {
        if (!user) return;

        try {
            setSubmitting(isSubmission);
            
            const headers: any = {};
            if (isLeaderEvaluation) {
                headers.Authorization = `Bearer ${leaderPassword}`;
            }

            const payload = {
                user_id: user.id,
                evaluator_type: isLeaderEvaluation ? 'leader' : 'self',
                ...data
            };

            await axios.post('/api/evaluations', payload, { headers });
            
            if (isSubmission) {
                showToast('success', 'Evaluation submitted successfully!');
                setTimeout(() => {
                    navigate(`/${user.slug}`);
                }, 2000);
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.error || 'Failed to save evaluation';
            
            if (err.response?.status === 401) {
                showToast('error', 'Invalid leader password');
                setShowPasswordModal(true);
            } else {
                showToast('error', errorMessage);
            }
            
            console.error('Error submitting evaluation:', err);
        } finally {
            setSubmitting(false);
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
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Evaluation</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate(`/${userSlug}`)}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            {/* Password Modal for Leader Evaluation */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Leader Authorization Required
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Please enter the leader password to access leader evaluation mode.
                        </p>
                        <input
                            type="password"
                            value={leaderPassword}
                            onChange={(e) => setLeaderPassword(e.target.value)}
                            placeholder="Enter leader password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4"
                            onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                        />
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => navigate(`/${user.slug}`)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePasswordSubmit}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            {!showPasswordModal && (
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <EvaluationForm
                        user={user}
                        evaluatorType={isLeaderEvaluation ? 'leader' : 'self'}
                        initialData={initialData || undefined}
                        onSubmit={handleSubmit}
                        onSave={handleSave}
                        isLoading={submitting}
                    />
                </div>
            )}

            {/* Toast Notifications */}
            <Toast
                type={toast.type}
                message={toast.message}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </div>
    );
};

export default EvaluationPage; 