
import { Tour } from '@/services/toursData';
import { MapLocation, MapRegion } from '@/types/map';
import { Bookmark } from '@/components/map/Bookmarks';
import { toast } from '@/hooks/use-toast';

/**
 * Hook for handling map interactions like clicks, zooms, and bookmarks
 */
export const useMapInteractions = (
  mapCenter: MapLocation,
  setMapCenter: (center: MapLocation) => void,
  viewportRadius: number,
  setViewportRadius: (radius: number) => void,
  setActiveTourId: (id: string | null) => void,
  bookmarks: Bookmark[],
  setBookmarks: (bookmarks: Bookmark[]) => void,
  setIsBookmarkFormOpen: (isOpen: boolean) => void,
  setLongPressLocation: (location: MapLocation | null) => void,
  lastNotifiedRegion: MapRegion | null,
  setLastNotifiedRegion: (region: MapRegion | null) => void,
  interactive: boolean,
  onRegionChange?: (region: MapRegion) => void,
  onPinClick?: (location: MapLocation, tour?: Tour) => void
) => {
  const handlePinClick = (point: any) => {
    if (onPinClick && interactive) {
      onPinClick(point, point.tour);
      
      // Set active tour for highlighting path
      if (point.tour) {
        setActiveTourId(point.tour.id);
      }
    }
  };

  const handleClusterClick = (center: MapLocation) => {
    if (interactive) {
      // Zoom in when clicking a cluster
      setMapCenter(center);
      
      // Decrease viewport radius to simulate zoom in
      const newRadius = Math.max(2, viewportRadius * 0.7);
      setViewportRadius(newRadius);
      
      // Notify region change with new center and radius
      if (onRegionChange) {
        const newRegion = {
          lat: center.lat,
          lng: center.lng,
          radius: newRadius
        };
        
        onRegionChange(newRegion);
        setLastNotifiedRegion(newRegion);
      }
    }
  };
  
  const handleMapLongPress = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return;
    
    // Get click coordinates relative to the map container
    const mapRect = e.currentTarget.getBoundingClientRect();
    const relativeX = (e.clientX - mapRect.left) / mapRect.width;
    const relativeY = (e.clientY - mapRect.top) / mapRect.height;
    
    // Convert to geo coordinates (simplified for demo)
    const zoom = 5; // This should be passed in from props in a real implementation
    const lng = mapCenter.lng + (relativeX - 0.5) * (0.1 / zoom);
    const lat = mapCenter.lat - (relativeY - 0.5) * (0.05 / zoom);
    
    setLongPressLocation({ lat, lng });
    setIsBookmarkFormOpen(true);
  };
  
  const handleOpenBookmarkForm = (point: MapLocation | null = null) => {
    if (point) {
      setLongPressLocation(point);
    } else if (!point) {
      setLongPressLocation(mapCenter);
    }
    setIsBookmarkFormOpen(true);
  };
  
  const handleAddBookmark = (bookmarkData: Omit<Bookmark, 'id' | 'createdAt'>) => {
    const newBookmark: Bookmark = {
      ...bookmarkData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    setBookmarks([...bookmarks, newBookmark]);
    
    toast({
      title: "Bookmark created",
      description: `${newBookmark.name} has been added to your bookmarks`,
    });
    
    setIsBookmarkFormOpen(false);
    setLongPressLocation(null);
  };
  
  const handleViewBookmark = (bookmark: Bookmark) => {
    setMapCenter({ lat: bookmark.lat, lng: bookmark.lng });
    
    // Notify region change with bookmark location
    if (onRegionChange) {
      const newRegion = {
        lat: bookmark.lat,
        lng: bookmark.lng,
        radius: viewportRadius
      };
      
      onRegionChange(newRegion);
      setLastNotifiedRegion(newRegion);
    }
  };
  
  const handleZoomIn = () => {
    // Decrease viewport radius to simulate zoom in
    const newRadius = Math.max(1, viewportRadius * 0.7);
    setViewportRadius(newRadius);
    
    // Notify region change with new radius
    if (onRegionChange) {
      const newRegion = {
        lat: mapCenter.lat,
        lng: mapCenter.lng,
        radius: newRadius
      };
      
      onRegionChange(newRegion);
      setLastNotifiedRegion(newRegion);
    }
  };
  
  const handleZoomOut = () => {
    // Increase viewport radius to simulate zoom out
    const newRadius = viewportRadius * 1.5;
    setViewportRadius(newRadius);
    
    // Notify region change with new radius
    if (onRegionChange) {
      const newRegion = {
        lat: mapCenter.lat,
        lng: mapCenter.lng,
        radius: newRadius
      };
      
      onRegionChange(newRegion);
      setLastNotifiedRegion(newRegion);
    }
  };

  return {
    handlePinClick,
    handleClusterClick,
    handleMapLongPress,
    handleOpenBookmarkForm,
    handleAddBookmark,
    handleViewBookmark,
    handleZoomIn,
    handleZoomOut
  };
};
