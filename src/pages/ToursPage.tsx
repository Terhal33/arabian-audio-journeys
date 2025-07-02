
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Play } from 'lucide-react';
import { tours } from '@/services/toursData';

const ToursPage: React.FC = () => {
  const navigate = useNavigate();

  const handleTourClick = (tourId: string) => {
    navigate(`/tour/${tourId}`);
  };

  return (
    <div className="min-h-screen bg-sand-light py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-desert-dark mb-4">
            UNESCO World Heritage Audio Tours
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover Saudi Arabia's UNESCO World Heritage Sites through immersive audio experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleTourClick(tour.id)}>
              <div className="aspect-video bg-gradient-to-br from-desert-light to-gold-light relative">
                <img 
                  src={tour.imageUrl} 
                  alt={tour.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle className="text-xl">{tour.title}</CardTitle>
                <p className="text-sm text-muted-foreground arabic mb-2">{tour.titleArabic}</p>
                <CardDescription className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {tour.distance} km
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {tour.duration} min
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-3">
                  {tour.description}
                </p>
                <Button className="w-full bg-oasis hover:bg-oasis-dark">
                  <Play className="mr-2 h-4 w-4" />
                  Start Tour
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToursPage;
