import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        // You can show a loading spinner here if you want
        return <div>Loading...</div>;
    }

    // Check if the current user's role is 'admin'
    const isAdmin = currentUser && currentUser.role === 'admin';

    return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;