
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useAppState } from '@/contexts/AppStateContext';
import Navbar from '@/components/Navbar';
import GlobalMessage from '@/components/GlobalMessage';
import Index from '@/pages/Index';
import ToursPage from '@/pages/ToursPage';
import TourDetailPage from '@/pages/TourDetailPage';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import CustomerDashboard from '@/pages/CustomerDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import ProfilePage from '@/pages/ProfilePage';

const MainApp: React.FC = () => {
  const { isAuthenticated, userRole, isLoading } = useAuth();
  const { currentPage, navigateTo } = useAppState();

  // Extract tour ID from currentPage if it's a tour detail page
  const getTourId = () => {
    if (currentPage.startsWith('tour/')) {
      return currentPage.split('/')[1];
    }
    return null;
  };

  // Redirect logic based on authentication and role
  useEffect(() => {
    if (!isLoading) {
      // If user just logged in, redirect based on role
      if (isAuthenticated && userRole && (currentPage === 'login' || currentPage === 'signup')) {
        if (userRole === 'admin') {
          navigateTo('admin-dashboard');
        } else {
          navigateTo('customer-dashboard');
        }
      }
      
      // Protect admin routes
      if (currentPage.startsWith('admin') && userRole !== 'admin') {
        navigateTo('index');
      }
      
      // Protect customer dashboard
      if (currentPage === 'customer-dashboard' && !isAuthenticated) {
        navigateTo('login');
      }
      
      // Protect profile page
      if (currentPage === 'profile' && !isAuthenticated) {
        navigateTo('login');
      }
    }
  }, [isAuthenticated, userRole, isLoading, currentPage, navigateTo]);

  const renderPage = () => {
    if (currentPage.startsWith('tour/')) {
      const tourId = getTourId();
      return <TourDetailPage tourId={tourId} />;
    }

    switch (currentPage) {
      case 'index':
        return <Index />;
      case 'tours':
        return <ToursPage />;
      case 'login':
        return <LoginPage />;
      case 'signup':
        return <SignupPage />;
      case 'customer-dashboard':
        return <CustomerDashboard />;
      case 'admin-dashboard':
      case 'admin-overview':
      case 'admin-tours':
      case 'admin-users':
        return <AdminDashboard />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Index />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-desert border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-light">
      <Navbar />
      <GlobalMessage />
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default MainApp;
