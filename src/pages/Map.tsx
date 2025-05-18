
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Search, Filter, MapPin, Navigation, BookmarkIcon, Download, Menu } from 'lucide-react';
import Map from '@/components/Map';
import MapBottomSheet from '@/components/MapBottomSheet';
import MapFilterControls from '@/components/MapFilterControls';
import Bookmarks from '@/components/map/Bookmarks';
import BookmarkForm from '@/components/map/BookmarkForm';
import OfflineMapManager from '@/components/map/OfflineMapManager';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { useTourLocations } from '@/hooks/useTourLocations';
import { cn } from '@/lib/utils';
import { regions } from '@/services/categoryData';
import UpgradePrompt from '@/components/UpgradePrompt';
import WelcomeHeader from '@/components/WelcomeHeader';
import { Tour } from '@/services/toursData';
import { Bookmark } from '@/components/map/Bookmarks';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const MapPage = () => {
  const { user } = useAuth();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [activeRegion, setActiveRegion] = useState('all');
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('map_bookmarks', []);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isOfflineManagerOpen, setIsOfflineManagerOpen] = useState(false);
  const [longPressLocation, setLongPressLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isBookmarkFormOpen, setIsBookmarkFormOpen] = useState(false);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  
  const { locations, isLoading, error } = useTourLocations(activeRegion, searchQuery);

  // Simulate getting user location
  useEffect(() => {
    // In a real app, we would use geolocation API
    const timer = setTimeout(() => {
      // Default to Riyadh for demo
      setUserLocation({ lat: 24.7136, lng: 46.6753 });
    }, 1000);
    
    // Try to use geolocation if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timer);
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true }
      );
    }
    
    return () => clearTimeout(timer);
  }, []);

  const handleMapPinClick = (location: { lat: number; lng: number }, tour?: Tour) => {
    setSelectedLocation(location);
    if (tour) setSelectedTour(tour);
  };
  
  const handleExpandSearch = () => {
    setIsSearchExpanded(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 300);
  };
  
  const handleSearchBlur = () => {
    if (!searchQuery) {
      setIsSearchExpanded(false);
    }
  };
  
  const handleSearchClear = () => {
    setSearchQuery('');
    setIsSearchExpanded(false);
  };
  
  const handleRegionChange = (regionId: string) => {
    setActiveRegion(regionId);
  };
  
  const handleAddBookmark = (bookmarkData: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmarkData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    setBookmarks([...bookmarks, newBookmark]);
    setIsBookmarkFormOpen(false);
    setLongPressLocation(null);
  };
  
  const handleDeleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
  };
  
  const handleSelectBookmark = (bookmark: Bookmark) => {
    setIsBookmarksOpen(false);
    setSelectedLocation({ lat: bookmark.lat, lng: bookmark.lng });
  };

  return (
    <div className="flex flex-col h-full relative bg-sand-light">
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        {!isSearchExpanded && (
          <div className="mb-2">
            <WelcomeHeader 
              location={activeRegion !== 'all' ? regions.find(r => r.id === activeRegion)?.name : 'Saudi Arabia'} 
              className="text-white text-shadow-sm"
            />
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <div className={cn(
            "bg-white rounded-full shadow-lg flex items-center transition-all duration-300",
            isSearchExpanded ? "flex-1" : "w-10 h-10"
          )}>
            {isSearchExpanded ? (
              <div className="flex items-center flex-1 px-4 py-2">
                <Search className="h-5 w-5 text-muted-foreground mr-2" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onBlur={handleSearchBlur}
                  className="flex-1 border-none shadow-none focus-visible:ring-0 bg-transparent"
                />
                {searchQuery && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0" 
                    onClick={handleSearchClear}
                  >
                    <span className="sr-only">Clear</span>
                    <span className="text-xl">&times;</span>
                  </Button>
                )}
              </div>
            ) : (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 rounded-full" 
                onClick={handleExpandSearch}
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
          </div>
          
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 bg-white rounded-full shadow-lg">
                <Filter className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <MapFilterControls 
                activeRegion={activeRegion} 
                onRegionChange={handleRegionChange} 
              />
            </SheetContent>
          </Sheet>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10 bg-white rounded-full shadow-lg">
                <Menu className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsBookmarksOpen(true)}>
                <BookmarkIcon className="h-4 w-4 mr-2" />
                My Bookmarks
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsOfflineManagerOpen(true)}>
                <Download className="h-4 w-4 mr-2" />
                Offline Maps
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {userLocation && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-10 w-10 bg-white rounded-full shadow-lg"
              onClick={() => setUserLocation({ ...userLocation })}
            >
              <Navigation className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-1 w-full">
        <Map 
          location={userLocation || { lat: 24.7136, lng: 46.6753 }} 
          points={locations}
          interactive={true}
          className="w-full h-full"
          onPinClick={handleMapPinClick}
        />
      </div>
      
      {/* Bookmarks panel */}
      <Bookmarks 
        bookmarks={bookmarks}
        onSelectBookmark={handleSelectBookmark}
        onDeleteBookmark={handleDeleteBookmark}
        onClose={() => setIsBookmarksOpen(false)}
        isOpen={isBookmarksOpen}
      />
      
      {/* Offline maps manager */}
      <OfflineMapManager 
        isOpen={isOfflineManagerOpen}
        onClose={() => setIsOfflineManagerOpen(false)}
      />
      
      {/* Bookmark form dialog */}
      <BookmarkForm
        isOpen={isBookmarkFormOpen}
        onClose={() => {
          setIsBookmarkFormOpen(false);
          setLongPressLocation(null);
        }}
        onSave={handleAddBookmark}
        location={longPressLocation}
      />
      
      {selectedLocation && selectedTour && (
        <MapBottomSheet 
          tour={selectedTour} 
          onClose={() => {
            setSelectedTour(null);
            setSelectedLocation(null);
          }} 
        />
      )}
      
      <div className="absolute bottom-20 right-4">
        <UpgradePrompt 
          variant="subtle" 
          buttonText="Unlock All Locations" 
          className="bg-white/80 backdrop-blur-sm rounded-full shadow-lg px-3 py-1" 
        />
      </div>
    </div>
  );
};

export default MapPage;
