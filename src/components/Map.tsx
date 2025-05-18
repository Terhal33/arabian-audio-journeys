
import React, { useEffect } from 'react';
import { Tour } from '@/services/toursData';
import MapCore from './map/MapCore';
import { MapLocation } from '@/types/map';

interface MapProps {
  location: MapLocation;
  points?: any[];
  zoom?: number;
  interactive?: boolean;
  className?: string;
  onPinClick?: (location: MapLocation, tour?: Tour) => void;
  onRegionChange?: (region: { lat: number, lng: number, radius: number }) => void;
  showUserLocation?: boolean;
}

// Map component that delegates rendering to MapCore
const Map = (props: MapProps) => {
  useEffect(() => {
    console.log("Map component rendering with props:", {
      location: props.location,
      pointsCount: props.points?.length,
      interactive: props.interactive,
      showUserLocation: props.showUserLocation
    });
  }, [props.location, props.points, props.interactive, props.showUserLocation]);
  
  return <MapCore {...props} />;
};

export default Map;
