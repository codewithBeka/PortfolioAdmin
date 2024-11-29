import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from './common/Sidebar';

const ProtectedLayout = () => {
    const userData = useSelector((state) => state.auth.userData);

    if (!userData) {
        // If the user is not authenticated, redirect to the login page
        
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 overflow-y-auto">
                <Outlet /> {/* Render the nested routes here */}
            </div>
        </div>
    );
};

export default ProtectedLayout;