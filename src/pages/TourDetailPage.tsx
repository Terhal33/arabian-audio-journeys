
import React, { useState, useEffect } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { getTour, Tour } from '@/services/toursData';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Pause, MapPin, Clock, Navigation, Star, Lock } from 'lucide-react';
import AudioPlayer from '@/components/AudioPlayer';
import UpgradePrompt from '@/components/UpgradePrompt';
import { useAuth } from '@/contexts/auth/AuthProvider';

interface TourDetailPageProps {
  tourId: string | null;
}

const TourDetailPage: React.FC<TourDetailPageProps> = ({ tourId }) => {
  const [tour, setTour] = useState<Tour | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const { navigateTo } = useAppState();
  const { isPremium } = useAuth();

  useEffect(() => {
    if (tourId) {
      const tourData = getTour(tourId);
      setTour(tourData || null);
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [tourId]);

  const handleGetDirections = () => {
    if (tour?.location) {
      const { lat, lng } = tour.location;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      window.open(url, '_blank');
    }
  };

  const handlePlayTour = () => {
    if (tour?.isPremium && !isPremium) {
      // Show upgrade prompt for premium tours
      return;
    }
    setIsPlaying(!isPlaying);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-light flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-desert border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-muted-foreground">Loading tour...</p>
        </div>
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="min-h-screen bg-sand-light flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-desert-dark mb-4">Tour Not Found</h2>
          <p className="text-muted-foreground mb-6">The tour you're looking for doesn't exist.</p>
          <Button onClick={() => navigateTo('tours')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tours
          </Button>
        </div>
      </div>
    );
  }

  const audioTracks = tour.audioUrl ? [{
    id: `tour-${tour.id}`,
    title: tour.title,
    description: tour.description,
    url: tour.audioUrl,
    duration: tour.duration * 60,
    thumbnail: tour.imageUrl
  }] : [];

  return (
    <div className="min-h-screen bg-sand-light">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => navigateTo('tours')}
            className="mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tours
          </Button>
        </div>
      </div>

      {/* Hero Image */}
      <div className="relative h-64 md:h-96">
        <img
          src={tour.imageUrl}
          alt={tour.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        
        {/* Tour badges */}
        <div className="absolute top-4 left-4 flex gap-2">
          {tour.isPremium && (
            <Badge className="bg-gold hover:bg-gold-dark">
              Premium
            </Badge>
          )}
        </div>

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="lg"
            onClick={handlePlayTour}
            className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border-2 border-white/50"
            disabled={tour.isPremium && !isPremium}
          >
            {tour.isPremium && !isPremium ? (
              <Lock className="h-6 w-6 mr-2" />
            ) : isPlaying ? (
              <Pause className="h-6 w-6 mr-2" />
            ) : (
              <Play className="h-6 w-6 mr-2" />
            )}
            {tour.isPremium && !isPremium ? 'Premium Required' : isPlaying ? 'Pause Tour' : 'Start Tour'}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="font-display text-3xl md:text-4xl font-bold text-desert-dark mb-2">
                {tour.title}
              </h1>
              <p className="arabic text-lg text-desert mb-4">
                {tour.titleArabic}
              </p>
              
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{tour.duration} minutes</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{tour.distance} km</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">About This Tour</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {tour.description}
              </p>
              <p className="arabic text-muted-foreground leading-relaxed">
                {tour.descriptionArabic}
              </p>
            </Card>

            {/* Audio Player */}
            {tour.audioUrl && audioTracks.length > 0 && (
              <Card className="p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Audio Tour</h2>
                <AudioPlayer 
                  tracks={audioTracks}
                  showPlaylist={false}
                  className="w-full"
                />
              </Card>
            )}

            {/* Tour Points */}
            {tour.points && tour.points.length > 0 && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Tour Highlights</h2>
                <div className="space-y-4">
                  {tour.points.map((point, index) => (
                    <div key={point.id} className="flex gap-4 p-4 bg-sand-light rounded-lg">
                      <div className="bg-desert text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-desert-dark mb-2">{point.title}</h3>
                        <p className="text-muted-foreground text-sm mb-2">{point.description}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>{point.duration} minutes</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Action Buttons */}
            <Card className="p-6 mb-6">
              <div className="space-y-3">
                <Button
                  onClick={handlePlayTour}
                  className="w-full bg-desert hover:bg-desert-dark"
                  disabled={tour.isPremium && !isPremium}
                >
                  {tour.isPremium && !isPremium ? (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Upgrade Required
                    </>
                  ) : isPlaying ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause Tour
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Start Tour
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleGetDirections}
                  className="w-full"
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Get Directions
                </Button>
              </div>
            </Card>

            {/* Premium Upgrade */}
            {tour.isPremium && !isPremium && (
              <UpgradePrompt
                title="Unlock This Premium Tour"
                description="Get access to this exclusive tour and many more with our premium subscription."
                buttonText="Upgrade Now"
              />
            )}

            {/* Tour Info */}
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Tour Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span>{tour.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Distance:</span>
                  <span>{tour.distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{tour.isPremium ? 'Premium' : 'Free'}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TourDetailPage;
