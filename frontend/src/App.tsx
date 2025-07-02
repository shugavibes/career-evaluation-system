import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navigation from './components/Navigation';
// import Toast from './components/Toast';

// Pages
import LoginPage from './pages/LoginPage';
import AuthCallback from './pages/AuthCallback';
import HomePage from './pages/HomePage';
import UserDashboard from './pages/UserDashboard';
import EvaluationPage from './pages/EvaluationPage';
import ComparisonPage from './pages/ComparisonPage';
import ManagerDashboard from './pages/ManagerDashboard';
import ExpectationsEditor from './pages/ExpectationsEditor';

import './App.css';

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="App">
                    <Navigation />
                    
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/auth/callback" element={<AuthCallback />} />
                        
                        {/* Protected routes - Manager only */}
                        <Route 
                            path="/manager" 
                            element={
                                <ProtectedRoute requireRole="manager">
                                    <ManagerDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/manager/expectations/:userSlug" 
                            element={
                                <ProtectedRoute requireRole="manager">
                                    <ExpectationsEditor />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Protected routes - Team overview (authenticated users) */}
                        <Route 
                            path="/" 
                            element={
                                <ProtectedRoute>
                                    <HomePage />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Protected routes - User specific (self or manager) */}
                        <Route 
                            path="/:userSlug" 
                            element={
                                <ProtectedRoute requireSelfOrManager>
                                    <UserDashboard />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/:userSlug/evaluate" 
                            element={
                                <ProtectedRoute requireSelfOrManager>
                                    <EvaluationPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/:userSlug/evaluate-leader" 
                            element={
                                <ProtectedRoute requireRole="manager">
                                    <EvaluationPage />
                                </ProtectedRoute>
                            } 
                        />
                        <Route 
                            path="/:userSlug/comparison" 
                            element={
                                <ProtectedRoute requireSelfOrManager>
                                    <ComparisonPage />
                                </ProtectedRoute>
                            } 
                        />
                        
                        {/* Fallback route */}
                        <Route path="*" element={<Navigate to="/login" replace />} />
                    </Routes>

                </div>
            </Router>
        </AuthProvider>
    );
};

export default App; 