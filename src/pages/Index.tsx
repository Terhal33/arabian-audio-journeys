
import React, { useState, useEffect } from 'react';
import { useAppState } from '@/contexts/AppStateContext';
import { Button } from '@/components/ui/button';
import { HeadphonesIcon, MapPin, Star, Play, Clock, Heart } from 'lucide-react';
import { tours } from '@/services/toursData';
import { useAuth } from '@/contexts/auth/AuthProvider';
import TourCard from '@/components/TourCard';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const { navigateTo } = useAppState();
  const [featuredTours, setFeaturedTours] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load the first 3 UNESCO heritage tours as featured
    console.log('Loading tours data:', tours);
    setIsLoading(true);
    try {
      const featured = tours.slice(0, 3);
      console.log('Featured tours set:', featured);
      setFeaturedTours(featured);
    } catch (error) {
      console.error('Failed to load tours:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-desert-light to-sand-light">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-desert-dark mb-6">
            Discover Saudi Arabia's UNESCO Heritage Through Sound
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Immerse yourself in the rich history and culture of Saudi Arabia's UNESCO World Heritage Sites with our expertly crafted audio tours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-desert hover:bg-desert-dark text-white"
              onClick={() => navigateTo('tours')}
            >
              <HeadphonesIcon className="mr-2 h-5 w-5" />
              Explore UNESCO Tours
            </Button>
            {!isAuthenticated && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigateTo('signup')}
              >
                Create Free Account
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Featured UNESCO Tours Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-4 text-desert-dark">
            UNESCO World Heritage Audio Tours
          </h2>
          <p className="text-lg text-muted-foreground text-center mb-12 max-w-2xl mx-auto">
            Explore Saudi Arabia's UNESCO World Heritage Sites through immersive audio experiences
          </p>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredTours.map((tour) => (
                <TourCard key={tour.id} tour={tour} featured />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="bg-oasis hover:bg-oasis-dark text-white"
              onClick={() => navigateTo('tours')}
            >
              View All {tours.length} UNESCO Sites
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-sand-light">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-desert-dark">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-oasis rounded-full flex items-center justify-center mx-auto mb-4">
                <HeadphonesIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Listen & Learn</h3>
              <p className="text-muted-foreground">
                Experience immersive audio narrations that bring Saudi Arabia's UNESCO heritage to life.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-desert rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Explore Heritage Sites</h3>
              <p className="text-muted-foreground">
                Navigate through UNESCO World Heritage Sites with location-aware audio guides.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Discover Stories</h3>
              <p className="text-muted-foreground">
                Uncover the rich history and cultural significance of each heritage site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6 text-desert-dark">
            Ready to Explore Saudi Arabia's Heritage?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start your journey through Saudi Arabia's UNESCO World Heritage Sites today.
          </p>
          <Button 
            size="lg" 
            className="bg-desert hover:bg-desert-dark text-white"
            onClick={() => {
              if (isAuthenticated) {
                navigateTo('tours');
              } else {
                navigateTo('signup');
              }
            }}
          >
            {isAuthenticated ? 'Start Exploring' : 'Join Free Today'}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-desert-dark text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-display font-semibold text-lg mb-4">
                Arabian<span className="text-gold">Audio</span>
              </h3>
              <p className="text-desert-light">
                Discover Saudi Arabia's UNESCO heritage through immersive audio experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Explore</h4>
              <ul className="space-y-2 text-desert-light">
                <li>
                  <button 
                    onClick={() => navigateTo('tours')}
                    className="hover:text-white transition-colors"
                  >
                    UNESCO Tours
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-desert-light">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-desert-light">
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-desert mt-8 pt-8 text-center text-desert-light">
            <p>&copy; 2024 ArabianAudio. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
