/**
 * Routing configuration cho ứng dụng
 */

import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES } from '../constants/routes';

// Pages
import Login from '../pages/Login';
import AdminDashboard from '../pages/AdminDashboard';
import UserDashboard from '../pages/UserDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, isLoading, roles } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E8F5E8 0%, #F1F8E9 100%)',
        color: '#2E7D32'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '16px' }}>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              style={{
                width: '40px',
                height: '40px',
                color: '#4CAF50',
                animation: 'spin 1s linear infinite'
              }}
            >
              <circle 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="31.416"
                strokeDashoffset="31.416"
              />
            </svg>
          </div>
          <p style={{ fontSize: '16px', margin: 0 }}>Đang kiểm tra quyền truy cập...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // Check role if required
  if (requiredRole) {
    const upperRoles = (roles || []).map(r => String(r).toUpperCase());
    if (!upperRoles.includes(String(requiredRole).toUpperCase())) {
      const redirectTo = upperRoles.includes('ADMIN')
        ? ROUTES.ADMIN_DASHBOARD
        : ROUTES.USER_DASHBOARD;
      return <Navigate to={redirectTo} replace />;
    }
  }

  return children;
};

// Public Route Component (redirect if already authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading, roles } = useAuth();

  // Show loading spinner while checking auth
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E8F5E8 0%, #F1F8E9 100%)',
        color: '#2E7D32'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: '16px' }}>
            <svg 
              viewBox="0 0 24 24" 
              fill="none" 
              style={{
                width: '40px',
                height: '40px',
                color: '#4CAF50',
                animation: 'spin 1s linear infinite'
              }}
            >
              <circle 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="31.416"
                strokeDashoffset="31.416"
              />
            </svg>
          </div>
          <p style={{ fontSize: '16px', margin: 0 }}>Đang tải...</p>
        </div>
      </div>
    );
  }

  // Redirect to appropriate dashboard if already authenticated
  if (isAuthenticated) {
    const upperRoles = (roles || []).map(r => String(r).toUpperCase());
    const redirectTo = upperRoles.includes('ADMIN') 
      ? ROUTES.ADMIN_DASHBOARD 
      : ROUTES.USER_DASHBOARD;
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

// Router configuration
export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <Navigate to={ROUTES.LOGIN} replace />
  },
  {
    path: ROUTES.LOGIN,
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    )
  },
  {
    path: ROUTES.ADMIN_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AdminDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: ROUTES.USER_DASHBOARD,
    element: (
      <ProtectedRoute requiredRole="USER">
        <UserDashboard />
      </ProtectedRoute>
    )
  },
  {
    path: "*",
    element: <Navigate to={ROUTES.LOGIN} replace />
  }
]);

export default router;
