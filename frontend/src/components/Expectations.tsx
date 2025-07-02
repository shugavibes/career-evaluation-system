import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserExpectations } from '../types/types';
import axios from 'axios';

interface ExpectationsProps {
    expectations: UserExpectations;
    userName: string;
    userSlug: string;
    onExpectationsUpdate?: (newExpectations: UserExpectations) => void;
}

const Expectations: React.FC<ExpectationsProps> = ({ 
    expectations, 
    userName, 
    userSlug, 
    onExpectationsUpdate 
}) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedExpectations, setEditedExpectations] = useState<UserExpectations>(expectations);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saveSuccess, setShowSuccess] = useState(false);

    const isManager = user?.role === 'manager';

    const isExpectationsEmpty = (expectations: UserExpectations): boolean => {
        return (
            (!expectations.actions.technical_knowledge || expectations.actions.technical_knowledge.length === 0) &&
            (!expectations.actions.system_design || expectations.actions.system_design.length === 0) &&
            (!expectations.actions.problem_solving || expectations.actions.problem_solving.length === 0) &&
            (!expectations.actions.impact_scope || expectations.actions.impact_scope.length === 0) &&
            (!expectations.leadership || expectations.leadership.length === 0) &&
            (!expectations.competencies.ownership || expectations.competencies.ownership.length === 0) &&
            (!expectations.competencies.quality || expectations.competencies.quality.length === 0) &&
            (!expectations.competencies.honesty || expectations.competencies.honesty.length === 0) &&
            (!expectations.competencies.kindness || expectations.competencies.kindness.length === 0) &&
            (!expectations.results || expectations.results.length === 0)
        );
    };

    const handleEdit = () => {
        setIsEditing(true);
        setEditedExpectations(expectations);
        setSaveError(null);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditedExpectations(expectations);
        setSaveError(null);
    };

    const handleSave = async () => {
        try {
            setIsSaving(true);
            setSaveError(null);
            
            await axios.put(`/api/users/${userSlug}/expectations`, editedExpectations);
            
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
            
            // Notify parent component of the update
            if (onExpectationsUpdate) {
                onExpectationsUpdate(editedExpectations);
            }
        } catch (error: any) {
            setSaveError(error.response?.data?.error || 'Failed to save expectations');
        } finally {
            setIsSaving(false);
        }
    };

    const updateExpectationArray = (path: string[], newValue: string[]) => {
        setEditedExpectations(prev => {
            const updated = { ...prev };
            let current: any = updated;
            
            // Navigate to the parent object
            for (let i = 0; i < path.length - 1; i++) {
                current = current[path[i]];
            }
            
            // Set the value
            current[path[path.length - 1]] = newValue;
            
            return updated;
        });
    };

    const renderEditableList = (
        items: string[], 
        icon: string, 
        path: string[], 
        placeholder: string
    ) => {
        if (!isEditing) {
            return renderList(items, icon);
        }

        const textareaValue = items.join('\n');
        
        return (
            <textarea
                value={textareaValue}
                onChange={(e) => {
                    const newItems = e.target.value
                        .split('\n')
                        .map(item => item.trim())
                        .filter(item => item.length > 0);
                    updateExpectationArray(path, newItems);
                }}
                placeholder={placeholder}
                className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                rows={Math.max(3, items.length + 1)}
            />
        );
    };

    const renderList = (items: string[], icon: string) => {
        if (!items || items.length === 0) {
            return (
                <div className="text-center py-4">
                    {isManager ? (
                        <div className="text-gray-500 text-sm">
                            <p className="mb-2">📝 No expectations set yet</p>
                            <p className="text-xs">Click "Edit" to add expectations for this section</p>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No expectations defined yet</p>
                    )}
                </div>
            );
        }

        return (
            <ul className="space-y-2">
                {items.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                        <span className="text-sm mt-0.5">{icon}</span>
                        <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                    </li>
                ))}
            </ul>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <div className="flex items-center space-x-2">
                        <span className="text-2xl">🎯</span>
                        <h2 className="text-xl font-semibold text-gray-900">
                            Expectations for {userName}
                        </h2>
                    </div>
                    {isManager && !isEditing && isExpectationsEmpty(expectations) && (
                        <p className="text-sm text-gray-600 mt-2">
                            💡 No expectations have been set yet. Click "Edit" to define role-specific goals and expectations.
                        </p>
                    )}
                </div>
                
                {isManager && (
                    <div className="flex items-center space-x-2">
                        {saveSuccess && (
                            <span className="text-green-600 text-sm font-medium">✅ Saved!</span>
                        )}
                        {saveError && (
                            <span className="text-red-600 text-sm font-medium">❌ {saveError}</span>
                        )}
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                ✏️ Edit
                            </button>
                        ) : (
                            <div className="flex space-x-2">
                                <button
                                    onClick={handleCancel}
                                    disabled={isSaving}
                                    className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
                                >
                                    {isSaving && <div className="animate-spin w-3 h-3 border border-white border-t-transparent rounded-full"></div>}
                                    <span>{isSaving ? 'Saving...' : '💾 Save'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {isEditing && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                        💡 <strong>Editing Mode:</strong> Enter each expectation on a separate line. Empty lines will be removed automatically.
                    </p>
                </div>
            )}

            <div className="space-y-8">
                {/* Actions Section */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <span className="text-xl">⚡</span>
                        <span>Actions</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-medium text-blue-900 mb-3 flex items-center space-x-2">
                                <span className="text-sm">🔧</span>
                                <span>Technical Knowledge</span>
                            </h4>
                            {renderEditableList(
                                isEditing ? editedExpectations.actions.technical_knowledge : expectations.actions.technical_knowledge,
                                '•',
                                ['actions', 'technical_knowledge'],
                                'Enter technical knowledge expectations...'
                            )}
                        </div>
                        <div className="bg-green-50 rounded-lg p-4">
                            <h4 className="font-medium text-green-900 mb-3 flex items-center space-x-2">
                                <span className="text-sm">🏗️</span>
                                <span>System Design</span>
                            </h4>
                            {renderEditableList(
                                isEditing ? editedExpectations.actions.system_design : expectations.actions.system_design,
                                '•',
                                ['actions', 'system_design'],
                                'Enter system design expectations...'
                            )}
                        </div>
                        <div className="bg-purple-50 rounded-lg p-4">
                            <h4 className="font-medium text-purple-900 mb-3 flex items-center space-x-2">
                                <span className="text-sm">🧩</span>
                                <span>Problem Solving</span>
                            </h4>
                            {renderEditableList(
                                isEditing ? editedExpectations.actions.problem_solving : expectations.actions.problem_solving,
                                '•',
                                ['actions', 'problem_solving'],
                                'Enter problem solving expectations...'
                            )}
                        </div>
                        <div className="bg-orange-50 rounded-lg p-4">
                            <h4 className="font-medium text-orange-900 mb-3 flex items-center space-x-2">
                                <span className="text-sm">🎯</span>
                                <span>Impact & Scope</span>
                            </h4>
                            {renderEditableList(
                                isEditing ? editedExpectations.actions.impact_scope : expectations.actions.impact_scope,
                                '•',
                                ['actions', 'impact_scope'],
                                'Enter impact and scope expectations...'
                            )}
                        </div>
                    </div>
                </div>

                {/* Leadership Section */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <span className="text-xl">👑</span>
                        <span>Leadership</span>
                    </h3>
                    <div className="bg-yellow-50 rounded-lg p-4">
                        {renderEditableList(
                            isEditing ? editedExpectations.leadership : expectations.leadership,
                            '⭐',
                            ['leadership'],
                            'Enter leadership expectations...'
                        )}
                    </div>
                </div>

                {/* Competencies Section */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <span className="text-xl">💪</span>
                        <span>Competencies</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-red-50 rounded-lg p-4">
                            <h4 className="font-medium text-red-900 mb-3 flex items-center space-x-2">
                                <span className="text-sm">🏆</span>
                                <span>Ownership</span>
                            </h4>
                            {renderEditableList(
                                isEditing ? editedExpectations.competencies.ownership : expectations.competencies.ownership,
                                '•',
                                ['competencies', 'ownership'],
                                'Enter ownership expectations...'
                            )}
                        </div>
                        <div className="bg-indigo-50 rounded-lg p-4">
                            <h4 className="font-medium text-indigo-900 mb-3 flex items-center space-x-2">
                                <span className="text-sm">✨</span>
                                <span>Quality</span>
                            </h4>
                            {renderEditableList(
                                isEditing ? editedExpectations.competencies.quality : expectations.competencies.quality,
                                '•',
                                ['competencies', 'quality'],
                                'Enter quality expectations...'
                            )}
                        </div>
                        <div className="bg-teal-50 rounded-lg p-4">
                            <h4 className="font-medium text-teal-900 mb-3 flex items-center space-x-2">
                                <span className="text-sm">💯</span>
                                <span>Honesty</span>
                            </h4>
                            {renderEditableList(
                                isEditing ? editedExpectations.competencies.honesty : expectations.competencies.honesty,
                                '•',
                                ['competencies', 'honesty'],
                                'Enter honesty expectations...'
                            )}
                        </div>
                        <div className="bg-pink-50 rounded-lg p-4">
                            <h4 className="font-medium text-pink-900 mb-3 flex items-center space-x-2">
                                <span className="text-sm">❤️</span>
                                <span>Kindness</span>
                            </h4>
                            {renderEditableList(
                                isEditing ? editedExpectations.competencies.kindness : expectations.competencies.kindness,
                                '•',
                                ['competencies', 'kindness'],
                                'Enter kindness expectations...'
                            )}
                        </div>
                    </div>
                </div>

                {/* Results Section */}
                <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
                        <span className="text-xl">📊</span>
                        <span>Results</span>
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        {renderEditableList(
                            isEditing ? editedExpectations.results : expectations.results,
                            '🎯',
                            ['results'],
                            'Enter results expectations...'
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Expectations; 