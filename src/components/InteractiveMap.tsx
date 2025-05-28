
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Navigation, 
  Layers,
  Maximize2,
  Minimize2,
  RotateCcw
} from 'lucide-react';

// Types
interface TourPoint {
  id: string;
  coordinates: [number, number]; // [longitude, latitude]
  title: string;
  description: string;
  audioUrl?: string;
  imageUrl?: string;
  category: 'historical' | 'cultural' | 'natural' | 'modern';
  duration?: number; // in minutes
}

interface MapComponentProps {
  tourPoints: TourPoint[];
  center?: [number, number];
  zoom?: number;
  style?: string;
  onPointSelect?: (point: TourPoint) => void;
  showAudioControls?: boolean;
  enableLocationTracking?: boolean;
  className?: string;
}

// Mapbox styles
const MAP_STYLES = {
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  streets: 'mapbox://styles/mapbox/streets-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v11',
  light: 'mapbox://styles/mapbox/light-v10',
  dark: 'mapbox://styles/mapbox/dark-v10'
};

// Category colors
const CATEGORY_COLORS = {
  historical: '#8B4513',
  cultural: '#FFD700',
  natural: '#228B22',
  modern: '#4169E1'
};

// Permanent Mapbox token
const MAPBOX_TOKEN = 'pk.eyJ1IjoidGVyaGFsIiwiYSI6ImNtYjg1djhhbDA1YXIya3M3ZTA0YmZldjMifQ.T7ipAUJ_hsN63fceNWPIpA';

const InteractiveMap: React.FC<MapComponentProps> = ({
  tourPoints = [],
  center = [46.6753, 24.7136], // Riyadh coordinates
  zoom = 10,
  style = 'streets',
  onPointSelect,
  showAudioControls = true,
  enableLocationTracking = true,
  className = ''
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState<TourPoint | null>(null);
  const [currentStyle, setCurrentStyle] = useState(style);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement] = useState(new Audio());
  const [mapError, setMapError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;

    const initializeMap = async () => {
      try {
        // Dynamically import mapbox-gl
        const mapboxgl = await import('mapbox-gl');
        
        // Set access token
        mapboxgl.default.accessToken = MAPBOX_TOKEN;

        map.current = new mapboxgl.default.Map({
          container: mapContainer.current!,
          style: MAP_STYLES[currentStyle as keyof typeof MAP_STYLES],
          center: center,
          zoom: zoom,
          antialias: true
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.default.NavigationControl(), 'top-right');

        // Add geolocate control if enabled
        if (enableLocationTracking) {
          const geolocate = new mapboxgl.default.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
          });
          map.current.addControl(geolocate, 'top-right');

          geolocate.on('geolocate', (e: any) => {
            setUserLocation([e.coords.longitude, e.coords.latitude]);
          });
        }

        map.current.on('load', () => {
          setMapLoaded(true);
          addTourPoints();
        });

        map.current.on('error', (e: any) => {
          console.error('Map error:', e);
          setMapError('Failed to load map. Please check your internet connection.');
        });

      } catch (error) {
        console.error('Failed to initialize map:', error);
        setMapError('Failed to initialize map. Please refresh the page.');
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [currentStyle]);

  // Add tour points to map
  const addTourPoints = () => {
    if (!map.current || !mapLoaded) return;

    // Add source for tour points
    map.current.addSource('tour-points', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: tourPoints.map(point => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: point.coordinates
          },
          properties: {
            id: point.id,
            title: point.title,
            description: point.description,
            category: point.category,
            audioUrl: point.audioUrl,
            imageUrl: point.imageUrl,
            duration: point.duration
          }
        }))
      }
    });

    // Add layer for tour points
    map.current.addLayer({
      id: 'tour-points',
      type: 'circle',
      source: 'tour-points',
      paint: {
        'circle-radius': [
          'interpolate',
          ['linear'],
          ['zoom'],
          10, 8,
          15, 15
        ],
        'circle-color': [
          'match',
          ['get', 'category'],
          'historical', CATEGORY_COLORS.historical,
          'cultural', CATEGORY_COLORS.cultural,
          'natural', CATEGORY_COLORS.natural,
          'modern', CATEGORY_COLORS.modern,
          '#666666'
        ],
        'circle-stroke-width': 2,
        'circle-stroke-color': '#ffffff',
        'circle-opacity': 0.8
      }
    });

    // Add labels
    map.current.addLayer({
      id: 'tour-point-labels',
      type: 'symbol',
      source: 'tour-points',
      layout: {
        'text-field': ['get', 'title'],
        'text-variable-anchor': ['top', 'bottom', 'left', 'right'],
        'text-radial-offset': 1,
        'text-justify': 'auto',
        'text-size': 12
      },
      paint: {
        'text-color': '#333333',
        'text-halo-color': '#ffffff',
        'text-halo-width': 1
      }
    });

    // Add click event
    map.current.on('click', 'tour-points', (e: any) => {
      const features = e.features;
      if (features.length > 0) {
        const feature = features[0];
        const point = tourPoints.find(p => p.id === feature.properties.id);
        if (point) {
          handlePointSelect(point);
        }
      }
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'tour-points', () => {
      map.current.getCanvas().style.cursor = 'pointer';
    });

    map.current.on('mouseleave', 'tour-points', () => {
      map.current.getCanvas().style.cursor = '';
    });

    // Add popup on hover
    const popup = new (window as any).mapboxgl.Popup({
      closeButton: false,
      closeOnClick: false
    });

    map.current.on('mouseenter', 'tour-points', (e: any) => {
      const feature = e.features[0];
      const coordinates = feature.geometry.coordinates.slice();
      const { title, description, duration, category } = feature.properties;

      popup.setLngLat(coordinates)
        .setHTML(`
          <div class="p-3 max-w-xs">
            <div class="flex items-center mb-2">
              <div class="w-3 h-3 rounded-full mr-2" style="background-color: ${CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]}"></div>
              <h3 class="font-semibold text-sm">${title}</h3>
            </div>
            <p class="text-xs text-gray-600 mb-2">${description}</p>
            ${duration ? `<p class="text-xs text-gray-500">${duration} min tour</p>` : ''}
          </div>
        `)
        .addTo(map.current);
    });

    map.current.on('mouseleave', 'tour-points', () => {
      popup.remove();
    });
  };

  // Handle point selection
  const handlePointSelect = (point: TourPoint) => {
    setSelectedPoint(point);
    onPointSelect?.(point);

    // Fly to point
    if (map.current) {
      map.current.flyTo({
        center: point.coordinates,
        zoom: 15,
        duration: 2000
      });
    }

    // Load audio if available
    if (point.audioUrl && showAudioControls) {
      audioElement.pause();
      audioElement.src = point.audioUrl;
      setIsPlaying(false);
    }
  };

  // Audio controls
  const toggleAudio = async () => {
    if (!selectedPoint?.audioUrl) return;

    try {
      if (isPlaying) {
        audioElement.pause();
        setIsPlaying(false);
      } else {
        await audioElement.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Audio playback error:', error);
    }
  };

  // Change map style
  const changeMapStyle = (newStyle: string) => {
    if (map.current && mapLoaded) {
      map.current.setStyle(MAP_STYLES[newStyle as keyof typeof MAP_STYLES]);
      setCurrentStyle(newStyle);
      
      // Re-add tour points after style change
      map.current.once('styledata', () => {
        addTourPoints();
      });
    }
  };

  // Toggle fullscreen
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mapContainer.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Reset map view
  const resetView = () => {
    if (map.current) {
      map.current.flyTo({
        center: center,
        zoom: zoom,
        duration: 1000
      });
    }
    setSelectedPoint(null);
  };

  // Audio cleanup
  useEffect(() => {
    const audio = audioElement;
    
    const handleEnded = () => setIsPlaying(false);
    const handlePause = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('play', handlePlay);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('play', handlePlay);
      audio.pause();
    };
  }, [audioElement]);

  if (mapError) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 rounded-lg ${className}`}>
        <div className="text-center">
          <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Map Error</h3>
          <p className="text-gray-500 mb-4">{mapError}</p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className} ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full min-h-[400px] rounded-lg overflow-hidden" />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        {/* Style Selector */}
        <div className="bg-white rounded-lg shadow-lg p-2">
          <select
            value={currentStyle}
            onChange={(e) => changeMapStyle(e.target.value)}
            className="text-sm border-none outline-none bg-transparent"
          >
            {Object.keys(MAP_STYLES).map(styleKey => (
              <option key={styleKey} value={styleKey}>
                {styleKey.charAt(0).toUpperCase() + styleKey.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Map Actions */}
        <div className="bg-white rounded-lg shadow-lg p-1 flex flex-col space-y-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            className="text-gray-600 hover:text-oasis"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={resetView}
            className="text-gray-600 hover:text-desert"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <h4 className="text-sm font-semibold mb-2">Tour Categories</h4>
        <div className="space-y-1">
          {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
            <div key={category} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: color }}
              />
              <span className="text-xs capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Point Info */}
      {selectedPoint && (
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 max-w-sm">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-lg">{selectedPoint.title}</h3>
            <button
              onClick={() => setSelectedPoint(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>
          
          {selectedPoint.imageUrl && (
            <img 
              src={selectedPoint.imageUrl} 
              alt={selectedPoint.title}
              className="w-full h-32 object-cover rounded-lg mb-3"
            />
          )}
          
          <p className="text-sm text-gray-600 mb-3">{selectedPoint.description}</p>
          
          {selectedPoint.duration && (
            <p className="text-xs text-gray-500 mb-3">
              Duration: {selectedPoint.duration} minutes
            </p>
          )}

          {/* Audio Controls */}
          {showAudioControls && selectedPoint.audioUrl && (
            <div className="flex items-center space-x-2 pt-3 border-t border-gray-200">
              <Button
                onClick={toggleAudio}
                size="sm"
                className="bg-oasis hover:bg-oasis-dark text-white"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <span className="text-sm text-gray-600">
                {isPlaying ? 'Playing audio tour' : 'Play audio tour'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-oasis border-t-transparent mx-auto mb-4" />
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
