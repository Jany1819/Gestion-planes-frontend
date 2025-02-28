import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('token'); 
  const isDevelopment = import.meta.env.VITE_MODE === 'development'; 

  // Si no hay token y no está en modo desarrollo, redirige al login
  if (!isDevelopment && !token) {
    return <Navigate to="/login" />;
  }

  // Si hay token o está en modo desarrollo, permite el acceso a la ruta protegida
  return children;
};

export default ProtectedRoute;