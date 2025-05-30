
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAppState } from '@/contexts/AppStateContext';

interface Tour {
  id: string;
  title: string;
  region: string;
  duration: number;
  description: string;
  image_url: string;
  published: boolean;
}

const ToursPage: React.FC = () => {
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showMessage } = useAppState();

  useEffect(() => {
    fetchTours();
  }, []);

  const fetchTours = async () => {
    try {
      const { data, error } = await supabase
        .from('tours')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching tours:', error);
        showMessage('Failed to load tours', 'error');
        return;
      }

      setTours(data || []);
    } catch (error) {
      console.error('Error fetching tours:', error);
      showMessage('Failed to load tours', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-desert border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading tours...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-light py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-display font-bold text-desert-dark mb-4">
            Audio Tours
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover Saudi Arabia's rich heritage through immersive audio experiences
          </p>
        </div>

        {tours.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-2xl font-semibold text-desert-dark mb-4">No tours available</h3>
            <p className="text-muted-foreground">Check back soon for new audio tours!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((tour) => (
              <Card key={tour.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-gradient-to-br from-desert-light to-gold-light relative">
                  {tour.image_url && tour.image_url !== '/placeholder.svg' ? (
                    <img 
                      src={tour.image_url} 
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <MapPin className="h-12 w-12 text-desert opacity-50" />
                    </div>
                  )}
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{tour.title}</CardTitle>
                  <CardDescription className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {tour.region}
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
                    Listen Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ToursPage;
