import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAdminLoggedIn } from '../../services/adminAuthService';

const ProtectedAdminRoute = () => {
  const isAuthenticated = isAdminLoggedIn();

  if (!isAuthenticated) {
    return <Navigate to="/cpanel/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
