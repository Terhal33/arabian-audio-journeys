
import React, { useEffect, useState, useRef, memo, useCallback } from 'react';
import { Tour } from '@/services/toursData';
import { MapLocation } from '@/types/map';
import MapCore from './map/MapCore';
import MapboxMap from './map/MapboxMap';
import MapboxTokenInput from './map/MapboxTokenInput';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import ProgressIndicator from '@/components/ProgressIndicator';
import { useMapVirtualization } from '@/hooks/useMapVirtualization';

interface MapProps {
  location: MapLocation;
  points?: any[];
  zoom?: number;
  interactive?: boolean;
  className?: string;
  onPinClick?: (location: MapLocation, tour?: Tour) => void;
  onRegionChange?: (region: { lat: number, lng: number, radius: number }) => void;
  showUserLocation?: boolean;
  onLongPress?: (location: MapLocation) => void;
}

const Map = (props: MapProps) => {
  const [mapboxToken, setMapboxToken] = useLocalStorage<string | undefined>('mapbox_token', undefined);
  const [useMapbox, setUseMapbox] = useState<boolean>(false);
  const [isMapLoading, setIsMapLoading] = useState(true);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  
  // Use the new map virtualization hook
  const { visiblePoints, pointsInView, totalPoints } = useMapVirtualization(
    props.points || [],
    props.location,
    props.zoom || 14,
    { maxPoints: 150, buffer: 0.3 }
  );
  
  // Performance monitoring
  useEffect(() => {
    // Log performance metrics
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      console.log(`Map render time: ${endTime - startTime}ms with ${pointsInView}/${totalPoints} points`);
    };
  }, [pointsInView, totalPoints]);
  
  useEffect(() => {
    console.log("Map component rendering with props:", {
      location: props.location,
      pointsCount: props.points?.length,
      visiblePointsCount: pointsInView,
      interactive: props.interactive,
      showUserLocation: props.showUserLocation,
      useMapbox: useMapbox
    });
  }, [props.location, props.points, props.interactive, props.showUserLocation, useMapbox, pointsInView]);
  
  // Use Mapbox if token is available
  useEffect(() => {
    if (mapboxToken) {
      setUseMapbox(true);
    } else {
      setUseMapbox(false);
    }
  }, [mapboxToken]);

  const handleTokenSubmit = (token: string) => {
    setMapboxToken(token);
  };
  
  const handleMapLoaded = useCallback(() => {
    setIsMapLoading(false);
  }, []);
  
  // Handler for long press events from Mapbox map
  const handleMapLongPress = useCallback((e: CustomEvent) => {
    if (props.onLongPress && e.detail?.location) {
      props.onLongPress(e.detail.location);
    }
  }, [props.onLongPress]);

  // Add event listener for custom long press event
  useEffect(() => {
    const container = mapContainerRef.current;
    
    if (container) {
      container.addEventListener('maplongpress', handleMapLongPress as EventListener);
    }
    
    return () => {
      if (container) {
        container.removeEventListener('maplongpress', handleMapLongPress as EventListener);
      }
    };
  }, [handleMapLongPress]);

  return (
    <div ref={mapContainerRef} className={`relative ${props.className || ''}`}>
      <ProgressIndicator isLoading={isMapLoading} className="bg-transparent" />
    
      {useMapbox ? (
        <MapboxMap 
          {...props} 
          points={visiblePoints}
          mapboxToken={mapboxToken}
        />
      ) : (
        <>
          <MapCore 
            {...props} 
            points={visiblePoints}
          />
          <MapboxTokenInput onTokenSubmit={handleTokenSubmit} />
        </>
      )}
      
      {useMapbox && (
        <div className="absolute bottom-4 right-4 text-xs text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
          Powered by Mapbox | {pointsInView}/{totalPoints} points
        </div>
      )}
    </div>
  );
};

// Memoize Map component to prevent unnecessary re-renders
export default memo(Map);
