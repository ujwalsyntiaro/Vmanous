import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAdminLoggedIn } from '../../services/adminAuthService';

const ProtectedAdminRoute = () => {
  const isAuthenticated = isAdminLoggedIn();

  if (!isAuthenticated) {
    return <Navigate to="/vpanel/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
