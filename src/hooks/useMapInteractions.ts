
import { useState, useEffect } from 'react';
import { Tour } from '@/services/toursData';
import { Bookmark } from '@/components/map/Bookmarks';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from '@/hooks/use-toast';

export interface MapLocation {
  lat: number;
  lng: number;
}

export const useMapInteractions = () => {
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [userLocation, setUserLocation] = useState<MapLocation | null>(null);
  const [activeRegion, setActiveRegion] = useState('all');
  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>('map_bookmarks', []);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [isOfflineManagerOpen, setIsOfflineManagerOpen] = useState(false);
  const [longPressLocation, setLongPressLocation] = useState<MapLocation | null>(null);
  const [isBookmarkFormOpen, setIsBookmarkFormOpen] = useState(false);
  const [mapRadius, setMapRadius] = useState(10); // Default 10km radius

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
          
          // Log the user's location
          console.log("User's actual location:", {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          toast({
            title: "Location access denied",
            description: "Please enable location services to see nearby attractions",
            variant: "destructive"
          });
        },
        { enableHighAccuracy: true }
      );
    }
    
    return () => clearTimeout(timer);
  }, []);

  const handleMapPinClick = (location: MapLocation, tour?: Tour) => {
    console.log("Pin clicked:", location, tour?.title);
    setSelectedLocation(location);
    if (tour) setSelectedTour(tour);
  };
  
  const handleExpandSearch = () => {
    setIsSearchExpanded(true);
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
    console.log("Region changed to:", regionId);
    setActiveRegion(regionId);
  };
  
  const handleMapRegionChange = (region: { lat: number, lng: number, radius: number }) => {
    console.log("Map region changed:", region);
    setMapRadius(region.radius);
  };
  
  const handleAddBookmark = (bookmarkData: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmarkData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    setBookmarks([...bookmarks, newBookmark]);
    toast({
      title: "Location bookmarked",
      description: `${newBookmark.name} has been added to your bookmarks`
    });
    
    setIsBookmarkFormOpen(false);
    setLongPressLocation(null);
  };
  
  const handleDeleteBookmark = (id: string) => {
    setBookmarks(bookmarks.filter(b => b.id !== id));
    toast({
      title: "Bookmark deleted",
      description: "The bookmark has been removed from your list"
    });
  };
  
  const handleSelectBookmark = (bookmark: Bookmark) => {
    setIsBookmarksOpen(false);
    setSelectedLocation({ lat: bookmark.lat, lng: bookmark.lng });
  };

  const handleCloseBottomSheet = () => {
    setSelectedTour(null);
    setSelectedLocation(null);
  };

  return {
    isSearchExpanded,
    searchQuery,
    selectedLocation,
    selectedTour,
    userLocation,
    activeRegion,
    mapRadius,
    bookmarks,
    isBookmarksOpen,
    isOfflineManagerOpen,
    longPressLocation,
    isBookmarkFormOpen,
    setIsSearchExpanded,
    setSearchQuery,
    setSelectedLocation,
    setSelectedTour,
    setActiveRegion,
    setBookmarks,
    setIsBookmarksOpen,
    setIsOfflineManagerOpen,
    setLongPressLocation,
    setIsBookmarkFormOpen,
    setUserLocation,
    handleMapPinClick,
    handleExpandSearch,
    handleSearchBlur,
    handleSearchClear,
    handleRegionChange,
    handleMapRegionChange,
    handleAddBookmark,
    handleDeleteBookmark,
    handleSelectBookmark,
    handleCloseBottomSheet
  };
};
