import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    // If no user is logged in, redirect to auth
    if (!currentUser) {
        return <Navigate to="/auth" replace />;
    }

    // If admin is required, check for admin role
    if (requireAdmin) {
        const isAdmin = currentUser.role === 'admin';
        if (!isAdmin) {
            return <Navigate to="/dashboard" replace />;
        }
    }

    // If children are provided, render them; otherwise render Outlet
    return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;