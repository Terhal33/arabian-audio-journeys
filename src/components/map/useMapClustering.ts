
import { useState, useEffect } from 'react';
import { Tour } from '@/services/toursData';

export interface MapPin {
  id?: string;
  lat: number;
  lng: number;
  type?: 'historic' | 'cultural' | 'religious' | 'nature' | 'modern' | 'user';
  isPremium?: boolean;
  tour?: Tour;
}

export interface Cluster {
  center: { lat: number; lng: number };
  count: number;
}

export const useMapClustering = (points: MapPin[]) => {
  const [clusters, setClusters] = useState<Cluster[]>([]);

  // Simulate clustering algorithm based on points proximity
  useEffect(() => {
    if (points.length < 5) {
      setClusters([]);
      return;
    }
    
    // Simple clustering simulation
    const newClusters: Cluster[] = [];
    const gridSize = 0.05; // Approximately 5km grid
    const gridMap = new Map();
    
    points.forEach(point => {
      // Create a grid cell key
      const gridX = Math.floor(point.lat / gridSize);
      const gridY = Math.floor(point.lng / gridSize);
      const key = `${gridX}:${gridY}`;
      
      if (!gridMap.has(key)) {
        gridMap.set(key, { points: [], center: { lat: 0, lng: 0 } });
      }
      
      const cell = gridMap.get(key);
      if (cell) {
        cell.points.push(point);
        
        // Recalculate center
        cell.center.lat = cell.points.reduce((sum, p) => sum + p.lat, 0) / cell.points.length;
        cell.center.lng = cell.points.reduce((sum, p) => sum + p.lng, 0) / cell.points.length;
      }
    });
    
    // Convert clusters with more than 3 points
    gridMap.forEach(cell => {
      if (cell.points.length > 3) {
        newClusters.push({
          center: cell.center,
          count: cell.points.length
        });
      }
    });
    
    setClusters(newClusters);
  }, [points]);

  // Return points that are not part of clusters
  const filteredPoints = points.filter(point => {
    // Filter out points that would be in clusters
    const isInCluster = clusters.some(cluster => {
      const distance = Math.sqrt(
        Math.pow(cluster.center.lat - point.lat, 2) + 
        Math.pow(cluster.center.lng - point.lng, 2)
      );
      return distance < 0.05; // Same as gridSize
    });
    
    return !isInCluster;
  });

  return { clusters, filteredPoints };
};
