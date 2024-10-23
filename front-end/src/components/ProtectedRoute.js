import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token'); // Get the JWT token
  const userRole = localStorage.getItem('role'); // Get the user's role

  // Check if the user is authenticated
  const isAuthenticated = !!token;

  // If the user is not authenticated, redirect to the login page
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If a specific role is required and the user's role does not match, redirect to unauthorized page
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />; // Replace with your unauthorized page route
  }

  // If authenticated and role matches, render the children (protected content)
  return children;
};

export default ProtectedRoute;
