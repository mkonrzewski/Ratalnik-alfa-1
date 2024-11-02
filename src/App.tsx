import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import DemoDashboard from './pages/DemoDashboard';
import Login from './pages/Login';
import Loans from './pages/Loans';
import LoanDetails from './pages/LoanDetails';
import Profile from './pages/Profile';
import { LoanProvider } from './context/LoanContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LoanProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/demo" element={<DemoDashboard />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/loans"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Loans />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/loans/:id"
              element={
                <ProtectedRoute>
                  <Layout>
                    <LoanDetails />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/payments"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster position="top-right" />
        </Router>
      </LoanProvider>
    </AuthProvider>
  );
};

export default App;