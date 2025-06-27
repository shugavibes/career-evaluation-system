import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import UserDashboard from './pages/UserDashboard';
import EvaluationPage from './pages/EvaluationPage';
import ComparisonPage from './pages/ComparisonPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Home page */}
          <Route 
            path="/" 
            element={
              <>
                <Navigation />
                <HomePage />
              </>
            } 
          />
          
          {/* User dashboard */}
          <Route 
            path="/:userSlug" 
            element={
              <>
                <Navigation userSlug={window.location.pathname.split('/')[1]} />
                <UserDashboard />
              </>
            } 
          />
          
          {/* Self evaluation */}
          <Route 
            path="/:userSlug/evaluate" 
            element={
              <>
                <Navigation userSlug={window.location.pathname.split('/')[1]} />
                <EvaluationPage />
              </>
            } 
          />
          
          {/* Leader evaluation */}
          <Route 
            path="/:userSlug/evaluate-leader" 
            element={
              <>
                <Navigation userSlug={window.location.pathname.split('/')[1]} />
                <EvaluationPage />
              </>
            } 
          />
          
          {/* Comparison view */}
          <Route 
            path="/:userSlug/comparison" 
            element={
              <>
                <Navigation userSlug={window.location.pathname.split('/')[1]} />
                <ComparisonPage />
              </>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; 