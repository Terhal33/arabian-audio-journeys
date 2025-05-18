
import React from 'react';
import { Tour } from '@/services/toursData';
import MapCore from './map/MapCore';

interface MapLocation {
  lat: number;
  lng: number;
}

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
  console.log("Map component rendering with props:", props);
  return <MapCore {...props} />;
};

export default Map;
