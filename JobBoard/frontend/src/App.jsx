import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import Home from './pages/Home';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Profile from './pages/Profile';
import EmployerDashboard from './pages/EmployerDashboard';
import CandidateDashboard from './pages/CandidateDashboard';
import Auth from './pages/Auth';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0B6EFD',
          colorSuccess: '#00C194',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        },
      }}
    >
      <Router>
        <div className="App">
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="/" element={isAuthenticated ? <Home /> : <Navigate to="/auth" />} />
            <Route path="/jobs" element={isAuthenticated ? <Jobs /> : <Navigate to="/auth" />} />
            <Route path="/jobs/:id" element={isAuthenticated ? <JobDetail /> : <Navigate to="/auth" />} />
            <Route path="/profile" element={isAuthenticated ? <Profile /> : <Navigate to="/auth" />} />
            <Route path="/employer-dashboard" element={isAuthenticated ? <EmployerDashboard /> : <Navigate to="/auth" />} />
            <Route path="/candidate-dashboard" element={isAuthenticated ? <CandidateDashboard /> : <Navigate to="/auth" />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
}

export default App;
