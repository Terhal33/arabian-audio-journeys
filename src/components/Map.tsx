
import React from 'react';
import { MapLocation } from '@/types/map';
import { Tour } from '@/services/toursData';
import InteractiveMap from './InteractiveMap';
import MapCore from './map/MapCore';

interface MapProps {
  location: MapLocation;
  points?: any[];
  zoom?: number;
  interactive?: boolean;
  className?: string;
  onPinClick?: (location: MapLocation, tour?: Tour) => void;
  onRegionChange?: (region: any) => void;
  showUserLocation?: boolean;
  onLongPress?: (location: MapLocation) => void;
}

const Map: React.FC<MapProps> = ({
  location,
  points = [],
  zoom = 14,
  interactive = true,
  className = 'h-64 w-full',
  onPinClick,
  onRegionChange,
  showUserLocation = true,
  onLongPress
}) => {
  // Convert tour locations to tour points for InteractiveMap
  const tourPoints = points.map(point => ({
    id: point.id,
    coordinates: [point.lng, point.lat] as [number, number],
    title: point.tour?.title || point.title || 'Unknown Location',
    description: point.tour?.description || point.description || 'No description available',
    audioUrl: point.tour?.audioUrl,
    imageUrl: point.tour?.imageUrl,
    category: point.type === 'historic' ? 'historical' as const :
              point.type === 'cultural' ? 'cultural' as const :
              point.type === 'nature' ? 'natural' as const :
              'modern' as const,
    duration: point.tour?.duration
  }));

  const handlePointSelect = (point: any) => {
    // Convert back to the expected format for onPinClick
    const mapLocation: MapLocation = {
      lat: point.coordinates[1],
      lng: point.coordinates[0]
    };
    
    // Find the original tour data
    const originalPoint = points.find(p => p.id === point.id);
    onPinClick?.(mapLocation, originalPoint?.tour);
  };

  return (
    <InteractiveMap
      tourPoints={tourPoints}
      center={[location.lng, location.lat]}
      zoom={zoom}
      onPointSelect={handlePointSelect}
      showAudioControls={true}
      enableLocationTracking={showUserLocation}
      className={className}
    />
  );
};

export default Map;
