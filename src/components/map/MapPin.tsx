import React from 'react';
import { MapPin as MapPinIcon, Star, Book, Building, Landmark, Mountain } from 'lucide-react';
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
  onLongPress?: (point: MapPinProps['point']) => void;
}

const MapPin: React.FC<MapPinProps> = ({ 
  point, 
  mapCenter, 
  zoom, 
  onClick, 
  onLongPress 
}) => {
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

  // Get the appropriate icon based on type
  const getPinIcon = (type?: string) => {
    switch (type) {
      case 'historic': return <Landmark className={cn("h-4 w-4", point.isPremium ? "text-black" : "text-white")} />;
      case 'cultural': return <Book className={cn("h-4 w-4", point.isPremium ? "text-black" : "text-white")} />;
      case 'religious': return <Building className={cn("h-4 w-4", point.isPremium ? "text-black" : "text-white")} />;
      case 'nature': return <Mountain className={cn("h-4 w-4", point.isPremium ? "text-black" : "text-white")} />;
      case 'modern': return <Star className={cn("h-4 w-4", point.isPremium ? "text-black" : "text-white")} />;
      default: return <MapPinIcon className={cn("h-4 w-4", point.isPremium ? "text-black" : "text-white")} />;
    }
  };

  // Handle click event - prioritize navigation to tour detail
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("MapPin clicked:", point);
    onClick(point);
  };

  // Handle long press event
  const handleLongPress = () => {
    if (onLongPress) {
      onLongPress(point);
    }
  };

  // Setup long press detection
  const handleMouseDown = (e: React.MouseEvent) => {
    const longPressTimer = setTimeout(() => {
      handleLongPress();
    }, 800); // 800ms threshold for long press

    const handleMouseUp = () => {
      clearTimeout(longPressTimer);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mouseup', handleMouseUp);
  };

  // Setup touch long press detection
  const handleTouchStart = (e: React.TouchEvent) => {
    const longPressTimer = setTimeout(() => {
      handleLongPress();
    }, 800); // 800ms threshold for long press

    const handleTouchEnd = () => {
      clearTimeout(longPressTimer);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchend', handleTouchEnd);
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
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
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
          {getPinIcon(point.type)}
        </div>
        
        {/* Tooltip on hover */}
        <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-white px-2 py-1 rounded shadow-md text-xs whitespace-nowrap transition-opacity pointer-events-none">
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
