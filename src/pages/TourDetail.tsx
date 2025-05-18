import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTour, Tour } from '@/services/toursData';
import { useAuth } from '@/contexts/AuthContext';
import { useAudio } from '@/contexts/AudioContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  MapPin, Clock, Play, ListMusic, Download, Star, Info, 
  Image as ImageIcon, SkipForward, MessageSquareText, ChevronDown, ChevronUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Map from '@/components/Map';
import Navbar from '@/components/Navbar';
import AudioPlayer from '@/components/AudioPlayer';
import UpgradePrompt from '@/components/UpgradePrompt';
import { toast } from '@/hooks/use-toast';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const TourDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [tour, setTour] = useState<Tour | null>(null);
  const [loading, setLoading] = useState(true);
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [expandedDescription, setExpandedDescription] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showExpandedPlayer, setShowExpandedPlayer] = useState(false);
  const [isReviewSheetOpen, setIsReviewSheetOpen] = useState(false);
  
  const { isAuthenticated, user } = useAuth();
  const isPremium = user?.isPremium || false;
  const { 
    playAudio, 
    currentTrack, 
    isPlaying, 
    showMiniPlayer,
    isMiniPlayerActive,
    trackProgress, 
    tourProgress 
  } = useAudio();
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
  
  useEffect(() => {
    // Show mini player when navigating within the app while audio is playing
    if (currentTrack && isPlaying) {
      showMiniPlayer();
    }
  }, [currentTrack, isPlaying, showMiniPlayer]);
  
  // Check if the user can access this tour
  const canAccessTour = !tour?.isPremium || (isAuthenticated && isPremium);
  
  // Handle playing the main audio introduction
  const handlePlayIntro = () => {
    if (tour) {
      playAudio({
        id: `tour-intro-${tour.id}`,
        url: tour.audioUrl,
        title: `${tour.title} - Introduction`,
        tourId: tour.id,
        duration: tour.duration * 60,
        isPremium: tour.isPremium
      });
    }
  };
  
  // Handle playing a point of interest audio
  const handlePlayPointAudio = (pointId: string) => {
    if (tour) {
      const point = tour.points.find(p => p.id === pointId);
      if (point) {
        playAudio({
          id: `tour-point-${tour.id}-${pointId}`,
          url: point.audioUrl,
          title: point.title,
          tourId: tour.id,
          duration: point.duration * 60,
          isPremium: tour.isPremium
        });
      }
    }
  };
  
  // Handle downloading tour for offline access
  const handleDownloadTour = () => {
    if (!isAuthenticated) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to download tours',
        variant: 'destructive',
      });
      return;
    }
    
    if (!isPremium) {
      toast({
        title: 'Premium feature',
        description: 'Downloading tours requires a premium subscription',
        variant: 'destructive',
      });
      return;
    }
    
    setIsDownloading(true);
    
    // Simulate download progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsDownloading(false);
        
        toast({
          title: 'Download complete',
          description: `${tour?.title} is now available offline`,
        });
      }
    }, 500);
  };
  
  // Get the currently active point
  const activePoint = tour?.points.find(p => p.id === activePointId);
  
  // Calculate tour completion percentage based on tourProgress
  const calculateTourCompletion = () => {
    if (!tour || !tourProgress[tour.id]) return 0;
    
    const progress = tourProgress[tour.id];
    const completedSegments = progress.completedSegments.length;
    const totalSegments = tour.points.length + 1; // +1 for intro
    
    return Math.round((completedSegments / totalSegments) * 100);
  };
  
  // Check if a specific segment is completed
  const isSegmentCompleted = (segmentId: string) => {
    if (!tour || !tourProgress[tour.id]) return false;
    return tourProgress[tour.id].completedSegments.includes(segmentId);
  };
  
  // Mock data for tour gallery
  const tourGallery = [
    { id: 1, url: '/placeholder.svg', alt: 'Tour location 1' },
    { id: 2, url: '/placeholder.svg', alt: 'Tour location 2' },
    { id: 3, url: '/placeholder.svg', alt: 'Tour location 3' },
    { id: 4, url: '/placeholder.svg', alt: 'Tour location 4' },
  ];
  
  // Mock data for related tours
  const relatedTours = [
    { id: 'diriyah-main', title: 'Diriyah Historic District', imageUrl: '/placeholder.svg' },
    { id: 'al-ula', title: 'AlUla Ancient City', imageUrl: '/placeholder.svg' },
  ];
  
  // Mock reviews data
  const reviews = {
    average: 4.7,
    count: 42,
    distribution: [
      { rating: 5, percentage: 80 },
      { rating: 4, percentage: 15 },
      { rating: 3, percentage: 3 },
      { rating: 2, percentage: 1 },
      { rating: 1, percentage: 1 },
    ]
  };
  
  // Mock transcript data
  const mockTranscript = "Welcome to this audio tour of the historic site. As we begin our journey through this magnificent location, we'll explore its rich history dating back centuries. The architecture you see around you represents a blend of traditional design elements with practical considerations for the harsh desert climate. Notice the thick walls which helped keep interiors cool during hot summer days...";

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
  
  // Expanded audio player view
  if (showExpandedPlayer && currentTrack) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowExpandedPlayer(false)}
              className="mb-2"
            >
              <ChevronDown className="h-4 w-4 mr-1" /> Back to tour
            </Button>
            <h2 className="text-xl font-semibold">{currentTrack.title}</h2>
          </div>
          
          {/* Audio visualization */}
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="w-48 h-48 rounded-full bg-desert/10 flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-4 border-desert opacity-20"></div>
              <div 
                className="absolute inset-0 rounded-full border-4 border-desert border-t-transparent"
                style={{ 
                  transform: `rotate(${isPlaying ? 360 : 0}deg)`,
                  transition: isPlaying ? 'transform 10s linear infinite' : 'none'
                }}
              ></div>
              
              <div className="text-4xl text-desert">
                {isPlaying ? (
                  <div className="flex items-center space-x-1">
                    <div className="w-1 h-8 bg-desert animate-pulse-slow"></div>
                    <div className="w-1 h-12 bg-desert animate-pulse-medium"></div>
                    <div className="w-1 h-6 bg-desert animate-pulse-slow"></div>
                    <div className="w-1 h-10 bg-desert animate-pulse-medium"></div>
                  </div>
                ) : (
                  <Play className="h-16 w-16" />
                )}
              </div>
            </div>
          </div>
          
          {/* Transcript */}
          <div className="p-6 border-t bg-sand-light overflow-auto max-h-64">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-medium">Transcript</h3>
              <Button variant="ghost" size="sm">
                <MessageSquareText className="h-4 w-4 mr-1" />
                {isPremium ? 'Full transcript' : 'Preview only'}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {isPremium ? mockTranscript : mockTranscript.slice(0, 180) + '... [Premium content]'}
            </p>
            
            {!isPremium && (
              <div className="mt-4">
                <UpgradePrompt 
                  variant="subtle"
                  title="Access full transcripts"
                  buttonText="Upgrade for full access"
                />
              </div>
            )}
          </div>
          
          {/* Small spacer above audio player */}
          <div className="h-16"></div>
        </div>
        
        <AudioPlayer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pb-24">
        {/* Hero section */}
        <div className="relative h-[40vh] bg-desert-dark overflow-hidden">
          <img 
            src={tour.imageUrl} 
            alt={tour.title}
            className="w-full h-full object-cover object-center opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="container mx-auto">
              {/* Status badge */}
              {tourProgress[tour.id] && (
                <div className="inline-flex items-center bg-desert/70 text-white text-xs px-2 py-1 rounded mb-2">
                  <div className="w-3 h-3 bg-white rounded-full mr-1.5"></div>
                  {calculateTourCompletion()}% Complete
                </div>
              )}
              
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
                
                {/* Rating */}
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                  <span>{reviews.average}</span>
                  <span className="text-white/70 text-sm">({reviews.count})</span>
                </div>
                
                <div className="ml-auto flex space-x-2">
                  <Button 
                    onClick={handlePlayIntro}
                    size="sm" 
                    className="bg-gold text-night hover:bg-gold-light flex items-center space-x-2"
                  >
                    <Play className="h-4 w-4" />
                    <span>Play Tour</span>
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-white/30 text-white hover:bg-white/20"
                      >
                        <SkipForward className="h-4 w-4 mr-1" /> 
                        Quick Start
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {tour.points.map(point => (
                        <DropdownMenuItem 
                          key={point.id}
                          onClick={() => handlePlayPointAudio(point.id)}
                        >
                          {point.title}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tour content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Tour Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description section */}
              <section>
                <div className="prose max-w-none">
                  <p className={cn(
                    "text-lg transition-all duration-300", 
                    !expandedDescription && "line-clamp-3"
                  )}>
                    {tour.description}
                  </p>
                  
                  <p className={cn(
                    "arabic text-desert-dark transition-all duration-300", 
                    !expandedDescription && "line-clamp-2"
                  )}>
                    {tour.descriptionArabic}
                  </p>
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-1"
                    onClick={() => setExpandedDescription(!expandedDescription)}
                  >
                    {expandedDescription ? (
                      <>Show less <ChevronUp className="h-3 w-3 ml-1" /></>
                    ) : (
                      <>Read more <ChevronDown className="h-3 w-3 ml-1" /></>
                    )}
                  </Button>
                </div>
              </section>
              
              {/* Audio segments */}
              <section>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-desert-dark">Audio Tour Segments</h2>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handlePlayIntro}
                    className="text-desert border-desert hover:bg-desert/10"
                  >
                    <Play className="h-3 w-3 mr-1" /> Play All
                  </Button>
                </div>
                
                <div className="bg-white rounded-lg border">
                  {/* Introduction segment */}
                  <div 
                    className={cn(
                      "p-4 border-b flex items-start space-x-3 cursor-pointer hover:bg-sand-light/50 transition-colors",
                      isSegmentCompleted(`tour-intro-${tour.id}`) && "bg-sand-light/30"
                    )}
                    onClick={handlePlayIntro}
                  >
                    <div className="rounded-full bg-desert-dark/10 w-10 h-10 flex items-center justify-center flex-shrink-0">
                      <Info className="h-5 w-5 text-desert-dark" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">Introduction</h3>
                        <span className="text-sm text-muted-foreground">{tour.duration} min</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Overview and historical context of {tour.title}
                      </p>
                      
                      {isSegmentCompleted(`tour-intro-${tour.id}`) && (
                        <div className="flex items-center mt-2 text-xs text-desert">
                          <div className="w-2 h-2 bg-desert rounded-full mr-1"></div> Completed
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Points of interest */}
                  {tour.points.map((point, index) => (
                    <div 
                      key={point.id}
                      className={cn(
                        "p-4 border-b last:border-0 flex items-start space-x-3 cursor-pointer hover:bg-sand-light/50 transition-colors",
                        isSegmentCompleted(`tour-point-${tour.id}-${point.id}`) && "bg-sand-light/30"
                      )}
                      onClick={() => handlePlayPointAudio(point.id)}
                    >
                      <div className="rounded-full bg-desert/10 w-10 h-10 flex items-center justify-center flex-shrink-0">
                        <span className="text-desert font-medium">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="font-medium">{point.title}</h3>
                          <span className="text-sm text-muted-foreground">{point.duration} min</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {point.description}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 px-2 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowTranscript(true);
                              }}
                            >
                              <MessageSquareText className="h-3 w-3 mr-1" /> 
                              Transcript
                            </Button>
                          </div>
                          
                          {isSegmentCompleted(`tour-point-${tour.id}-${point.id}`) && (
                            <div className="flex items-center text-xs text-desert">
                              <div className="w-2 h-2 bg-desert rounded-full mr-1"></div> Completed
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Transcript dialog */}
                <Dialog open={showTranscript} onOpenChange={setShowTranscript}>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Audio Transcript</DialogTitle>
                    </DialogHeader>
                    <div className="max-h-[60vh] overflow-y-auto">
                      {isPremium ? (
                        <p className="text-sm leading-relaxed">{mockTranscript}</p>
                      ) : (
                        <>
                          <p className="text-sm leading-relaxed mb-6">{mockTranscript.slice(0, 200)}...</p>
                          <UpgradePrompt 
                            title="Access Full Transcripts" 
                            description="Upgrade to premium to access complete audio transcripts for all tours"
                          />
                        </>
                      )}
                    </div>
                  </DialogContent>
                </Dialog>
              </section>
              
              {/* Image gallery */}
              <section>
                <h2 className="text-xl font-semibold text-desert-dark mb-4">Gallery</h2>
                <Carousel className="w-full max-w-lg">
                  <CarouselContent>
                    {tourGallery.map((image) => (
                      <CarouselItem key={image.id}>
                        <div className="p-1 h-64">
                          <img 
                            src={image.url} 
                            alt={image.alt}
                            className="rounded-lg w-full h-full object-cover"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <div className="hidden sm:flex justify-end gap-2 mt-2">
                    <CarouselPrevious className="static translate-x-0 translate-y-0" />
                    <CarouselNext className="static translate-x-0 translate-y-0" />
                  </div>
                </Carousel>
              </section>
              
              {/* Related tours */}
              {relatedTours.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold text-desert-dark mb-4">Related Tours</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {relatedTours.map((relatedTour) => (
                      <div 
                        key={relatedTour.id}
                        className="rounded-lg border overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => navigate(`/tour/${relatedTour.id}`)}
                      >
                        <div className="h-32 bg-gray-200">
                          <img 
                            src={relatedTour.imageUrl} 
                            alt={relatedTour.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-3">
                          <h3 className="font-medium">{relatedTour.title}</h3>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
            
            {/* Right Column: Map and Actions */}
            <div>
              <div className="sticky top-20 space-y-6">
                {/* Map preview */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 text-desert-dark">Tour Map</h3>
                  <div className="rounded-lg overflow-hidden border">
                    <Map 
                      location={tour.location}
                      points={tour.points.map(point => point.location)}
                      className="h-80"
                    />
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="space-y-3">
                  {isPremium ? (
                    <Button 
                      className="w-full flex items-center justify-center space-x-2 bg-desert hover:bg-desert-dark"
                      disabled={isDownloading}
                      onClick={handleDownloadTour}
                    >
                      {isDownloading ? (
                        <>
                          <div className="animate-spin h-4 w-4 border-2 border-white/60 border-t-white rounded-full mr-2"></div>
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          <span>Download for Offline</span>
                        </>
                      )}
                    </Button>
                  ) : (
                    <UpgradePrompt 
                      title="Download for Offline Use"
                      description="Premium members can download tours to use without an internet connection"
                      buttonText="Upgrade to Download"
                      variant="default"
                    />
                  )}
                  
                  {/* Fixed: Wrap SheetTrigger in a Sheet component */}
                  <Sheet open={isReviewSheetOpen} onOpenChange={setIsReviewSheetOpen}>
                    <SheetTrigger asChild>
                      <Button
                        variant="outline" 
                        className="w-full flex items-center justify-center space-x-2"
                      >
                        <Star className="h-4 w-4" />
                        <span>Reviews & Ratings</span>
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="sm:max-w-md">
                      <SheetHeader>
                        <SheetTitle>Reviews & Ratings</SheetTitle>
                      </SheetHeader>
                      
                      <div className="mt-6 space-y-6">
                        {/* Rating summary */}
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <div className="text-4xl font-bold">{reviews.average}</div>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i}
                                  className={cn(
                                    "h-4 w-4", 
                                    i < Math.round(reviews.average) 
                                      ? "fill-gold text-gold" 
                                      : "text-gray-200"
                                  )}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-muted-foreground">{reviews.count} reviews</p>
                          </div>
                          
                          <div className="flex-1">
                            {reviews.distribution.map((item) => (
                              <div key={item.rating} className="flex items-center space-x-2 mb-1">
                                <div className="text-sm w-3">{item.rating}</div>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full">
                                  <div 
                                    className="h-full bg-gold rounded-full" 
                                    style={{ width: `${item.percentage}%` }}
                                  />
                                </div>
                                <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        {/* Review samples */}
                        <div className="space-y-4">
                          <div className="p-3 border rounded-lg">
                            <div className="flex justify-between mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={cn(
                                      "h-3 w-3", 
                                      i < 5 ? "fill-gold text-gold" : "text-gray-200"
                                    )}
                                  />
                                ))}
                              </div>
                              <div className="text-xs text-muted-foreground">2 days ago</div>
                            </div>
                            <h4 className="font-medium text-sm">Ahmed S.</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Excellent audio quality and fascinating historical insights. The narration brought the history to life.
                            </p>
                          </div>
                          
                          <div className="p-3 border rounded-lg">
                            <div className="flex justify-between mb-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={cn(
                                      "h-3 w-3", 
                                      i < 4 ? "fill-gold text-gold" : "text-gray-200"
                                    )}
                                  />
                                ))}
                              </div>
                              <div className="text-xs text-muted-foreground">1 week ago</div>
                            </div>
                            <h4 className="font-medium text-sm">Sarah M.</h4>
                            <p className="text-sm text-muted-foreground mt-1">
                              Very informative tour with great cultural context. The map integration was helpful to navigate between points.
                            </p>
                          </div>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                
                {/* Active point info */}
                {activePoint && (
                  <div className="bg-white rounded-lg border p-4 mt-6">
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
                
                {/* Audio playlist */}
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
      
      {/* Remove duplicate Reviews sheet - it's now properly included in the action buttons section */}
      {/* Audio player with expanded view functionality */}
      <div onClick={() => currentTrack && setShowExpandedPlayer(true)}>
        <AudioPlayer />
      </div>
    </div>
  );
};

export default TourDetail;
