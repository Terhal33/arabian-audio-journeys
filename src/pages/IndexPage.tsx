
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, MapPin, Headphones } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useAppState } from '@/contexts/AppStateContext';

const IndexPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { navigateTo } = useAppState();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-desert-light to-sand-light">
        <div className="container mx-auto text-center max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-display font-bold text-desert-dark mb-6">
            Discover Saudi Arabia Through Sound
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Immerse yourself in the rich history and culture of Saudi Arabia with our expertly crafted audio tours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-desert hover:bg-desert-dark text-white"
              onClick={() => navigateTo('tours')}
            >
              <Headphones className="mr-2 h-5 w-5" />
              Explore Tours
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

      {/* Featured Tours Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-desert-dark">
            Featured Audio Tours
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Sample tour cards */}
            {[
              {
                title: "Historic Riyadh Discovery",
                region: "Riyadh",
                duration: "45 min",
                image: "/placeholder.svg"
              },
              {
                title: "Jeddah Old Town Heritage",
                region: "Jeddah", 
                duration: "60 min",
                image: "/placeholder.svg"
              },
              {
                title: "AlUla Archaeological Wonders",
                region: "AlUla",
                duration: "90 min",
                image: "/placeholder.svg"
              }
            ].map((tour, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img 
                  src={tour.image} 
                  alt={tour.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-2">{tour.title}</h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-4">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{tour.region}</span>
                    <span className="mx-2">•</span>
                    <span>{tour.duration}</span>
                  </div>
                  <Button 
                    className="w-full bg-oasis hover:bg-oasis-dark"
                    onClick={() => navigateTo('tours')}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Listen Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 bg-sand-light">
        <div className="container mx-auto">
          <h2 className="text-3xl font-display font-bold text-center mb-12 text-desert-dark">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-oasis rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Listen & Learn</h3>
              <p className="text-muted-foreground">
                Experience immersive audio narrations that bring Saudi Arabia's rich history and culture to life.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-desert rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Explore Anywhere</h3>
              <p className="text-muted-foreground">
                Follow guided routes or explore freely with location-aware audio that responds to your journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-display font-bold mb-6 text-desert-dark">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Start exploring Saudi Arabia's incredible stories and heritage today.
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
                Discover Saudi Arabia through immersive audio experiences.
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
                    All Tours
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

export default IndexPage;
