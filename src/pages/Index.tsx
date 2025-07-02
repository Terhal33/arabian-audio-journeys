
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { tours, Tour } from '@/services/toursData';
import { useAuth } from '@/contexts/auth/AuthProvider';
import HeroSection from '@/components/home/HeroSection';
import HeritageSection from '@/components/home/HeritageSection';
import HowItWorksSection from '@/components/home/HowItWorksSection';
import CallToActionSection from '@/components/home/CallToActionSection';
import Footer from '@/components/home/Footer';
import ErrorBoundary from '@/components/ErrorBoundary';

const Index: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [allTours, setAllTours] = useState<Tour[]>([]);

  useEffect(() => {
    setAllTours(tours);
  }, []);

  const handleNavigation = (destination: string) => {
    navigate(destination);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <HeroSection 
          isAuthenticated={isAuthenticated} 
          onNavigate={handleNavigation} 
        />
        <HeritageSection tours={allTours} />
        <HowItWorksSection />
        <CallToActionSection onNavigate={handleNavigation} />
        <Footer onNavigate={handleNavigation} />
      </div>
    </ErrorBoundary>
  );
};

export default Index;
