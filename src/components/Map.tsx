
import React, { useEffect, useState, useRef } from 'react';
import { Tour } from '@/services/toursData';
import { MapLocation } from '@/types/map';
import MapCore from './map/MapCore';
import MapboxMap from './map/MapboxMap';
import MapboxTokenInput from './map/MapboxTokenInput';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Map component rendering with props:", {
      location: props.location,
      pointsCount: props.points?.length,
      interactive: props.interactive,
      showUserLocation: props.showUserLocation,
      useMapbox: useMapbox
    });
  }, [props.location, props.points, props.interactive, props.showUserLocation, useMapbox]);
  
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
  
  // Handler for long press events from Mapbox map
  const handleMapLongPress = (e: CustomEvent) => {
    if (props.onLongPress && e.detail?.location) {
      props.onLongPress(e.detail.location);
    }
  };

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
  }, [props.onLongPress]);

  return (
    <div ref={mapContainerRef} className={`relative ${props.className || ''}`}>
      {useMapbox ? (
        <MapboxMap {...props} mapboxToken={mapboxToken} />
      ) : (
        <>
          <MapCore {...props} />
          <MapboxTokenInput onTokenSubmit={handleTokenSubmit} />
        </>
      )}
      
      {useMapbox && (
        <div className="absolute bottom-4 right-4 text-xs text-white bg-black/50 px-2 py-1 rounded backdrop-blur-sm">
          Powered by Mapbox
        </div>
      )}
    </div>
  );
};

export default Map;
