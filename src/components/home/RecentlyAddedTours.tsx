
import React from 'react';
import { Tour } from '@/services/toursData';
import EnhancedTourCard from '@/components/EnhancedTourCard';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

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
            <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="h-52 w-full" />
              <div className="p-5">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex justify-between mt-4">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            </div>
          ))
        ) : (
          tours.slice(0, 2).map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <EnhancedTourCard
                tour={tour}
                isDownloaded={tour.id === 'diriyah-main'}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default React.memo(RecentlyAddedTours);
