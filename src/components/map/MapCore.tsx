
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
import useMapCore from '@/hooks/useMapCore';

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
  
  const {
    isMapLoaded,
    mapCenter,
    viewportRadius,
    isOfflineMode,
    activeTourId,
    longPressLocation,
    isBookmarkFormOpen,
    bookmarks,
    handlePinClick,
    handleClusterClick,
    handleMapLongPress,
    handleOpenBookmarkForm,
    handleAddBookmark,
    handleViewBookmark,
    handleZoomIn,
    handleZoomOut,
    toursWithPaths
  } = useMapCore(props);

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
              handleOpenBookmarkForm(null);
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
