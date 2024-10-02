import React from "react";
import { Navigate } from "react-router-dom";

// Example: You might fetch this from your auth state or decoded JWT token
const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user ? user : null;
};

function ProtectedRoute({ children, allowedRoles }) {
  const user = getCurrentUser();

  // If no user or user role is not allowed, redirect to login
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;
