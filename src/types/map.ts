
import { Tour } from '@/services/toursData';

export interface MapLocation {
  lat: number;
  lng: number;
}

export interface MapRegion {
  lat: number;
  lng: number;
  radius: number;
}

export interface MapProps {
  location: MapLocation;
  points?: any[];
  zoom?: number;
  interactive?: boolean;
  className?: string;
  onPinClick?: (location: MapLocation, tour?: Tour) => void;
  onRegionChange?: (region: MapRegion) => void;
  showUserLocation?: boolean;
  onLongPress?: (location: MapLocation) => void;
}
