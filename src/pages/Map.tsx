
import React, { useEffect } from 'react';
import Map from '@/components/Map';
import MapBottomSheet from '@/components/MapBottomSheet';
import Bookmarks from '@/components/map/Bookmarks';
import BookmarkForm from '@/components/map/BookmarkForm';
import OfflineMapManager from '@/components/map/OfflineMapManager';
import UpgradePrompt from '@/components/UpgradePrompt';
import { useTourLocations } from '@/hooks/useTourLocations';
import { useMapInteractions } from '@/hooks/useMapInteractions';
import MapHeader from '@/components/map/MapHeader';
import { toast } from '@/hooks/use-toast';

const MapPage = () => {
  console.log("MapPage component rendering");
  
  const {
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
    setSearchQuery,
    handleMapPinClick,
    handleExpandSearch,
    handleSearchBlur,
    handleSearchClear,
    handleRegionChange,
    handleMapRegionChange,
    handleAddBookmark,
    handleDeleteBookmark,
    handleSelectBookmark,
    handleCloseBottomSheet,
    setIsBookmarksOpen,
    setIsOfflineManagerOpen,
    setIsBookmarkFormOpen,
    setLongPressLocation,
    setUserLocation
  } = useMapInteractions();
  
  const { locations, isLoading, error } = useTourLocations(activeRegion, searchQuery);

  // Display error toast if tour locations fail to load
  useEffect(() => {
    if (error) {
      toast({
        title: "Failed to load locations",
        description: error.message,
        variant: "destructive"
      });
    }
  }, [error]);

  // Debug when key data changes
  useEffect(() => {
    console.log("MapPage data updated:", { 
      activeRegion,
      searchQuery,
      locationsCount: locations?.length
    });
  }, [activeRegion, searchQuery, locations?.length]);
  
  // Handle map long press to create bookmarks
  const handleMapLongPress = (location: { lat: number, lng: number }) => {
    console.log("Map long press at:", location);
    setLongPressLocation(location);
    setIsBookmarkFormOpen(true);
  };

  return (
    <div className="flex flex-col h-full relative bg-sand-light">
      <MapHeader 
        isSearchExpanded={isSearchExpanded}
        searchQuery={searchQuery}
        activeRegion={activeRegion}
        onExpandSearch={handleExpandSearch}
        onSearchBlur={handleSearchBlur}
        onSearchChange={setSearchQuery}
        onSearchClear={handleSearchClear}
        onRegionChange={handleRegionChange}
        onOpenBookmarks={() => setIsBookmarksOpen(true)}
        onOpenOfflineMaps={() => setIsOfflineManagerOpen(true)}
        onCenterUserLocation={() => userLocation && setUserLocation({ ...userLocation })}
        userLocation={userLocation}
      />
      
      <div className="flex-1 w-full">
        <Map 
          location={userLocation || { lat: 24.7136, lng: 46.6753 }} 
          points={locations || []}
          interactive={true}
          className="w-full h-full"
          onPinClick={handleMapPinClick}
          onRegionChange={handleMapRegionChange}
          showUserLocation={!!userLocation}
          onLongPress={handleMapLongPress}
        />
      </div>
      
      {isLoading && (
        <div className="absolute top-20 right-4 bg-background/90 text-foreground px-3 py-1 rounded-full text-sm animate-pulse">
          Loading locations...
        </div>
      )}
      
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
          onClose={handleCloseBottomSheet} 
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
