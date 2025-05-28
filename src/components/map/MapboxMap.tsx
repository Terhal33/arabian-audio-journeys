
import React, { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapLocation } from '@/types/map';
import { Tour } from '@/services/toursData';
import MapboxMarkers from './MapboxMarkers';
import MapboxTourPaths from './MapboxTourPaths';
import { useToast } from '@/hooks/use-toast';

// Mapbox access token - in production, this should be in environment variables
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbTRtd21zNWowNG50MmtzZGF0dmdreGd5In0.DBTF7zfUDjyZ7EGHgmODRQ';

interface MapboxMapProps {
  location: MapLocation;
  points?: any[];
  zoom?: number;
  interactive?: boolean;
  className?: string;
  onPinClick?: (location: MapLocation, tour?: Tour) => void;
  onRegionChange?: (region: any) => void;
  showUserLocation?: boolean;
  onMapLoad?: () => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  location,
  points = [],
  zoom = 14,
  interactive = true,
  className = 'h-64 w-full',
  onPinClick,
  onRegionChange,
  showUserLocation = true,
  onMapLoad
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [activeTourId, setActiveTourId] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Track previous location to prevent unnecessary updates
  const prevLocationRef = useRef<MapLocation>(location);
  const isInitializedRef = useRef(false);

  // Memoize the region change handler to prevent infinite loops
  const handleRegionChange = useCallback((newRegion: any) => {
    if (onRegionChange) {
      onRegionChange(newRegion);
    }
  }, [onRegionChange]);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || isInitializedRef.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12',
        center: [location.lng, location.lat],
        zoom: zoom,
        interactive: interactive
      });

      map.current.on('load', () => {
        setIsMapLoaded(true);
        isInitializedRef.current = true;
        if (onMapLoad) {
          onMapLoad();
        }
        console.log('Mapbox map loaded successfully');
      });

      // Add move event listener with proper debouncing
      let moveTimeout: NodeJS.Timeout;
      map.current.on('move', () => {
        if (!map.current) return;
        
        clearTimeout(moveTimeout);
        moveTimeout = setTimeout(() => {
          if (map.current) {
            const center = map.current.getCenter();
            const bounds = map.current.getBounds();
            const newRegion = {
              latitude: center.lat,
              longitude: center.lng,
              latitudeDelta: bounds.getNorth() - bounds.getSouth(),
              longitudeDelta: bounds.getEast() - bounds.getWest()
            };
            handleRegionChange(newRegion);
          }
        }, 300); // Debounce to prevent excessive calls
      });

      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        toast({
          title: "Map Error",
          description: "There was an issue loading the map. Please try again.",
          variant: "destructive"
        });
      });

    } catch (error) {
      console.error('Error initializing Mapbox:', error);
      toast({
        title: "Map Initialization Failed",
        description: "Unable to initialize the map. Please check your connection.",
        variant: "destructive"
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []); // Empty dependency array - only run once

  // Update map center when location changes (but only if significantly different)
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    const prevLoc = prevLocationRef.current;
    const locationChanged = Math.abs(location.lat - prevLoc.lat) > 0.001 || 
                           Math.abs(location.lng - prevLoc.lng) > 0.001;

    if (locationChanged) {
      map.current.setCenter([location.lng, location.lat]);
      prevLocationRef.current = location;
    }
  }, [location.lat, location.lng, isMapLoaded]);

  // Update zoom when prop changes
  useEffect(() => {
    if (map.current && isMapLoaded) {
      map.current.setZoom(zoom);
    }
  }, [zoom, isMapLoaded]);

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full rounded-lg" />
      
      {/* Markers layer */}
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
      
      {/* Tour paths layer */}
      <MapboxTourPaths
        map={map.current}
        isMapLoaded={isMapLoaded}
        points={points}
        activeTourId={activeTourId}
      />
    </div>
  );
};

export default MapboxMap;
