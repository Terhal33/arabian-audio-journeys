
import React from 'react';
import { Tour } from '@/services/toursData';
import { cn } from '@/lib/utils';

interface MapLocation {
  lat: number;
  lng: number;
}

interface TourPathsLayerProps {
  tours: Tour[];
  mapCenter: MapLocation;
  zoom: number;
  activeTourId: string | null;
}

const TourPathsLayer: React.FC<TourPathsLayerProps> = ({ 
  tours, 
  mapCenter, 
  zoom, 
  activeTourId 
}) => {
  if (!tours || tours.length === 0) return null;
  
  return (
    <>
      {tours.map(tour => (
        <TourPath
          key={`tour-path-${tour.id}`}
          tour={tour}
          mapCenter={mapCenter}
          zoom={zoom}
          isActive={tour.id === activeTourId}
        />
      ))}
    </>
  );
};

interface TourPathProps {
  tour: Tour;
  mapCenter: { lat: number; lng: number };
  zoom: number;
  isActive?: boolean;
}

const TourPath: React.FC<TourPathProps> = ({ tour, mapCenter, zoom, isActive = false }) => {
  // Get all points including the main tour location
  const allPoints = [
    { lat: tour.location.lat, lng: tour.location.lng },
    ...tour.points.map(point => ({ lat: point.location.lat, lng: point.location.lng }))
  ];
  
  // Sort points to create a logical path (in a real app, you'd have an order property)
  // For demo purposes, we'll just connect them in sequence
  
  if (allPoints.length <= 1) {
    return null;
  }
  
  return (
    <>
      {/* Draw path lines between points */}
      {allPoints.map((point, index) => {
        if (index === allPoints.length - 1) return null;
        
        const nextPoint = allPoints[index + 1];
        const startX = 50 + (point.lng - mapCenter.lng) * zoom * 200;
        const startY = 50 - (point.lat - mapCenter.lat) * zoom * 200;
        const endX = 50 + (nextPoint.lng - mapCenter.lng) * zoom * 200;
        const endY = 50 - (nextPoint.lat - mapCenter.lat) * zoom * 200;
        
        // Calculate path properties
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
        
        return (
          <div 
            key={`path-${index}`}
            className={cn(
              "absolute h-0.5 origin-left z-5 rounded",
              isActive ? "bg-desert animate-pulse" : "bg-desert/70",
              tour.isPremium ? "border-b border-gold/50" : ""
            )}
            style={{
              left: `${startX}%`,
              top: `${startY}%`,
              width: `${length}%`,
              transform: `rotate(${angle}deg)`,
            }}
          />
        );
      })}
      
      {/* Draw direction arrows along the path */}
      {allPoints.map((point, index) => {
        if (index === allPoints.length - 1 || index % 2 !== 1) return null;
        
        const prevPoint = allPoints[index - 1];
        const nextPoint = allPoints[index + 1];
        const midX = 50 + (point.lng - mapCenter.lng) * zoom * 200;
        const midY = 50 - (point.lat - mapCenter.lat) * zoom * 200;
        
        // Calculate angle for direction arrow
        const angle = Math.atan2(
          nextPoint.lat - prevPoint.lat,
          nextPoint.lng - prevPoint.lng
        ) * 180 / Math.PI;
        
        return (
          <div 
            key={`arrow-${index}`}
            className={cn(
              "absolute z-6 w-2 h-2 transform -translate-x-1/2 -translate-y-1/2",
              "border-t-4 border-r-4 border-desert rotate-45",
              tour.isPremium ? "border-gold" : "border-desert"
            )}
            style={{
              left: `${midX}%`,
              top: `${midY}%`,
              transform: `translate(-50%, -50%) rotate(${angle + 90}deg)`,
            }}
          />
        );
      })}
    </>
  );
};

export default TourPathsLayer;
