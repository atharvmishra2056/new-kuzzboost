import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { currentUser, loading } = useAuth();
    const adminUid = import.meta.env.VITE_ADMIN_UID;

    if (loading) {
        // You can show a loading spinner here if you want
        return <div>Loading...</div>;
    }

    // If the user is logged in AND their UID matches the admin UID, show the admin pages.
    // Otherwise, redirect them to the homepage.
    return currentUser?.uid === adminUid ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;