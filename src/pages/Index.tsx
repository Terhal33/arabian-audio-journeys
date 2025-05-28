
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeadphonesIcon, MapPin, Star, Play, Pause, Volume2 } from 'lucide-react';
import { getFeaturedTours } from '@/services/toursData';
import TourCard from '@/components/TourCard';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const [featuredTours, setFeaturedTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [heroAudioPlaying, setHeroAudioPlaying] = useState(false);
  const [heroAudio] = useState(() => {
    // Use a placeholder audio or disable if no file available
    const audio = new Audio();
    audio.volume = 0.3; // Lower volume for ambient sound
    return audio;
  });

  useEffect(() => {
    // Load featured tours
    try {
      const tours = getFeaturedTours();
      setFeaturedTours(tours);
    } catch (error) {
      console.error('Failed to load featured tours:', error);
      setFeaturedTours([]); // Fallback to empty array
    } finally {
      setIsLoading(false);
    }

    // Audio cleanup
    return () => {
      heroAudio.pause();
      heroAudio.currentTime = 0;
    };
  }, [heroAudio]);

  const toggleHeroAudio = () => {
    if (heroAudioPlaying) {
      heroAudio.pause();
    } else {
      // For now, just toggle the state since we don't have an actual audio file
      // In a real app, you would have: heroAudio.play().catch(console.error);
      console.log('Hero audio would play here');
    }
    setHeroAudioPlaying(!heroAudioPlaying);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Enhanced Hero Section */}
        <div className="relative bg-gradient-to-br from-desert-dark via-desert to-desert-light text-white overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gold/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-48 h-48 bg-oasis/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
          </div>
          
          <div className="absolute inset-0 bg-black/30"></div>
          
          <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4 mb-6">
                <h1 className="font-display text-4xl md:text-6xl font-bold leading-tight">
                  Discover Saudi Arabia Through
                  <span className="text-gold block">Sound</span>
                </h1>
                
                {/* Hero Audio Control */}
                <button
                  onClick={toggleHeroAudio}
                  className="flex-shrink-0 bg-gold/20 hover:bg-gold/30 transition-all duration-300 rounded-full p-4 backdrop-blur-sm border border-gold/30"
                  aria-label={heroAudioPlaying ? "Pause ambient audio" : "Play ambient audio"}
                >
                  {heroAudioPlaying ? (
                    <Pause className="h-6 w-6 text-gold" />
                  ) : (
                    <Volume2 className="h-6 w-6 text-gold" />
                  )}
                </button>
              </div>
              
              <p className="text-xl mb-8 text-sand-light leading-relaxed">
                Immersive audio tours that bring the Kingdom's rich history, culture, and hidden stories to life through expert narration and ambient soundscapes
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Button 
                  asChild 
                  size="lg"
                  className="bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-night font-semibold px-8 py-3 transform hover:scale-105 transition-all duration-200"
                >
                  <Link to="/tours">
                    <Play className="mr-2 h-5 w-5" />
                    Explore Tours
                  </Link>
                </Button>
                
                {!isAuthenticated && (
                  <Button 
                    asChild 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm px-8 py-3 font-semibold"
                  >
                    <Link to="/signup">Create Free Account</Link>
                  </Button>
                )}
              </div>
              
              {/* Quick stats */}
              <div className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-white/20">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold">50+</div>
                  <div className="text-sm text-sand-light">Audio Tours</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold">13</div>
                  <div className="text-sm text-sand-light">Regions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gold">100+</div>
                  <div className="text-sm text-sand-light">Hours of Content</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Featured Tours */}
        <section className="py-16 bg-gradient-to-b from-sand-light to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl font-bold mb-4 text-desert-dark">
                Featured Audio Journeys
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Start your exploration with these carefully curated tours showcasing Saudi Arabia's most captivating stories
              </p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : featuredTours.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {featuredTours.map(tour => (
                  <TourCard 
                    key={tour.id} 
                    tour={tour} 
                    featured 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No featured tours available at the moment.</p>
                <Button asChild variant="outline">
                  <Link to="/tours">Browse All Tours</Link>
                </Button>
              </div>
            )}
            
            <div className="text-center">
              <Button 
                asChild 
                variant="outline" 
                size="lg"
                className="border-2 border-desert text-desert hover:bg-desert hover:text-white transition-all duration-300"
              >
                <Link to="/tours">Discover All Tours</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Enhanced How It Works */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl font-bold mb-4 text-desert-dark">
                Your Audio Journey Awaits
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience Saudi Arabia like never before with our immersive audio storytelling platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              <div className="group flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300">
                <div className="relative h-20 w-20 bg-gradient-to-br from-oasis to-oasis-dark rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <HeadphonesIcon className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">1</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-desert-dark">Listen & Learn</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Immerse yourself in expert narrations, ambient sounds, and cultural insights that bring the Kingdom's rich heritage to life
                </p>
              </div>
              
              <div className="group flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300">
                <div className="relative h-20 w-20 bg-gradient-to-br from-desert to-desert-dark rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <MapPin className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-gold rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">2</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-desert-dark">Explore Interactive Maps</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Follow guided routes through Saudi Arabia's most fascinating locations with GPS-enabled maps and location-based audio triggers
                </p>
              </div>
              
              <div className="group flex flex-col items-center text-center transform hover:scale-105 transition-all duration-300">
                <div className="relative h-20 w-20 bg-gradient-to-br from-gold to-gold-dark rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl transition-all duration-300">
                  <Star className="h-10 w-10 text-white" />
                  <div className="absolute -top-2 -right-2 h-6 w-6 bg-oasis rounded-full flex items-center justify-center">
                    <span className="text-xs font-bold text-white">3</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-desert-dark">Unlock Premium Content</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Access exclusive behind-the-scenes stories, extended narratives, and special cultural insights from local experts
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-16 bg-gradient-to-r from-oasis via-oasis-dark to-desert text-white relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
          
          <div className="container mx-auto px-4 text-center relative z-10">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
              Ready to Experience Saudi Arabia's
              <span className="text-gold block">Rich Heritage?</span>
            </h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto leading-relaxed opacity-90">
              Join thousands of explorers discovering the Kingdom's untold stories. Start with our free tours or unlock premium content for deeper cultural immersion.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                asChild 
                size="lg"
                className="bg-white text-oasis-dark hover:bg-sand-light font-bold px-8 py-4 transform hover:scale-105 transition-all duration-200"
              >
                <Link to={isAuthenticated ? "/tours" : "/signup"}>
                  <Play className="mr-2 h-5 w-5" />
                  {isAuthenticated ? "Start Exploring" : "Join Free Today"}
                </Link>
              </Button>
              
              <Button 
                asChild 
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/20 backdrop-blur-sm px-8 py-4 font-semibold"
              >
                <Link to="/subscription">
                  <Star className="mr-2 h-5 w-5" />
                  Explore Premium
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Enhanced Footer */}
        <footer className="bg-gradient-to-b from-night to-black text-white py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              <div className="md:col-span-2">
                <h3 className="font-display text-2xl font-bold mb-2">
                  Arabian<span className="text-gold">Audio</span>
                </h3>
                <p className="text-white/70 mb-4 leading-relaxed">
                  Immersive audio journeys through Saudi Arabia's rich cultural heritage, 
                  bringing history and stories to life through expert narration and ambient soundscapes.
                </p>
                <div className="flex space-x-4">
                  {/* Social media links would go here */}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Quick Links</h4>
                <div className="space-y-2">
                  <Link to="/tours" className="block text-white/70 hover:text-white transition-colors">All Tours</Link>
                  <Link to="/subscription" className="block text-white/70 hover:text-white transition-colors">Premium</Link>
                  <Link to="/settings" className="block text-white/70 hover:text-white transition-colors">Settings</Link>
                  <Link to="/profile" className="block text-white/70 hover:text-white transition-colors">Profile</Link>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Support</h4>
                <div className="space-y-2">
                  <a href="#" className="block text-white/70 hover:text-white transition-colors">Help Center</a>
                  <a href="#" className="block text-white/70 hover:text-white transition-colors">Terms of Service</a>
                  <a href="#" className="block text-white/70 hover:text-white transition-colors">Privacy Policy</a>
                  <a href="#" className="block text-white/70 hover:text-white transition-colors">Accessibility</a>
                </div>
              </div>
            </div>
            
            <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
              <p className="text-white/50 text-sm">
                © {new Date().getFullYear()} Arabian Audio Journeys. All rights reserved.
              </p>
              <p className="text-white/50 text-sm mt-2 md:mt-0">
                Made with ❤️ for Saudi Arabia's cultural heritage
              </p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
