
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { tours, Tour } from '@/services/toursData';
import { categories, regions } from '@/services/categoryData';
import EnhancedTourCard from '@/components/EnhancedTourCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import WelcomeHeader from '@/components/WelcomeHeader';
import TourCarousel from '@/components/TourCarousel';
import CategoriesSection from '@/components/CategoriesSection';
import NearbyAttractions from '@/components/NearbyAttractions';
import UpgradePrompt from '@/components/UpgradePrompt';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle } from 'lucide-react';

const HomePage = () => {
  const { user } = useAuth();
  const isPremium = false; // For demo purposes
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [locationName, setLocationName] = useState('Saudi Arabia');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [recentTours, setRecentTours] = useState<Tour[]>([]);
  const [nearbyTours, setNearbyTours] = useState<Tour[]>([]);
  const [recommendedTours, setRecommendedTours] = useState<Tour[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simulated data loading
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API calls
    setTimeout(() => {
      setFeaturedTours(tours.slice(0, 3));
      setRecentTours([tours[2], tours[0], tours[1]]);
      setNearbyTours(tours.slice(0, 2));
      setRecommendedTours(tours.slice(1, 3));
      
      // Simulate getting user location
      setUserLocation({
        lat: 24.7136,
        lng: 46.6753
      });
      setLocationName('Riyadh, Saudi Arabia');
      
      setIsLoading(false);
    }, 1500);
    
    // Check online status
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, []);
  
  // Online status handler
  const handleOnlineStatus = () => {
    setIsOnline(navigator.onLine);
  };
  
  // Category selection handler
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    // In a real app, this would filter tours based on category
  };
  
  // Pull to refresh simulation
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    // Simulate refresh
    setTimeout(() => {
      // Shuffle the order of tours to simulate new data
      setFeaturedTours([...tours].sort(() => Math.random() - 0.5).slice(0, 3));
      setRecentTours([...tours].sort(() => Math.random() - 0.5).slice(0, 3));
      
      setIsRefreshing(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {!isOnline && (
        <div className="bg-destructive text-destructive-foreground p-2 text-center text-sm">
          <AlertTriangle className="inline h-4 w-4 mr-1" />
          You're offline. Showing cached content.
        </div>
      )}
      
      <main className="flex-1 py-6 bg-sand-light">
        <ScrollArea className="h-full" data-testid="pull-to-refresh" onScroll={(e) => {
          // Simplified pull-to-refresh detection
          const target = e.currentTarget;
          if (target.scrollTop < -50 && !isRefreshing) {
            handleRefresh();
          }
        }}>
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
            <div className="mb-8">
              <Tabs defaultValue="themes" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="themes">Themes</TabsTrigger>
                  <TabsTrigger value="regions">Regions</TabsTrigger>
                </TabsList>
                <TabsContent value="themes">
                  <CategoriesSection 
                    title="Explore by Theme"
                    categories={categories}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleCategorySelect}
                    isLoading={isLoading}
                  />
                </TabsContent>
                <TabsContent value="regions">
                  <CategoriesSection 
                    title="Explore by Region"
                    categories={regions}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleCategorySelect}
                    isLoading={isLoading}
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Recently Added Tours */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display text-xl font-bold text-desert-dark">Recently Added</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {isLoading ? (
                  Array(2).fill(0).map((_, i) => (
                    <div key={i} className="h-[200px] bg-white rounded-lg animate-pulse" />
                  ))
                ) : (
                  recentTours.slice(0, 2).map(tour => (
                    <EnhancedTourCard
                      key={tour.id}
                      tour={tour}
                      isDownloaded={tour.id === 'diriyah-main'}
                    />
                  ))
                )}
              </div>
            </div>
            
            {/* Nearby Attractions */}
            <NearbyAttractions 
              tours={nearbyTours}
              userLocation={userLocation || undefined}
              isLoading={isLoading}
            />
            
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
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-display text-xl font-bold text-desert-dark">Recommended For You</h2>
              </div>
              
              {isLoading ? (
                <div className="h-[300px] bg-white rounded-lg animate-pulse" />
              ) : (
                <EnhancedTourCard
                  tour={recommendedTours[0]}
                  featured={true}
                />
              )}
              
              {!isPremium && recommendedTours.length > 1 && (
                <UpgradePrompt
                  variant="subtle"
                  buttonText="See All Recommendations"
                  onUpgrade={() => console.log("See all recommendations clicked")}
                />
              )}
            </div>
            
            {/* Continue Listening Section */}
            <section>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="font-display text-xl font-bold mb-4 text-desert-dark">Continue Listening</h2>
                <p className="text-muted-foreground mb-4">Pick up where you left off on your audio journey</p>
                <Button className="bg-desert hover:bg-desert-dark">
                  Resume Last Tour
                </Button>
              </div>
            </section>
          </div>
        </ScrollArea>
      </main>
    </div>
  );
};

export default HomePage;
