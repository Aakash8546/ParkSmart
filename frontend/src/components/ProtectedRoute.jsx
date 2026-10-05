import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../services/authService';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = authService.getRole();
    if (!allowedRoles.includes(userRole)) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};
