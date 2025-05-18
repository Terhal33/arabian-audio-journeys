
import React from 'react';
import { Tour } from '@/services/toursData';
import EnhancedTourCard from '@/components/EnhancedTourCard';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentlyAddedToursProps {
  tours: Tour[];
  isLoading: boolean;
}

const RecentlyAddedTours = ({ tours, isLoading }: RecentlyAddedToursProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-bold text-desert-dark">Recently Added</h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {isLoading ? (
          Array(2).fill(0).map((_, i) => (
            <div key={i} className="h-[200px] bg-white rounded-lg animate-pulse" />
          ))
        ) : (
          tours.slice(0, 2).map(tour => (
            <EnhancedTourCard
              key={tour.id}
              tour={tour}
              isDownloaded={tour.id === 'diriyah-main'}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default RecentlyAddedTours;
