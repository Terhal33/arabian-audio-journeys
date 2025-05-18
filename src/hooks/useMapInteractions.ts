
import { useState, useEffect } from 'react';
import { Tour } from '@/services/toursData';
import { Bookmark } from '@/components/map/Bookmarks';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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

  const handleMapPinClick = (location: MapLocation, tour?: Tour) => {
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
    handleAddBookmark,
    handleDeleteBookmark,
    handleSelectBookmark,
    handleCloseBottomSheet
  };
};
