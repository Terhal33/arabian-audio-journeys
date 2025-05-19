
import React, { useEffect, Suspense, lazy } from 'react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { categories, regions } from '@/services/categoryData';
import { Button } from '@/components/ui/button';
import WelcomeHeader from '@/components/WelcomeHeader';
import TourCarousel from '@/components/TourCarousel';
import NearbyAttractions from '@/components/NearbyAttractions';
import LoadingSpinner from '@/components/LoadingSpinner';

// Custom hooks
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useToursData } from '@/hooks/useToursData';

// Home components
import PullToRefresh from '@/components/home/PullToRefresh';
import OfflineAlert from '@/components/home/OfflineAlert';
import RecentlyAddedTours from '@/components/home/RecentlyAddedTours';
import ExploreByTabs from '@/components/home/ExploreByTabs';

// Lazy load non-critical components
const RecommendedTours = lazy(() => import('@/components/home/RecommendedTours'));
const ContinueListening = lazy(() => import('@/components/home/ContinueListening'));
const UpgradePrompt = lazy(() => import('@/components/UpgradePrompt'));

const HomePage = () => {
  const { user, isPremium } = useAuth();
  const isOnline = useOnlineStatus();
  const { location, locationName } = useGeolocation();
  
  const {
    featuredTours,
    recentTours,
    nearbyTours,
    recommendedTours,
    isLoading,
    dataLoaded,
    isRefreshing,
    loadData,
    handleRefresh,
    selectedCategory,
    selectedRegion,
    handleCategorySelect,
    handleRegionSelect
  } = useToursData();
  
  // Check last tour from local storage
  const [lastTour, setLastTour] = React.useState<{id: string, title: string, progress: number} | null>(null);
  
  useEffect(() => {
    const storedLastTour = localStorage.getItem('last_tour');
    if (storedLastTour) {
      try {
        setLastTour(JSON.parse(storedLastTour));
      } catch (e) {
        console.error("Error parsing last tour data", e);
      }
    }
  }, []);
  
  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [loadData]);
  
  // Show loading spinner while data is being initially loaded
  if (isLoading && !dataLoaded) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <LoadingSpinner size="large" text="Loading tours..." />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-6 bg-sand-light">
        <OfflineAlert isOffline={!isOnline} />
        
        <PullToRefresh 
          onRefresh={handleRefresh} 
          isRefreshing={isRefreshing}
        >
          <div className="container mx-auto px-4 pb-16">
            {/* Welcome Header with Location */}
            <WelcomeHeader location={locationName} isLoading={isLoading} />
            
            {/* Featured Tours Carousel */}
            <TourCarousel 
              title="Featured Tours" 
              tours={featuredTours} 
              viewAllLink="/tours"
              isLoading={isLoading || isRefreshing}
            />
            
            {/* Categories Section */}
            <ExploreByTabs 
              categories={categories}
              regions={regions}
              selectedCategory={selectedCategory}
              selectedRegion={selectedRegion}
              onSelectCategory={handleCategorySelect}
              onSelectRegion={handleRegionSelect}
              isLoading={isLoading}
            />
            
            {/* Recently Added Tours */}
            <RecentlyAddedTours tours={recentTours} isLoading={isLoading} />
            
            {/* Nearby Attractions */}
            <NearbyAttractions 
              tours={nearbyTours}
              userLocation={location}
              isLoading={isLoading}
            />
            
            {/* Suspense fallback for non-critical components */}
            <Suspense fallback={<div className="h-20 flex items-center justify-center"><LoadingSpinner size="small" /></div>}>
              {/* Premium Upgrade Prompt */}
              {!isPremium && (
                <div className="mb-8">
                  <UpgradePrompt
                    title="Unlock Premium Tours"
                    description="Get unlimited access to all 50+ premium tours and exclusive content!"
                    buttonText="Upgrade to Premium"
                    onUpgrade={() => console.log("Upgrade clicked")}
                  />
                </div>
              )}
              
              {/* Personalized Recommendations */}
              <RecommendedTours 
                tours={recommendedTours} 
                isPremium={isPremium || false} 
                isLoading={isLoading} 
              />
              
              {/* Continue Listening Section */}
              <ContinueListening isLoading={isLoading} lastTour={lastTour} />
            </Suspense>
          </div>
        </PullToRefresh>
      </main>
    </div>
  );
};

export default HomePage;
