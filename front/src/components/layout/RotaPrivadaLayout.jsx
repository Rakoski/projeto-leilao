import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ProgressSpinner } from 'primereact/progressspinner';

const RotaPrivadaLayout = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh' 
            }}>
                <ProgressSpinner />
            </div>
        );
    }

    return isAuthenticated() ? 
        <Outlet /> : 
        <Navigate to="/login" state={{ from: location }} replace />;
}

export default RotaPrivadaLayout;