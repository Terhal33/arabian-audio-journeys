
import React from 'react';
import { Tour } from '@/services/toursData';
import TourCard from '@/components/TourCard';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Skeleton } from '@/components/ui/skeleton';

interface TourCarouselProps {
  title: string;
  tours: Tour[];
  viewAllLink?: string;
  isLoading?: boolean;
}

const TourCarousel = ({ 
  title, 
  tours, 
  viewAllLink,
  isLoading = false
}: TourCarouselProps) => {
  // Create skeleton placeholders for loading state
  const skeletonItems = Array(3).fill(0).map((_, i) => (
    <CarouselItem key={`skeleton-${i}`} className="md:basis-1/2 lg:basis-1/3">
      <div className="p-1">
        <div className="bg-white rounded-lg overflow-hidden shadow-md">
          <Skeleton className="h-52 w-full" />
          <div className="p-5">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <div className="flex justify-between">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/4" />
            </div>
          </div>
        </div>
      </div>
    </CarouselItem>
  ));

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-display text-xl font-bold text-desert-dark">{title}</h2>
        {viewAllLink && (
          <a href={viewAllLink} className="text-oasis text-sm font-medium">
            View All
          </a>
        )}
      </div>
      
      <Carousel className="w-full">
        <CarouselContent className="-ml-2 md:-ml-4">
          {isLoading ? (
            skeletonItems
          ) : (
            tours.map((tour) => (
              <CarouselItem key={tour.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <TourCard tour={tour} />
                </div>
              </CarouselItem>
            ))
          )}
        </CarouselContent>
        <div className="hidden md:flex">
          <CarouselPrevious className="left-0" />
          <CarouselNext className="right-0" />
        </div>
      </Carousel>
    </div>
  );
};

export default TourCarousel;
