
import React from 'react';
import { cn } from '@/lib/utils';
import { Tour } from '@/services/toursData';
import { MapLocation, MapProps } from '@/types/map';
import MapBackground from './MapBackground';
import MapLoading from './MapLoading';
import MapOfflineIndicator from './MapOfflineIndicator';
import MapControls from './MapControls';
import UserLocation from './UserLocation';
import GeofenceAlert from './GeofenceAlert';
import BookmarkForm from './BookmarkForm';
import MapPinsLayer from './MapPinsLayer';
import TourPathsLayer from './TourPathsLayer';
import { useMapState } from '@/hooks/map/useMapState';
import { useMapEffects } from '@/hooks/map/useMapEffects';
import { useMapInteractions } from '@/hooks/map/useMapInteractions';
import { useTourPathsData } from '@/hooks/map/useTourPathsData';

const MapCore = (props: MapProps) => {
  const {
    location,
    points = [],
    zoom = 14,
    interactive = true,
    className = 'h-64 w-full',
    onPinClick,
    onRegionChange,
    showUserLocation = true
  } = props;
  
  // Use the refactored hooks
  const {
    isMapLoaded,
    setIsMapLoaded,
    mapCenter,
    setMapCenter,
    viewportRadius,
    setViewportRadius,
    isOfflineMode,
    setIsOfflineMode,
    activeTourId,
    setActiveTourId,
    longPressLocation,
    setLongPressLocation,
    isBookmarkFormOpen,
    setIsBookmarkFormOpen,
    bookmarks,
    setBookmarks,
    lastNotifiedRegion,
    setLastNotifiedRegion
  } = useMapState();

  // Use tour paths data hook
  const { toursWithPaths } = useTourPathsData(points, activeTourId);

  // Setup map effects
  useMapEffects(
    location,
    setIsMapLoaded,
    setMapCenter,
    lastNotifiedRegion,
    viewportRadius,
    interactive,
    setIsOfflineMode,
    onRegionChange ? 
      (region) => {
        onRegionChange(region);
        setLastNotifiedRegion(region);
      } : undefined
  );

  // Setup map interactions
  const {
    handlePinClick,
    handleClusterClick,
    handleMapLongPress,
    handleOpenBookmarkForm,
    handleAddBookmark,
    handleViewBookmark,
    handleZoomIn,
    handleZoomOut
  } = useMapInteractions(
    mapCenter,
    setMapCenter,
    viewportRadius,
    setViewportRadius,
    setActiveTourId,
    bookmarks,
    setBookmarks,
    setIsBookmarkFormOpen,
    setLongPressLocation,
    lastNotifiedRegion,
    setLastNotifiedRegion,
    interactive,
    onRegionChange,
    onPinClick
  );

  return (
    <div 
      className={`relative bg-oasis-light rounded-lg overflow-hidden ${className}`}
      onMouseDown={(e) => {
        // Only trigger for right mouse button (simulating long press)
        if (e.button === 2) {
          e.preventDefault();
          handleMapLongPress(e);
        }
      }}
      onContextMenu={(e) => {
        // Prevent context menu
        e.preventDefault();
      }}
    >
      {!isMapLoaded ? (
        <MapLoading />
      ) : (
        <>
          {/* Saudi-themed map background with terrain texture */}
          <MapBackground />
          
          {/* Tour paths */}
          <TourPathsLayer 
            tours={toursWithPaths} 
            mapCenter={mapCenter} 
            zoom={zoom}
            activeTourId={activeTourId} 
          />
          
          {/* User's current location */}
          <UserLocation 
            location={location} 
            showUserLocation={showUserLocation} 
          />
          
          {/* All map pins, bookmarks, and clusters */}
          <MapPinsLayer
            points={points}
            bookmarks={bookmarks}
            mapCenter={mapCenter}
            zoom={zoom}
            onPinClick={handlePinClick}
            onClusterClick={handleClusterClick}
            onViewBookmark={handleViewBookmark}
            onLongPress={(point) => {
              handleOpenBookmarkForm(point);
            }}
          />
          
          {/* Map controls and compass */}
          <MapControls 
            interactive={interactive}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onAddBookmark={handleOpenBookmarkForm}
            showBookmarkButton={true}
          />
          
          {/* Offline mode indicator */}
          <MapOfflineIndicator isOfflineMode={isOfflineMode} />
          
          {/* Geofencing alerts */}
          {interactive && (
            <GeofenceAlert 
              userLocation={location} 
              points={points}
              onViewDetails={(tour) => {
                if (onPinClick) {
                  onPinClick(tour.location, tour);
                }
              }}
            />
          )}
          
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
        </>
      )}
    </div>
  );
};

export default MapCore;
