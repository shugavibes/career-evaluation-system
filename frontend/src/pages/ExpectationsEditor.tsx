import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, UserExpectations } from '../types/types';
import axios from 'axios';

const ExpectationsEditor: React.FC = () => {
    const { userSlug } = useParams<{ userSlug: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const [expectations, setExpectations] = useState<UserExpectations>({
        actions: {
            technical_knowledge: [],
            system_design: [],
            problem_solving: [],
            impact_scope: []
        },
        leadership: [],
        competencies: {
            ownership: [],
            quality: [],
            honesty: [],
            kindness: []
        },
        results: []
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (userSlug) {
            fetchUserData();
        }
    }, [userSlug]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/users/${userSlug}`);
            setUser(response.data);
            
            if (response.data.expectations) {
                setExpectations(response.data.expectations);
            }
            
            setError(null);
        } catch (err: any) {
            setError('Failed to load user data');
            console.error('Error fetching user data:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleArrayChange = (section: keyof UserExpectations, field: string | undefined, index: number, value: string) => {
        setExpectations(prev => {
            const newExpectations = { ...prev };
            
            if (field) {
                // Nested field (like technical_knowledge in actions)
                const sectionData = newExpectations[section] as any;
                const fieldArray = [...(sectionData[field] || [])];
                fieldArray[index] = value;
                sectionData[field] = fieldArray;
            } else {
                // Direct array field (like leadership)
                const fieldArray = [...(newExpectations[section] as string[])];
                fieldArray[index] = value;
                newExpectations[section] = fieldArray as any;
            }
            
            return newExpectations;
        });
    };

    const addArrayItem = (section: keyof UserExpectations, field?: string) => {
        setExpectations(prev => {
            const newExpectations = { ...prev };
            
            if (field) {
                // Nested field
                const sectionData = newExpectations[section] as any;
                const fieldArray = [...(sectionData[field] || [])];
                fieldArray.push('');
                sectionData[field] = fieldArray;
            } else {
                // Direct array field
                const fieldArray = [...(newExpectations[section] as string[])];
                fieldArray.push('');
                newExpectations[section] = fieldArray as any;
            }
            
            return newExpectations;
        });
    };

    const removeArrayItem = (section: keyof UserExpectations, field: string | undefined, index: number) => {
        setExpectations(prev => {
            const newExpectations = { ...prev };
            
            if (field) {
                // Nested field
                const sectionData = newExpectations[section] as any;
                const fieldArray = [...(sectionData[field] || [])];
                fieldArray.splice(index, 1);
                sectionData[field] = fieldArray;
            } else {
                // Direct array field
                const fieldArray = [...(newExpectations[section] as string[])];
                fieldArray.splice(index, 1);
                newExpectations[section] = fieldArray as any;
            }
            
            return newExpectations;
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError(null);
            
            await axios.put(`/api/users/${userSlug}/expectations`, expectations);
            
            setSuccessMessage('Expectations updated successfully!');
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err: any) {
            setError('Failed to save expectations');
            console.error('Error saving expectations:', err);
        } finally {
            setSaving(false);
        }
    };

    const renderArraySection = (
        title: string,
        items: string[],
        section: keyof UserExpectations,
        field?: string,
        icon: string = '•',
        color: string = 'gray'
    ) => (
        <div className={`bg-${color}-50 rounded-lg p-6`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-medium text-${color}-900`}>
                    {icon} {title}
                </h3>
                <button
                    onClick={() => addArrayItem(section, field)}
                    className={`px-3 py-1 bg-${color}-600 text-white text-sm rounded hover:bg-${color}-700`}
                >
                    Add Item
                </button>
            </div>
            
            <div className="space-y-3">
                {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <textarea
                            value={item}
                            onChange={(e) => handleArrayChange(section, field, index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 resize-none"
                            rows={2}
                            placeholder={`Enter ${title.toLowerCase()} expectation...`}
                        />
                        <button
                            onClick={() => removeArrayItem(section, field, index)}
                            className="px-2 py-2 text-red-600 hover:text-red-800"
                        >
                            ✕
                        </button>
                    </div>
                ))}
                
                {items.length === 0 && (
                    <p className={`text-${color}-600 text-sm italic`}>
                        No expectations added yet. Click "Add Item" to get started.
                    </p>
                )}
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    if (error && !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">❌</div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading User</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => navigate('/manager')}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Back to Dashboard
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
                    <nav className="text-sm text-gray-500 mb-4">
                        <button
                            onClick={() => navigate('/manager')}
                            className="hover:text-purple-600"
                        >
                            Manager Dashboard
                        </button>
                        <span className="mx-2">›</span>
                        <span>Edit Expectations</span>
                    </nav>
                    
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Edit Expectations for {user?.name}
                            </h1>
                            <p className="text-gray-600">
                                Define role-specific expectations and goals for {user?.position}
                            </p>
                        </div>
                        
                        <div className="flex space-x-3">
                            <button
                                onClick={() => navigate('/manager')}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Success/Error Messages */}
                {successMessage && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="text-green-400 text-sm">✅</div>
                            <div className="ml-3">
                                <p className="text-sm text-green-800">{successMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex">
                            <div className="text-red-400 text-sm">⚠️</div>
                            <div className="ml-3">
                                <p className="text-sm text-red-800">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Actions Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">⚡ Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderArraySection(
                            'Technical Knowledge',
                            expectations.actions.technical_knowledge,
                            'actions',
                            'technical_knowledge',
                            '🔧',
                            'blue'
                        )}
                        {renderArraySection(
                            'System Design',
                            expectations.actions.system_design,
                            'actions',
                            'system_design',
                            '🏗️',
                            'green'
                        )}
                        {renderArraySection(
                            'Problem Solving',
                            expectations.actions.problem_solving,
                            'actions',
                            'problem_solving',
                            '🧩',
                            'purple'
                        )}
                        {renderArraySection(
                            'Impact & Scope',
                            expectations.actions.impact_scope,
                            'actions',
                            'impact_scope',
                            '🎯',
                            'orange'
                        )}
                    </div>
                </div>

                {/* Leadership Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">👑 Leadership</h2>
                    {renderArraySection(
                        'Leadership Expectations',
                        expectations.leadership,
                        'leadership',
                        undefined,
                        '⭐',
                        'yellow'
                    )}
                </div>

                {/* Competencies Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">💪 Competencies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderArraySection(
                            'Ownership',
                            expectations.competencies.ownership,
                            'competencies',
                            'ownership',
                            '🏆',
                            'red'
                        )}
                        {renderArraySection(
                            'Quality',
                            expectations.competencies.quality,
                            'competencies',
                            'quality',
                            '✨',
                            'indigo'
                        )}
                        {renderArraySection(
                            'Honesty',
                            expectations.competencies.honesty,
                            'competencies',
                            'honesty',
                            '💯',
                            'teal'
                        )}
                        {renderArraySection(
                            'Kindness',
                            expectations.competencies.kindness,
                            'competencies',
                            'kindness',
                            '❤️',
                            'pink'
                        )}
                    </div>
                </div>

                {/* Results Section */}
                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-900 mb-6">📊 Results</h2>
                    {renderArraySection(
                        'Expected Results',
                        expectations.results,
                        'results',
                        undefined,
                        '🎯',
                        'gray'
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExpectationsEditor; 