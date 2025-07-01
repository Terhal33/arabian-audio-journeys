
import React from 'react';
import TourCard from '@/components/TourCard';
import { Tour } from '@/services/toursData';

interface HeritageSectionProps {
  tours: Tour[];
}

const HeritageSection: React.FC<HeritageSectionProps> = ({ tours }) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        <h2 className="text-3xl font-display font-bold text-center mb-4 text-desert-dark">
          Heritage Sites
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeritageSection;
