import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { currentUser, loading } = useAuth();

    // Get the comma-separated string of admin UIDs from environment variables
    const adminUidsString = import.meta.env.VITE_ADMIN_UIDS || "";

    // Split the string into an array of UIDs
    const adminUids = adminUidsString.split(',');

    if (loading) {
        // You can show a loading spinner here if you want
        return <div>Loading...</div>;
    }

    // Check if the current user's ID is in the list of admin UIDs
    const isAdmin = currentUser && adminUids.includes(currentUser.id);

    return isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;