
import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import ForgotPassword from '@/pages/ForgotPassword';
import Verification from '@/pages/Verification';
import Onboarding from '@/pages/Onboarding';

interface AuthNavigatorProps {
  showOnboarding: boolean;
}

const AuthNavigator: React.FC<AuthNavigatorProps> = ({ showOnboarding }) => {
  // If onboarding is needed, redirect to onboarding first, otherwise to login
  const initialRoute = showOnboarding ? '/onboarding' : '/login';

  return (
    <Routes>
      <Route path="onboarding" element={<Onboarding />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="verification" element={<Verification />} />
      <Route path="*" element={<Navigate to={initialRoute} replace />} />
    </Routes>
  );
};

export default AuthNavigator;
