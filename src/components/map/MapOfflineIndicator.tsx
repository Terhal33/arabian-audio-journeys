
import React from 'react';
import { MapPinOff } from 'lucide-react';

interface MapOfflineIndicatorProps {
  isOfflineMode: boolean;
}

const MapOfflineIndicator: React.FC<MapOfflineIndicatorProps> = ({ isOfflineMode }) => {
  if (!isOfflineMode) return null;
  
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md z-30 flex items-center">
      <MapPinOff className="h-4 w-4 text-desert-dark mr-1" />
      <span className="text-xs font-medium">Offline Mode</span>
    </div>
  );
};

export default MapOfflineIndicator;
