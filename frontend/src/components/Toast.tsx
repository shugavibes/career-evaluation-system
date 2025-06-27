import React, { useEffect } from 'react';
import { ToastProps } from '../types/types';

const Toast: React.FC<ToastProps> = ({ type, message, isVisible, onClose }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose();
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose]);

    if (!isVisible) return null;

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'info':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'info':
                return 'ℹ️';
            default:
                return '📝';
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className={`rounded-lg shadow-lg p-4 max-w-sm ${getToastStyles()}`}>
                <div className="flex items-center space-x-3">
                    <span className="text-lg">{getIcon()}</span>
                    <p className="flex-1 text-sm font-medium">{message}</p>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-gray-200 focus:outline-none"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Toast; 