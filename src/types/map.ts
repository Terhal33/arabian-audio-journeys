
import { Tour } from '@/services/toursData';
import { Bookmark } from '@/components/map/Bookmarks';

export interface MapLocation {
  lat: number;
  lng: number;
}

export interface MapPoint {
  id?: string;
  lat: number;
  lng: number;
  type?: 'historic' | 'cultural' | 'religious' | 'nature' | 'modern' | 'user';
  isPremium?: boolean;
  tour?: Tour;
}

export interface MapCluster {
  center: MapLocation;
  count: number;
}

export interface MapViewport {
  center: MapLocation;
  zoom: number;
  radius: number;
}
