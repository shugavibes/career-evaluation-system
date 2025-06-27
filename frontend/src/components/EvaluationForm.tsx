import React, { useState, useEffect } from 'react';
import { evaluationCriteria } from '../data/evaluationCriteria';
import { EvaluationData, User } from '../types/types';

interface EvaluationFormProps {
    user: User;
    evaluatorType: 'self' | 'leader';
    initialData?: EvaluationData;
    onSubmit: (data: EvaluationData) => void;
    onSave?: (data: EvaluationData) => void;
    isLoading?: boolean;
}

const EvaluationForm: React.FC<EvaluationFormProps> = ({
    user,
    evaluatorType,
    initialData,
    onSubmit,
    onSave,
    isLoading = false
}) => {
    const [currentCriterionIndex, setCurrentCriterionIndex] = useState(0);
    const [formData, setFormData] = useState<EvaluationData>({
        technical_knowledge: 0,
        system_design: 0,
        problem_solving: 0,
        code_quality: 0,
        collaboration: 0,
        technical_leadership: 0,
        impact_scope: 0,
    });

    const [lastSaved, setLastSaved] = useState<Date | null>(null);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    // Auto-save functionality
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onSave && Object.values(formData).some(value => value > 0)) {
                onSave(formData);
                setLastSaved(new Date());
            }
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [formData, onSave]);

    const currentCriterion = evaluationCriteria[currentCriterionIndex];
    const criterionKey = currentCriterion.id as keyof EvaluationData;
    const currentValue = formData[criterionKey];

    const handleLevelSelect = (level: number) => {
        setFormData(prev => ({
            ...prev,
            [criterionKey]: level
        }));
    };

    const handleNext = () => {
        if (currentCriterionIndex < evaluationCriteria.length - 1) {
            setCurrentCriterionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentCriterionIndex > 0) {
            setCurrentCriterionIndex(prev => prev - 1);
        }
    };

    const handleSubmit = () => {
        onSubmit(formData);
    };

    const isFormComplete = Object.values(formData).every(value => value >= 0);
    const progress = ((currentCriterionIndex + 1) / evaluationCriteria.length) * 100;

    return (
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {evaluatorType === 'self' ? 'Self-Evaluation' : 'Leader Evaluation'}
                </h1>
                <h2 className="text-xl text-gray-600 mb-4">
                    {user.name} - {user.role}
                </h2>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                <p className="text-sm text-gray-600">
                    Question {currentCriterionIndex + 1} of {evaluationCriteria.length}
                </p>
            </div>

            {/* Current Criterion */}
            <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                    {currentCriterion.name}
                </h3>
                <p className="text-gray-700 mb-6">
                    {currentCriterion.description}
                </p>

                {/* Level Selection */}
                <div className="space-y-4">
                    {currentCriterion.levels.map((level) => (
                        <div
                            key={level.level}
                            className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                                currentValue === level.level
                                    ? 'border-purple-500 bg-purple-50 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                            onClick={() => handleLevelSelect(level.level)}
                        >
                            <div className="flex items-start space-x-3">
                                <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                    currentValue === level.level
                                        ? 'border-purple-500 bg-purple-500'
                                        : 'border-gray-300'
                                }`}>
                                    {currentValue === level.level && (
                                        <div className="w-2 h-2 bg-white rounded-full" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-2">
                                        <span className="font-semibold text-gray-900">
                                            Level {level.level}
                                        </span>
                                        <span className="text-purple-600 font-medium">
                                            {level.title}
                                        </span>
                                    </div>
                                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                                        {level.bullets.map((bullet, index) => (
                                            <li key={index} className="text-sm">
                                                {bullet}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t">
                <button
                    onClick={handlePrevious}
                    disabled={currentCriterionIndex === 0}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    Previous
                </button>

                <div className="flex items-center space-x-4">
                    {lastSaved && (
                        <span className="text-sm text-gray-500">
                            Last saved: {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                    
                    {currentCriterionIndex === evaluationCriteria.length - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormComplete || isLoading}
                            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                        >
                            {isLoading ? 'Submitting...' : 'Submit Evaluation'}
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EvaluationForm; 