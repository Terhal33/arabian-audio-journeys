
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

// A more advanced map placeholder that simulates a real map with Saudi terrain
const Map = (props: MapProps) => {
  return <MapCore {...props} />;
};

export default Map;
