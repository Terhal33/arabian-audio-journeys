
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { HeadphonesIcon, MapPin, Star } from 'lucide-react';
import { getFeaturedTours } from '@/services/toursData';
import TourCard from '@/components/TourCard';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const featuredTours = getFeaturedTours();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative bg-desert-dark text-white">
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <div className="container mx-auto px-6 py-16 md:py-24 relative z-10">
            <div className="max-w-2xl">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
                Discover Saudi Arabia Through Sound
              </h1>
              <p className="text-lg mb-8 text-sand-light">
                Immersive audio tours that bring the Kingdom's rich history and culture to life
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild className="bg-gold hover:bg-gold-dark text-night">
                  <Link to="/tours">Explore Tours</Link>
                </Button>
                {!isAuthenticated && (
                  <Button asChild variant="outline" className="border-white text-white hover:bg-white/20">
                    <Link to="/signup">Create Account</Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Featured Tours */}
        <section className="py-12 bg-sand-light">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold mb-8 text-desert-dark">
              Featured Tours
            </h2>
            <div className="grid grid-cols-1 gap-6">
              {featuredTours.map(tour => (
                <TourCard key={tour.id} tour={tour} featured />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button asChild variant="outline" className="border-desert text-desert hover:bg-desert/10">
                <Link to="/tours">View All Tours</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold text-center mb-12 text-desert-dark">
              How Arabian Audio Journeys Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-oasis rounded-full flex items-center justify-center mb-4">
                  <HeadphonesIcon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Listen & Learn</h3>
                <p className="text-muted-foreground">
                  Access expert narrations that bring the Kingdom's history and culture to life
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-desert rounded-full flex items-center justify-center mb-4">
                  <MapPin className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Explore Sites</h3>
                <p className="text-muted-foreground">
                  Follow guided routes through Saudi Arabia's most fascinating locations
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-gold rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Premium Access</h3>
                <p className="text-muted-foreground">
                  Upgrade to unlock exclusive in-depth tours and special content
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-oasis text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-3xl font-bold mb-4">
              Ready to Experience Saudi Arabia's Rich Heritage?
            </h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Start your journey with our free tours or unlock premium content for deeper cultural immersion.
            </p>
            <Button asChild className="bg-white text-oasis-dark hover:bg-sand-light">
              <Link to={isAuthenticated ? "/tours" : "/signup"}>
                {isAuthenticated ? "Browse Tours" : "Join Now"}
              </Link>
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-night text-white py-8">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <h3 className="font-display text-xl font-bold">
                  Arabian<span className="text-gold">Audio</span>
                </h3>
                <p className="text-sm text-white/70 mt-1">Immersive audio journeys through Saudi Arabia</p>
              </div>
              
              <div className="flex space-x-6">
                <a href="#" className="text-sm text-white/70 hover:text-white">About</a>
                <a href="#" className="text-sm text-white/70 hover:text-white">Terms</a>
                <a href="#" className="text-sm text-white/70 hover:text-white">Privacy</a>
                <a href="#" className="text-sm text-white/70 hover:text-white">Contact</a>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-white/20 text-center text-sm text-white/50">
              <p>© {new Date().getFullYear()} Arabian Audio Journeys. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
