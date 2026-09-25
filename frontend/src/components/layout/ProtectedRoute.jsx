import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F4FD] flex flex-col items-center justify-center text-[#1E192B]">
        <div className="w-10 h-10 border-4 border-[#6E56AF]/30 border-t-[#6E56AF] rounded-full animate-spin mb-4"></div>
        <p className="text-xs font-bold text-[#6B637B] animate-pulse">Verifying Session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" state={{ from: location, openLogin: true }} replace />;
  }

  return children;
};

export default ProtectedRoute;
