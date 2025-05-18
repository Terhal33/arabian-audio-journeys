
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { MapLocation, MapProps } from '@/types/map';
import { toast } from '@/hooks/use-toast';
import { Tour } from '@/services/toursData';
import { useLocalStorage } from '@/hooks/useLocalStorage';

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
  const [lastUpdatedPoints, setLastUpdatedPoints] = useState<string>('');
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [activeTourId, setActiveTourId] = useLocalStorage<string | null>('active_tour_id', null);
  const [popups, setPopups] = useState<mapboxgl.Popup[]>([]);
  
  // Initialize map when component mounts
  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/outdoors-v12', // Using a style that shows terrain better
        center: [location.lng, location.lat],
        zoom: zoom,
        interactive: interactive,
        attributionControl: false
      });

      map.current.on('load', () => {
        console.log("Mapbox map loaded successfully");
        setIsMapLoaded(true);
        
        // Add custom layer for paths if map supports it
        if (map.current) {
          map.current.addSource('routes', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: []
            }
          });
          
          map.current.addLayer({
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
        }
      });

      // Add navigation controls if interactive
      if (interactive) {
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Add fullscreen control
        map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
        
        // Add geolocate control
        if (showUserLocation) {
          const geolocateControl = new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true
          });
          map.current.addControl(geolocateControl, 'top-right');
        }
      }
      
      // Handle zoom changes
      map.current.on('zoom', () => {
        if (!map.current) return;
        setCurrentZoom(map.current.getZoom());
      });

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
      
      // Handle long press/right click for bookmarks
      if (interactive) {
        map.current.on('contextmenu', (e) => {
          const longPressLocation = {
            lat: e.lngLat.lat,
            lng: e.lngLat.lng
          };
          
          // Dispatch custom event that can be caught by MapCore
          const customEvent = new CustomEvent('maplongpress', { 
            detail: { location: longPressLocation }
          });
          mapContainer.current?.dispatchEvent(customEvent);
        });
      }

      return () => {
        // Clean up markers
        markers.current.forEach(marker => marker.remove());
        markers.current = [];
        
        // Clean up popups
        popups.forEach(popup => popup.remove());
        
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
    map.current.flyTo({ 
      center: [location.lng, location.lat],
      essential: true // This animation is considered essential for the user experience
    });
  }, [location.lat, location.lng, isMapLoaded]);

  // Update map when zoom changes
  useEffect(() => {
    if (!map.current || !isMapLoaded || currentZoom === zoom) return;
    map.current.zoomTo(zoom);
  }, [zoom, isMapLoaded, currentZoom]);

  // Update points/markers when they change
  useEffect(() => {
    if (!map.current || !isMapLoaded || !points) return;
    
    // Check if points have actually changed to avoid unnecessary updates
    const pointsSignature = JSON.stringify(points.map(p => p.id));
    if (pointsSignature === lastUpdatedPoints) return;
    setLastUpdatedPoints(pointsSignature);
    
    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];
    
    // Remove existing popups
    popups.forEach(popup => popup.remove());
    setPopups([]);
    
    // Add new markers for each point
    points.forEach(point => {
      if (!map.current) return;
      
      const el = document.createElement('div');
      el.className = 'mapbox-marker';
      el.style.width = '25px';
      el.style.height = '25px';
      el.style.backgroundImage = 'url(https://docs.mapbox.com/mapbox-gl-js/assets/pin.png)';
      el.style.backgroundSize = 'contain';
      el.style.backgroundRepeat = 'no-repeat';
      el.style.cursor = 'pointer';
      
      // If the point is premium, add a special style
      if (point.tour?.isPremium) {
        el.style.filter = 'hue-rotate(40deg) saturate(2)';
      }
      
      // Highlight active tour
      if (point.tour?.id === activeTourId) {
        el.style.filter = 'hue-rotate(180deg) brightness(1.2)';
        el.style.transform = 'scale(1.2)';
        el.style.zIndex = '10';
      }
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([point.lng, point.lat])
        .addTo(map.current);
        
      // Add popup with tour name
      if (point.tour) {
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 25,
          className: 'mapbox-popup'
        }).setHTML(`
          <div class="p-2 bg-white rounded shadow-md">
            <h3 class="font-medium text-sm">${point.tour.title}</h3>
            ${point.tour.isPremium ? '<span class="text-xs text-amber-600">Premium</span>' : ''}
          </div>
        `);
        
        el.addEventListener('mouseenter', () => {
          marker.setPopup(popup);
          popup.addTo(map.current!);
          setPopups(prev => [...prev, popup]);
        });
        
        el.addEventListener('mouseleave', () => {
          popup.remove();
          setPopups(prev => prev.filter(p => p !== popup));
        });
      }
      
      // Add click handler if interactive
      if (interactive && onPinClick) {
        el.addEventListener('click', () => {
          if (onPinClick) {
            onPinClick(point, point.tour);
            setActiveTourId(point.tour?.id || null);
          }
        });
      }
      
      markers.current.push(marker);
    });
    
    // Update tour paths on the map
    updateTourPaths();
    
  }, [points, isMapLoaded, interactive, onPinClick, activeTourId]);

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
      
      .mapbox-popup .mapboxgl-popup-content {
        padding: 0;
        border-radius: 8px;
      }
    `;
    document.head.appendChild(style);
    
    userMarker.current = new mapboxgl.Marker(el)
      .setLngLat([location.lng, location.lat])
      .addTo(map.current);
    
  }, [location, isMapLoaded, showUserLocation]);
  
  // Function to update tour paths
  const updateTourPaths = () => {
    if (!map.current || !map.current.isStyleLoaded() || !points || points.length === 0) return;
    
    try {
      // Find active tour
      const activeTour = points.find(p => p.tour?.id === activeTourId)?.tour;
      
      if (!activeTour || !activeTour.points || activeTour.points.length === 0) {
        // Clear routes if no active tour or no points
        map.current.getSource('routes')?.setData({
          type: 'FeatureCollection',
          features: []
        });
        return;
      }
      
      // Create path coordinates
      const coordinates = [
        [activeTour.location.lng, activeTour.location.lat],
        ...activeTour.points.map(point => [point.location.lng, point.location.lat])
      ];
      
      // Update the route data
      map.current.getSource('routes')?.setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coordinates
            }
          }
        ]
      });
    } catch (error) {
      console.error("Error updating tour paths:", error);
    }
  };

  return (
    <div className={className}>
      <div ref={mapContainer} className="h-full w-full rounded-lg" />
    </div>
  );
};

export default MapboxMap;
