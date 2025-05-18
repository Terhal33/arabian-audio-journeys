
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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
import { AlertTriangle, RefreshCcw, MapPin } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const HomePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const isPremium = false; // For demo purposes
  const scrollRef = useRef<HTMLDivElement>(null);
  const startY = useRef<number | null>(null);
  
  // State
  const [isLoading, setIsLoading] = useState(true);
  const [locationName, setLocationName] = useState('Saudi Arabia');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('');
  const [featuredTours, setFeaturedTours] = useState<Tour[]>([]);
  const [recentTours, setRecentTours] = useState<Tour[]>([]);
  const [nearbyTours, setNearbyTours] = useState<Tour[]>([]);
  const [recommendedTours, setRecommendedTours] = useState<Tour[]>([]);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshingY, setRefreshingY] = useState(0);

  // Simulated data loading - with check to prevent multiple loads
  useEffect(() => {
    if (dataLoaded) return;
    
    setIsLoading(true);
    
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          // This would be replaced with a reverse geocoding API call in production
          setLocationName('Riyadh, Saudi Arabia');
        },
        (error) => {
          console.log('Geolocation error:', error);
          setLocationName('Saudi Arabia');
        }
      );
    }
    
    // Simulate API calls
    const loadingTimeout = setTimeout(() => {
      try {
        setFeaturedTours(tours.slice(0, 3));
        setRecentTours([tours[2], tours[0], tours[1]]);
        setNearbyTours(tours.slice(0, 2));
        setRecommendedTours(tours.slice(1, 3));
        
        // If no real geolocation, simulate one
        if (!userLocation) {
          setUserLocation({
            lat: 24.7136,
            lng: 46.6753
          });
        }
        
        setDataLoaded(true);
      } catch (error) {
        console.error("Error loading tour data:", error);
        toast({
          title: "Failed to load tours",
          description: "Please check your connection and try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }, 1500);
    
    return () => clearTimeout(loadingTimeout);
  }, [dataLoaded, userLocation, toast]);
  
  // Online status handler - using useCallback to prevent recreating function
  const handleOnlineStatus = useCallback(() => {
    const newStatus = navigator.onLine;
    setIsOnline(newStatus);
    if (newStatus && !isOnline) {
      // Just came back online
      toast({
        title: "You're back online",
        description: "Pull down to refresh content"
      });
    } else if (!newStatus) {
      toast({
        title: "You're offline",
        description: "Showing cached content",
        variant: "destructive"
      });
    }
  }, [isOnline, toast]);
  
  // Set up event listeners for online status
  useEffect(() => {
    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);
    
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
    };
  }, [handleOnlineStatus]);
  
  // Category selection handler
  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId);
    // In a real app, this would filter tours based on category
    setIsLoading(true);
    setTimeout(() => {
      // Simulate filtered results
      if (categoryId && categoryId !== selectedCategory) {
        setFeaturedTours(tours.filter((_, i) => i % 2 === 0));
        setRecentTours(tours.filter((_, i) => i % 2 === 1));
      } else {
        setFeaturedTours(tours.slice(0, 3));
        setRecentTours([tours[2], tours[0], tours[1]]);
      }
      setIsLoading(false);
    }, 500);
  }, [selectedCategory]);
  
  // Region selection handler
  const handleRegionSelect = useCallback((regionId: string) => {
    setSelectedRegion(regionId === selectedRegion ? '' : regionId);
    // Simulate region filtering
    setIsLoading(true);
    setTimeout(() => {
      // Simulate filtered results
      if (regionId && regionId !== selectedRegion) {
        setFeaturedTours(tours.filter((_, i) => i % 3 === 0));
        setNearbyTours(tours.filter((_, i) => i % 3 === 1));
      } else {
        setFeaturedTours(tours.slice(0, 3));
        setNearbyTours(tours.slice(0, 2));
      }
      setIsLoading(false);
    }, 500);
  }, [selectedRegion]);
  
  // Pull to refresh implementation
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (startY.current !== null && scrollRef.current && scrollRef.current.scrollTop === 0) {
      const currentY = e.touches[0].clientY;
      const diff = currentY - startY.current;
      
      if (diff > 0) {
        // Prevent default to stop page pull-down behavior
        e.preventDefault();
        
        // Calculate pull distance with resistance
        const pullDistance = Math.min(diff * 0.4, 80);
        setRefreshingY(pullDistance);
        
        if (pullDistance > 60) {
          setRefreshing(true);
        } else {
          setRefreshing(false);
        }
      }
    }
  };

  const handleTouchEnd = () => {
    if (refreshing && !isRefreshing) {
      // Trigger actual refresh
      handleRefresh();
    }
    
    // Reset values
    startY.current = null;
    setRefreshingY(0);
    setRefreshing(false);
  };
  
  // Pull to refresh simulation with stability improvements
  const handleRefresh = useCallback(() => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    toast({
      title: "Refreshing content",
      description: "Getting the latest tours for you"
    });
    
    // Simulate refresh
    setTimeout(() => {
      try {
        // Shuffle the order of tours to simulate new data
        setFeaturedTours([...tours].sort(() => Math.random() - 0.5).slice(0, 3));
        setRecentTours([...tours].sort(() => Math.random() - 0.5).slice(0, 3));
        setNearbyTours([...tours].sort(() => Math.random() - 0.5).slice(0, 2));
        toast({
          title: "Content updated",
          description: "You're viewing the latest tours"
        });
      } catch (error) {
        console.error("Error refreshing tour data:", error);
        toast({
          title: "Failed to refresh",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setIsRefreshing(false);
      }
    }, 1000);
  }, [isRefreshing, toast]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 py-6 bg-sand-light">
        {!isOnline && (
          <div className="bg-destructive text-destructive-foreground p-2 text-center text-sm">
            <AlertTriangle className="inline h-4 w-4 mr-1" />
            You're offline. Showing cached content.
          </div>
        )}
        
        <div 
          className="relative" 
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Pull to refresh indicator */}
          {refreshingY > 0 && (
            <div 
              className="absolute top-0 left-0 w-full flex justify-center z-10 pointer-events-none"
              style={{ transform: `translateY(${refreshingY - 40}px)` }}
            >
              <div className="bg-white rounded-full p-2 shadow-md">
                <RefreshCcw 
                  className={`h-6 w-6 text-desert ${isRefreshing ? 'animate-spin' : refreshing ? 'text-desert-dark' : 'text-muted-foreground'}`} 
                  style={{ 
                    transform: `rotate(${refreshingY * 4}deg)` 
                  }}
                />
              </div>
            </div>
          )}
          
          <ScrollArea 
            className="h-[calc(100vh-4rem)]" 
            ref={scrollRef} 
            data-testid="pull-to-refresh"
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
              <div className="mb-8">
                <Tabs defaultValue="themes" className="w-full">
                  <TabsList className="mb-4">
                    <TabsTrigger value="themes">Themes</TabsTrigger>
                    <TabsTrigger value="regions">Regions</TabsTrigger>
                  </TabsList>
                  <TabsContent value="themes" className="animate-fade-in">
                    <CategoriesSection 
                      title="Explore by Theme"
                      categories={categories}
                      selectedCategory={selectedCategory}
                      onSelectCategory={handleCategorySelect}
                      isLoading={isLoading}
                    />
                  </TabsContent>
                  <TabsContent value="regions" className="animate-fade-in">
                    <CategoriesSection 
                      title="Explore by Region"
                      categories={regions}
                      selectedCategory={selectedRegion}
                      onSelectCategory={handleRegionSelect}
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
        </div>
      </main>
    </div>
  );
};

export default HomePage;
