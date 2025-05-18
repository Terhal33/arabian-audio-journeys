import { useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { updateTourPaths } from '@/utils/mapbox';

interface MapboxTourPathsProps {
  map: mapboxgl.Map | null;
  isMapLoaded: boolean;
  points?: any[];
  activeTourId: string | null;
}

const MapboxTourPaths: React.FC<MapboxTourPathsProps> = ({
  map,
  isMapLoaded,
  points = [],
  activeTourId
}) => {
  // Initialize tour paths layer
  useEffect(() => {
    if (!map || !isMapLoaded) return;
    
    // Add custom layer for paths if map supports it
    map.addSource('routes', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: []
      }
    });
    
    map.addLayer({
      id: 'tour-routes',
      type: 'line',
      source: 'routes',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#8B4513',
        'line-width': 4,
        'line-opacity': 0.7
      }
    });
    
    return () => {
      // Clean up the route layer when component unmounts
      // First check if map still exists
      if (!map) return;
      
      // Then safely check for layers and sources before removal
      if (map.getStyle()) {
        // Only attempt removal if the style is still loaded
        if (map.getLayer('tour-routes')) {
          map.removeLayer('tour-routes');
        }
        if (map.getSource('routes')) {
          map.removeSource('routes');
        }
      }
    };
  }, [map, isMapLoaded]);

  // Update paths when active tour changes
  useEffect(() => {
    if (map && isMapLoaded) {
      updateTourPaths(map, points, activeTourId);
    }
  }, [map, isMapLoaded, points, activeTourId]);

  return null; // This component doesn't render anything visually
};

export default MapboxTourPaths;
