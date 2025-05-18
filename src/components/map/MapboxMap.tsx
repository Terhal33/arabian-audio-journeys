
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapLocation, MapProps } from '@/types/map';
import { toast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { initializeMap, addMapControls, setupMapEventHandlers } from '@/utils/mapbox';
import MapboxMarkers from './MapboxMarkers';
import MapboxTourPaths from './MapboxTourPaths';

interface MapboxMapProps extends MapProps {
  mapboxToken?: string;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  location,
  points = [],
  zoom = 14,
  interactive = true,
  className,
  onPinClick,
  onRegionChange,
  showUserLocation,
  mapboxToken
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [activeTourId, setActiveTourId] = useLocalStorage<string | null>('active_tour_id', null);
  const [isMapReady, setIsMapReady] = useState(false);
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      const newMap = initializeMap(
        mapContainer.current,
        mapboxToken,
        location,
        zoom,
        interactive
      );
      
      map.current = newMap;

      newMap.on('load', () => {
        console.log("Mapbox map loaded successfully");
        setIsMapLoaded(true);
        
        // Ensure the map is fully initialized before setting it as ready
        if (newMap.getContainer()) {
          setIsMapReady(true);
        }
      });

      // Add navigation controls if interactive
      addMapControls(newMap, interactive, !!showUserLocation);
      
      // Set up event handlers
      setupMapEventHandlers(newMap, mapContainer, onRegionChange);
      
      // Handle zoom changes
      newMap.on('zoom', () => {
        if (newMap) {
          setCurrentZoom(newMap.getZoom());
        }
      });

      return () => {
        // Clean up map
        setIsMapReady(false);
        setIsMapLoaded(false);
        newMap.remove();
        map.current = null;
      };
    } catch (error) {
      console.error("Error initializing Mapbox:", error);
      toast({
        title: "Map Error",
        description: "Could not initialize the map. Please check your Mapbox token.",
        variant: "destructive"
      });
    }
  }, [mapboxToken, location.lat, location.lng, zoom, interactive, onRegionChange, showUserLocation]);

  // Update map when location changes
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;
    
    map.current.flyTo({ 
      center: [location.lng, location.lat],
      essential: true // This animation is considered essential for the user experience
    });
  }, [location.lat, location.lng, isMapLoaded]);

  // Update map when zoom changes
  useEffect(() => {
    if (!map.current || !isMapLoaded || currentZoom === zoom) return;
    map.current.zoomTo(zoom);
  }, [zoom, isMapLoaded, currentZoom]);

  return (
    <div className={className}>
      <div ref={mapContainer} className="h-full w-full rounded-lg" />
      
      {/* Marker handling component - Only pass map when it's ready */}
      {isMapReady && (
        <MapboxMarkers 
          map={map.current}
          isMapLoaded={isMapLoaded}
          points={points}
          location={location}
          showUserLocation={showUserLocation}
          activeTourId={activeTourId}
          onPinClick={onPinClick}
          setActiveTourId={setActiveTourId}
        />
      )}
      
      {/* Tour paths component - Only pass map when it's ready */}
      {isMapReady && (
        <MapboxTourPaths 
          map={map.current}
          isMapLoaded={isMapLoaded}
          points={points}
          activeTourId={activeTourId}
        />
      )}
    </div>
  );
};

export default MapboxMap;
