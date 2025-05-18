
import React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tour } from '@/services/toursData';

interface MapPinProps {
  point: {
    id?: string;
    lat: number;
    lng: number;
    type?: 'historic' | 'cultural' | 'religious' | 'nature' | 'modern' | 'user';
    isPremium?: boolean;
    tour?: Tour;
  };
  mapCenter: { lat: number; lng: number };
  zoom: number;
  onClick: (point: MapPinProps['point']) => void;
}

const MapPin: React.FC<MapPinProps> = ({ point, mapCenter, zoom, onClick }) => {
  // Generate the pin color based on type and premium status
  const getPinColor = (type?: string, isPremium?: boolean) => {
    if (isPremium) return 'bg-gold';
    
    switch (type) {
      case 'historic': return 'bg-amber-600';
      case 'cultural': return 'bg-purple-600';
      case 'religious': return 'bg-green-600';
      case 'nature': return 'bg-emerald-600';
      case 'modern': return 'bg-blue-600';
      case 'user': return 'bg-desert-dark';
      default: return 'bg-oasis';
    }
  };

  return (
    <div 
      className={cn(
        "absolute transform -translate-x-1/2 -translate-y-1/2 z-10 cursor-pointer",
        point.isPremium ? "filter drop-shadow-lg" : ""
      )}
      style={{
        // Calculate position based on difference from center and zoom
        left: `${50 + (point.lng - mapCenter.lng) * zoom * 200}%`, 
        top: `${50 - (point.lat - mapCenter.lat) * zoom * 200}%`
      }}
      onClick={() => onClick(point)}
    >
      <div className={cn(
        "group relative flex flex-col items-center",
        point.isPremium ? "animate-pulse-slow" : ""
      )}>
        {/* Pin shadow */}
        <div className="absolute -bottom-1 w-3 h-1 bg-black/20 rounded-full"></div>
        
        {/* Pin */}
        <div className={cn(
          "p-1 rounded-full shadow-md transition-all hover:scale-110",
          getPinColor(point.type, point.isPremium),
          point.isPremium ? "ring-2 ring-gold ring-opacity-50" : ""
        )}>
          <MapPin className={cn(
            "h-4 w-4",
            point.isPremium ? "text-black" : "text-white"
          )} />
        </div>
        
        {/* Tooltip on hover */}
        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap transition-opacity">
          {point.tour?.title || 'Location'}
          {point.isPremium && (
            <span className="ml-1 text-gold">✦</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MapPin;
