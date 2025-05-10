import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTour, Tour } from '@/services/toursData';
import { useAuth } from '@/contexts/AuthContext';
import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MapPin, Clock, Play, ListMusic } from 'lucide-react';
import Map from '@/components/Map';
import Navbar from '@/components/Navbar';
import AudioPlayer from '@/components/AudioPlayer';

const TourDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePointId, setActivePointId] = useState<string | null>(null);
  
  const { isAuthenticated, user } = useAuth();
  const isPremium = user?.isPremium || false;
  const { playAudio } = useAudio();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (id) {
      const tourData = getTour(id);
      
      if (tourData) {
        setTour(tourData);
        if (tourData.points.length > 0) {
          setActivePointId(tourData.points[0].id);
        }
      }
      
      setLoading(false);
    }
  }, [id]);
  
  // Check if the user can access this tour
  const canAccessTour = !tour?.isPremium || (isAuthenticated && isPremium);
  
  // Handle playing the main audio introduction
  const handlePlayIntro = () => {
    if (tour) {
      playAudio(tour.audioUrl, `${tour.title} - Introduction`);
    }
  };
  
  // Handle playing a point of interest audio
  const handlePlayPointAudio = (pointId: string) => {
    if (tour) {
      const point = tour.points.find(p => p.id === pointId);
      if (point) {
        playAudio(point.audioUrl, point.title);
      }
    }
  };
  
  // Get the currently active point
  const activePoint = tour?.points.find(p => p.id === activePointId);
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex space-x-2">
            <div className="h-3 w-3 bg-oasis rounded-full"></div>
            <div className="h-3 w-3 bg-oasis rounded-full"></div>
            <div className="h-3 w-3 bg-oasis rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }
  
  if (!tour) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-display font-bold text-desert-dark mb-2">Tour Not Found</h2>
            <p className="text-muted-foreground mb-6">The tour you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/tours')}>
              Return to Tours
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  if (!canAccessTour) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-10 bg-sand-light">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto text-center">
              <h1 className="font-display text-3xl font-bold mb-4 text-desert-dark">{tour.title}</h1>
              <p className="arabic text-desert-dark mb-6">{tour.titleArabic}</p>
              
              <div className="mb-6 p-4 bg-gold/10 rounded-lg">
                <h2 className="font-semibold text-lg mb-2 text-gold-dark">Premium Content</h2>
                <p className="text-muted-foreground mb-4">
                  This tour is available exclusively to premium subscribers.
                </p>
                
                {!isAuthenticated ? (
                  <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
                    <Button asChild variant="outline" className="border-oasis text-oasis hover:bg-oasis/10">
                      <a href="/login">Sign In</a>
                    </Button>
                    <Button asChild className="bg-desert hover:bg-desert-dark">
                      <a href="/signup">Create Account</a>
                    </Button>
                  </div>
                ) : (
                  <Button className="bg-gold hover:bg-gold-dark text-night">
                    Upgrade to Premium
                  </Button>
                )}
              </div>
              
              <Button onClick={() => navigate('/tours')} variant="ghost">
                Browse Other Tours
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Tour Header */}
        <div className="relative h-64 md:h-80 bg-desert-dark overflow-hidden">
          <img 
            src={tour.imageUrl} 
            alt={tour.title}
            className="w-full h-full object-cover object-center opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container mx-auto">
              <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">{tour.title}</h1>
              <p className="arabic text-xl mb-4">{tour.titleArabic}</p>
              
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{tour.duration} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{tour.distance} km</span>
                </div>
                <Button 
                  onClick={handlePlayIntro}
                  size="sm" 
                  className="bg-gold text-night hover:bg-gold-light flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Play Introduction</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tour Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Tour Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="about" className="w-full">
                <TabsList>
                  <TabsTrigger value="about">About</TabsTrigger>
                  <TabsTrigger value="points">Points of Interest</TabsTrigger>
                  <TabsTrigger value="directions">Directions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="about" className="space-y-6 pt-4">
                  <div className="prose max-w-none">
                    <p className="text-lg">{tour.description}</p>
                    <p className="arabic text-desert-dark">{tour.descriptionArabic}</p>
                    
                    <h3 className="mt-6 text-xl font-semibold text-desert-dark">What You'll Experience</h3>
                    <p>Immerse yourself in the rich history and cultural heritage of this iconic location through expert narrations and ambient sounds that bring the past to life.</p>
                    
                    <h3 className="mt-6 text-xl font-semibold text-desert-dark">How to Use This Tour</h3>
                    <ol>
                      <li>Play the introduction for an overview of the site.</li>
                      <li>Explore the map and navigate to each point of interest.</li>
                      <li>At each location, play the corresponding audio track.</li>
                      <li>Take your time to observe the surroundings as you listen.</li>
                    </ol>
                  </div>
                </TabsContent>
                
                <TabsContent value="points" className="space-y-4 pt-4">
                  <p className="mb-4 text-muted-foreground">
                    Click on a point to play its audio narration or view it on the map.
                  </p>
                  
                  <div className="space-y-3">
                    {tour.points.map((point) => (
                      <div 
                        key={point.id}
                        className={`p-4 rounded-lg cursor-pointer transition-colors ${
                          activePointId === point.id ? 'bg-oasis/10 border border-oasis/30' : 'bg-white border hover:bg-muted'
                        }`}
                        onClick={() => setActivePointId(point.id)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{point.title}</h3>
                          <span className="text-xs text-muted-foreground">{point.duration} min</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{point.description}</p>
                        <div className="mt-3 flex justify-end">
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePlayPointAudio(point.id);
                            }}
                          >
                            <Play className="h-3 w-3 mr-1" />
                            Play Audio
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="directions" className="space-y-4 pt-4">
                  <p className="mb-4 text-muted-foreground">
                    How to get to {tour.title} and navigate between the points of interest.
                  </p>
                  
                  <div className="prose max-w-none">
                    <h3 className="mt-4 text-xl font-semibold text-desert-dark">Getting There</h3>
                    <p>The tour start point is located at the main entrance. You can reach it by:</p>
                    <ul>
                      <li>Car: Parking available at the visitor center</li>
                      <li>Public transportation: Buses stop at the main entrance</li>
                      <li>Taxi: Drop-off point at the visitor center</li>
                    </ul>
                    
                    <h3 className="mt-6 text-xl font-semibold text-desert-dark">Accessibility</h3>
                    <p>Most areas of this tour are accessible via paved paths. Some historical sections may have uneven terrain.</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            
            {/* Right Column: Map */}
            <div>
              <div className="sticky top-20">
                <h3 className="text-xl font-semibold mb-3 text-desert-dark">Tour Map</h3>
                <Map 
                  location={tour.location}
                  points={tour.points.map(point => point.location)}
                  className="h-80 mb-4"
                />
                
                {activePoint && (
                  <div className="bg-white rounded-lg border p-4">
                    <h3 className="font-semibold text-desert-dark mb-1">{activePoint.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{activePoint.description}</p>
                    <Button 
                      onClick={() => handlePlayPointAudio(activePoint.id)}
                      className="w-full flex items-center justify-center bg-oasis hover:bg-oasis-dark"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Play Audio
                    </Button>
                  </div>
                )}
                
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-3 text-desert-dark">Audio Playlist</h3>
                  <div className="bg-white rounded-lg border">
                    <div 
                      className="p-3 border-b flex items-center space-x-2 cursor-pointer hover:bg-sand-light"
                      onClick={handlePlayIntro}
                    >
                      <ListMusic className="h-4 w-4 text-desert-dark" />
                      <div>
                        <p className="font-medium text-sm">Introduction</p>
                        <p className="text-xs text-muted-foreground">{tour.duration} min</p>
                      </div>
                      <Play className="h-4 w-4 ml-auto text-desert-dark" />
                    </div>
                    
                    {tour.points.map((point, index) => (
                      <div 
                        key={point.id}
                        className="p-3 border-b flex items-center space-x-2 cursor-pointer hover:bg-sand-light last:border-0"
                        onClick={() => handlePlayPointAudio(point.id)}
                      >
                        <span className="text-sm font-medium text-muted-foreground">{index + 1}</span>
                        <div>
                          <p className="font-medium text-sm">{point.title}</p>
                          <p className="text-xs text-muted-foreground">{point.duration} min</p>
                        </div>
                        <Play className="h-4 w-4 ml-auto text-desert-dark" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <AudioPlayer />
    </div>
  );
};

export default TourDetail;
