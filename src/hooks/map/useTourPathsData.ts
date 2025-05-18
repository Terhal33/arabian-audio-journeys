
import { Tour } from '@/services/toursData';

/**
 * Hook to prepare tour path data for rendering
 */
export const useTourPathsData = (
  points: any[] = [],
  activeTourId: string | null
) => {
  // Find tours to display paths for
  const toursWithPaths = points
    .filter(p => p.tour && (p.tour.id === activeTourId || p.tour.points.length > 0))
    .map(p => p.tour!)
    .filter((tour: Tour, index: number, self: Tour[]) => 
      self.findIndex(t => t.id === tour.id) === index);

  return {
    toursWithPaths
  };
};
