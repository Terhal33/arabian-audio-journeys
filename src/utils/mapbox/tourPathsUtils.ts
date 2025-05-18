
import mapboxgl from 'mapbox-gl';

// Create and add tour paths to the map
export const updateTourPaths = (
  map: mapboxgl.Map | null,
  points: any[] = [],
  activeTourId: string | null
): void => {
  if (!map || !map.isStyleLoaded() || points.length === 0) return;
  
  try {
    // Find active tour
    const activeTour = points.find(p => p.tour?.id === activeTourId)?.tour;
    
    if (!activeTour || !activeTour.points || activeTour.points.length === 0) {
      // Clear routes if no active tour or no points
      const source = map.getSource('routes') as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: 'FeatureCollection',
          features: []
        });
      }
      return;
    }
    
    // Create path coordinates
    const coordinates = [
      [activeTour.location.lng, activeTour.location.lat],
      ...activeTour.points.map(point => [point.location.lng, point.location.lat])
    ];
    
    // Update the route data
    const source = map.getSource('routes') as mapboxgl.GeoJSONSource;
    if (source) {
      source.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates
            }
          }
        ]
      });
    }
  } catch (error) {
    console.error("Error updating tour paths:", error);
  }
};
