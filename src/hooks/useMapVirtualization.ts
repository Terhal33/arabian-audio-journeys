
import { useState, useEffect, useCallback } from 'react';
import { Tour } from '@/services/toursData';
import { MapLocation } from '@/types/map';

export interface VirtualizationOptions {
  maxPoints?: number;
  buffer?: number; // Buffer area around visible region as a percentage (0.1 = 10%)
  minZoom?: number;
}

// Default virtualization options
const defaultOptions: VirtualizationOptions = {
  maxPoints: 100,
  buffer: 0.2,
  minZoom: 10,
};

export const useMapVirtualization = (
  allPoints: any[],
  centerLocation: MapLocation,
  zoom: number = 14,
  options: VirtualizationOptions = defaultOptions
) => {
  const [visiblePoints, setVisiblePoints] = useState<any[]>([]);
  const [pointsInView, setPointsInView] = useState<number>(0);
  const [totalPoints, setTotalPoints] = useState<number>(0);

  // Calculate the visible points based on viewport
  const calculateVisiblePoints = useCallback(() => {
    if (!allPoints || !allPoints.length) {
      setVisiblePoints([]);
      setPointsInView(0);
      setTotalPoints(0);
      return;
    }

    setTotalPoints(allPoints.length);

    // Calculate the zoom factor - at higher zoom levels we show more detail
    const zoomFactor = Math.max(0.01, Math.min(1, zoom / 20));
    
    // Calculate the range multiplier based on zoom (show more points at higher zoom)
    const rangeMultiplier = Math.max(0.01, (1 - zoomFactor) * 5);
    
    // Calculate viewport bounds with buffer
    const buffer = options.buffer || defaultOptions.buffer || 0.2;
    const range = rangeMultiplier * (buffer + 1/zoom);
    
    const north = centerLocation.lat + range;
    const south = centerLocation.lat - range;
    const east = centerLocation.lng + range;
    const west = centerLocation.lng - range;
    
    // Filter points to those within bounds
    const inBoundsPoints = allPoints.filter(point => {
      return (
        point.lat <= north &&
        point.lat >= south &&
        point.lng <= east &&
        point.lng >= west
      );
    });
    
    // Order by distance from center for importance
    const sortedPoints = [...inBoundsPoints].sort((a, b) => {
      const distA = Math.sqrt(
        Math.pow(a.lat - centerLocation.lat, 2) + 
        Math.pow(a.lng - centerLocation.lng, 2)
      );
      const distB = Math.sqrt(
        Math.pow(b.lat - centerLocation.lat, 2) + 
        Math.pow(b.lng - centerLocation.lng, 2)
      );
      return distA - distB;
    });
    
    // Limit to max points (if specified)
    const limited = options.maxPoints 
      ? sortedPoints.slice(0, options.maxPoints) 
      : sortedPoints;
    
    setVisiblePoints(limited);
    setPointsInView(sortedPoints.length);
    
    // Log performance metrics
    console.log(`Map virtualization: ${limited.length}/${sortedPoints.length} points rendered (${allPoints.length} total)`);
  }, [allPoints, centerLocation, zoom, options]);

  // Recalculate visible points when inputs change
  useEffect(() => {
    calculateVisiblePoints();
  }, [calculateVisiblePoints]);

  return {
    visiblePoints,
    pointsInView,
    totalPoints,
    calculateVisiblePoints
  };
};
