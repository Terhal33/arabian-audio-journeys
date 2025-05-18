
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapLocation, MapProps } from '@/types/map';
import { toast } from '@/hooks/use-toast';

interface MapboxMapProps extends MapProps {
  mapboxToken?: string;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  location,
  points = [],
  zoom = 14,
  interactive = true,
  className,
  onPinClick,
  onRegionChange,
  showUserLocation,
  mapboxToken
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const userMarker = useRef<mapboxgl.Marker | null>(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [location.lng, location.lat],
        zoom: zoom,
        interactive: interactive
      });

      map.current.on('load', () => {
        console.log("Mapbox map loaded successfully");
        setIsMapLoaded(true);
      });

      // Add navigation controls if interactive
      if (interactive) {
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      }

      // When the map moves, notify about region change
      if (onRegionChange) {
        map.current.on('moveend', () => {
          if (!map.current) return;
          
          const center = map.current.getCenter();
          const bounds = map.current.getBounds();
          
          // Calculate approximate radius in km based on viewport bounds
          const ne = bounds.getNorthEast();
          const sw = bounds.getSouthWest();
          const radiusLat = Math.abs(ne.lat - sw.lat) / 2;
          const radiusLng = Math.abs(ne.lng - sw.lng) / 2;
          const radius = Math.max(radiusLat, radiusLng) * 111; // Rough conversion to km
          
          onRegionChange({
            lat: center.lat,
            lng: center.lng,
            radius: radius
          });
        });
      }

      return () => {
        // Clean up markers
        markers.current.forEach(marker => marker.remove());
        markers.current = [];
        
        if (userMarker.current) {
          userMarker.current.remove();
          userMarker.current = null;
        }
        
        // Clean up map
        map.current?.remove();
      };
    } catch (error) {
      console.error("Error initializing Mapbox:", error);
      toast({
        title: "Map Error",
        description: "Could not initialize the map. Please check your Mapbox token.",
        variant: "destructive"
      });
    }
  }, [mapboxToken]);

  // Update map when location changes
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;
    map.current.flyTo({ center: [location.lng, location.lat] });
  }, [location.lat, location.lng, isMapLoaded]);

  // Update map when zoom changes
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;
    map.current.setZoom(zoom);
  }, [zoom, isMapLoaded]);

  // Update points/markers when they change
  useEffect(() => {
    if (!map.current || !isMapLoaded || !points) return;
    
    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Add new markers for each point
    points.forEach(point => {
      if (!map.current) return;
      
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '25px';
      el.style.height = '25px';
      el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/pin.png)';
      el.style.backgroundSize = 'contain';
      el.style.cursor = 'pointer';
      
      // If the point is premium, add a special style
      if (point.tour?.isPremium) {
        el.style.filter = 'hue-rotate(40deg) saturate(2)';
      }
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([point.lng, point.lat])
        .addTo(map.current);
        
      // Add click handler if interactive
      if (interactive && onPinClick) {
        el.addEventListener('click', () => {
          if (onPinClick) onPinClick(point, point.tour);
        });
      }
      
      markers.current.push(marker);
    });
  }, [points, isMapLoaded, interactive, onPinClick]);

  // Handle user location marker
  useEffect(() => {
    if (!map.current || !isMapLoaded || !showUserLocation) return;
    
    // Remove existing user marker
    if (userMarker.current) {
      userMarker.current.remove();
      userMarker.current = null;
    }
    
    // Create user location marker
    const el = document.createElement('div');
    el.className = 'user-marker';
    el.innerHTML = `
      <div style="position: relative;">
        <div style="position: absolute; transform: translate(-50%, -50%); width: 16px; height: 16px; background-color: white; border: 3px solid #3b82f6; border-radius: 50%; box-shadow: 0 0 0 2px white;"></div>
        <div style="position: absolute; transform: translate(-50%, -50%); width: 32px; height: 32px; background-color: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: pulse 2s infinite;"></div>
      </div>
    `;
    
    // Add pulse animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0% {
          transform: translate(-50%, -50%) scale(1);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(2);
          opacity: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    userMarker.current = new mapboxgl.Marker(el)
      .setLngLat([location.lng, location.lat])
      .addTo(map.current);
    
  }, [location, isMapLoaded, showUserLocation]);

  return (
    <div className={className}>
      <div ref={mapContainer} className="h-full w-full rounded-lg" />
    </div>
  );
};

export default MapboxMap;
