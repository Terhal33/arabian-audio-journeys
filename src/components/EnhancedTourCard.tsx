
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, Star, Download } from 'lucide-react';
import { Tour } from '@/services/toursData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface EnhancedTourCardProps {
  tour: Tour;
  isDownloaded?: boolean;
  rating?: number;
  featured?: boolean;
  className?: string;
}

const EnhancedTourCard = ({ 
  tour, 
  isDownloaded = false,
  rating = Math.floor(Math.random() * 5) + 1, // Random rating for demo
  featured = false,
  className 
}: EnhancedTourCardProps) => {
  return (
    <Link to={`/tour/${tour.id}`} className="block">
      <div className={cn(
        "bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg",
        featured ? "md:flex" : "",
        className
      )}>
        <div className={`relative ${featured ? 'md:w-2/5' : 'h-52'}`}>
          <img 
            src={tour.imageUrl} 
            alt={tour.title} 
            className={`w-full object-cover ${featured ? 'h-full' : 'h-52'}`} 
          />
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {tour.isPremium && (
              <Badge className="bg-gold hover:bg-gold-dark">
                Premium
              </Badge>
            )}
            {isDownloaded && (
              <Badge className="bg-oasis hover:bg-oasis-dark">
                <Download className="h-3 w-3 mr-1" /> Downloaded
              </Badge>
            )}
          </div>
        </div>
        
        <div className={`p-5 ${featured ? 'md:w-3/5' : ''}`}>
          <h3 className="font-display text-xl font-semibold mb-2 text-desert-dark">{tour.title}</h3>
          <p className="arabic text-sm mb-2 text-desert">
            {tour.titleArabic}
          </p>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={cn(
                    "h-4 w-4", 
                    star <= rating ? "text-gold fill-gold" : "text-muted-foreground"
                  )}
                />
              ))}
            </div>
            <span className="text-xs ml-2 text-muted-foreground">({Math.floor(Math.random() * 100) + 5})</span>
          </div>
          
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {tour.description}
          </p>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{tour.duration} min</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="h-4 w-4" />
              <span>{tour.distance} km</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default EnhancedTourCard;
