
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Star, Download, Lock } from 'lucide-react';
import { Tour } from '@/services/toursData';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

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
  const navigate = useNavigate();
  const { isPremium, isAuthenticated } = useAuth();
  
  const handlePremiumTourClick = (e: React.MouseEvent) => {
    // If the tour is premium and user is not premium, intercept the click
    if (tour.isPremium && !isPremium) {
      e.preventDefault();
      
      if (!isAuthenticated) {
        toast({
          title: "Login required",
          description: "Please login to access premium tours",
        });
        navigate('/login', { state: { from: `/tour/${tour.id}` } });
      } else {
        toast({
          title: "Premium content",
          description: "This tour requires a premium subscription",
        });
        navigate('/subscription');
      }
    }
  };
  
  const cardLink = tour.isPremium && !isPremium 
    ? "#" // Use placeholder to enable intercepting the click
    : `/tour/${tour.id}`;

  return (
    <div className={cn(
      "bg-white rounded-lg overflow-hidden shadow-md transition-all hover:shadow-lg",
      featured ? "md:flex" : "",
      className
    )}>
      <Link 
        to={cardLink}
        className="block relative" 
        onClick={handlePremiumTourClick}
      >
        <div className={`relative ${featured ? 'md:w-full md:h-full' : 'h-52'}`}>
          <img 
            src={tour.imageUrl} 
            alt={tour.title} 
            className={`w-full object-cover ${featured ? 'md:h-full min-h-[200px]' : 'h-52'}`} 
          />
          
          {/* Premium overlay for non-premium users */}
          {tour.isPremium && !isPremium && (
            <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center p-4">
              <Lock className="h-8 w-8 text-white mb-2" />
              <p className="text-white text-center font-medium">Premium Content</p>
              <Button 
                size="sm" 
                className="mt-2 bg-gold hover:bg-gold-dark text-night"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/subscription');
                }}
              >
                Unlock
              </Button>
            </div>
          )}
          
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {tour.isPremium && (
              <Badge className="bg-gold hover:bg-gold-dark animate-fade-in">
                Premium
              </Badge>
            )}
            {isDownloaded && (
              <Badge className="bg-oasis hover:bg-oasis-dark animate-fade-in">
                <Download className="h-3 w-3 mr-1" /> Downloaded
              </Badge>
            )}
          </div>
        </div>
        
        <div className={`p-5 ${featured ? 'md:w-full' : ''}`}>
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
          
          {featured && tour.isPremium && !isPremium && !isDownloaded && (
            <div className="mt-4 pt-3 border-t border-muted">
              <Button 
                variant="outline" 
                size="sm"
                className="text-gold border-gold hover:bg-gold/10"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/subscription');
                }}
              >
                Upgrade to Premium
              </Button>
              <p className="text-xs text-muted-foreground mt-2">
                Unlock this tour with a premium subscription
              </p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default EnhancedTourCard;
