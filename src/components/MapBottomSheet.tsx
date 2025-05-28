
import React, { useState } from 'react';
import { X, Navigation, Clock, MapPin, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tour } from '@/services/toursData';
import { Card } from '@/components/ui/card';
import AudioPlayer from '@/components/AudioPlayer';
import UpgradePrompt from '@/components/UpgradePrompt';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';

interface MapBottomSheetProps {
  tour: Tour;
  onClose: () => void;
}

const MapBottomSheet: React.FC<MapBottomSheetProps> = ({ tour, onClose }) => {
  const [expanded, setExpanded] = useState(false);
  
  const handleNavigate = () => {
    // In a real app, this would open maps with directions
    console.log('Navigate to:', tour.title);
    
    // Simulate opening maps app
    if (tour.location) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${tour.location.lat},${tour.location.lng}`;
      window.open(mapsUrl, '_blank');
    }
  };
  
  // Create tracks array for AudioPlayer
  const audioTracks = tour.audioUrl ? [{
    id: `tour-${tour.id}`,
    title: tour.title,
    description: tour.description,
    url: tour.audioUrl,
    duration: tour.duration * 60,
    thumbnail: tour.imageUrl
  }] : [];
  
  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg z-30 transition-all duration-300 transform ${expanded ? 'h-[70vh]' : 'h-auto'}`}>
      <div className="p-4">
        {/* Handle for drag */}
        <div className="w-12 h-1 bg-gray-300 rounded mx-auto mb-3" 
          onClick={() => setExpanded(!expanded)}></div>
        
        {/* Close button */}
        <button 
          onClick={onClose} 
          className="absolute right-4 top-4 p-1 rounded-full hover:bg-gray-100"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
        
        {/* Tour info */}
        <div className="flex items-start mb-4">
          <div className="h-16 w-16 bg-gray-200 rounded-lg overflow-hidden mr-3">
            {tour.imageUrl ? (
              <img 
                src={tour.imageUrl} 
                alt={tour.title} 
                className="h-full w-full object-cover" 
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-oasis-light">
                <MapPin className="h-6 w-6 text-oasis" />
              </div>
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-display text-lg font-medium">
              {tour.title}
              {tour.isPremium && (
                <span className="ml-1 text-gold text-sm">✦</span>
              )}
            </h3>
            
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>Saudi Arabia</span>
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mt-0.5">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>{tour.duration} min tour</span>
              <span className="mx-2">•</span>
              <span>{tour.distance} km</span>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex space-x-3 mb-4">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={handleNavigate}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Directions
          </Button>
          
          <Button 
            className="flex-1 bg-desert hover:bg-desert-dark"
            onClick={() => window.location.href = `/tour/${tour.id}`}
          >
            {tour.isPremium ? (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Preview Tour
              </>
            ) : (
              <>Start Tour</>
            )}
          </Button>
        </div>
        
        {/* Audio preview */}
        {tour.audioUrl && audioTracks.length > 0 && (
          <Card className="mb-4 p-3 bg-muted/50">
            <p className="text-sm font-medium mb-2">Tour Preview</p>
            <Dialog>
              <DialogTrigger asChild>
                <div>
                  <AudioPlayer 
                    tracks={audioTracks}
                    showPlaylist={false}
                    className="compact"
                  />
                </div>
              </DialogTrigger>
              {/* The Dialog content is rendered by the AudioPlayer component */}
            </Dialog>
          </Card>
        )}
        
        {/* Description */}
        <p className="text-sm text-muted-foreground mb-4">
          {expanded ? tour.description : `${tour.description.substring(0, 120)}...`}
        </p>
        
        {/* Premium content note */}
        {tour.isPremium && (
          <UpgradePrompt 
            variant="banner" 
            title="Unlock Premium Tour" 
            buttonText="Upgrade"
          />
        )}
        
        {/* Expand button if not expanded */}
        {!expanded && tour.points.length > 0 && (
          <Button 
            variant="ghost" 
            className="w-full text-desert" 
            onClick={() => setExpanded(true)}
          >
            Show tour points ({tour.points.length})
          </Button>
        )}
        
        {/* Points on expanded view */}
        {expanded && tour.points.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Tour Points</h4>
            <div className="space-y-3">
              {tour.points.map((point, index) => (
                <div key={point.id} className="flex items-start p-3 bg-muted/30 rounded-lg">
                  <div className="bg-desert-dark text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-medium mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{point.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{point.duration} min</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapBottomSheet;
