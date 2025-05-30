
import { useAppState } from '@/contexts/AppStateContext';
import { Clock, MapPin } from 'lucide-react';
import { Tour } from '@/services/toursData';
import { Badge } from '@/components/ui/badge';

interface TourCardProps {
  tour: Tour;
  featured?: boolean;
}

const TourCard = ({ tour, featured = false }: TourCardProps) => {
  const { navigateTo } = useAppState();

  const handleClick = () => {
    navigateTo(`tour/${tour.id}`);
  };

  return (
    <div 
      onClick={handleClick}
      className="block transition-transform hover:scale-[1.02] cursor-pointer"
    >
      <div className={`bg-white rounded-lg overflow-hidden shadow-md card-hover ${featured ? 'md:flex' : ''}`}>
        <div className={`relative ${featured ? 'md:w-2/5' : 'h-52'}`}>
          <img 
            src={tour.imageUrl} 
            alt={tour.title} 
            className={`w-full object-cover ${featured ? 'h-full' : 'h-52'}`} 
          />
          {tour.isPremium && (
            <Badge className="absolute top-3 right-3 bg-gold hover:bg-gold-dark">
              Premium
            </Badge>
          )}
        </div>
        
        <div className={`p-5 ${featured ? 'md:w-3/5' : ''}`}>
          <h3 className="font-display text-xl font-semibold mb-2 text-desert-dark">{tour.title}</h3>
          <p className="arabic text-sm mb-3 text-desert">
            {tour.titleArabic}
          </p>
          
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
    </div>
  );
};

export default TourCard;
