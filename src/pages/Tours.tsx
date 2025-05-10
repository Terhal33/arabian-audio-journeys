
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { tours } from '@/services/toursData';
import TourCard from '@/components/TourCard';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const Tours = () => {
  const { isAuthenticated, isPremium } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-10 bg-sand-light">
        <div className="container mx-auto px-4">
          <h1 className="font-display text-3xl font-bold mb-8 text-desert-dark">
            Explore Our Tours
          </h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map(tour => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>
          
          {!isPremium && (
            <div className="mt-8 text-center bg-gold/10 p-6 rounded-lg">
              <h2 className="text-xl font-display font-bold mb-2 text-desert-dark">
                Upgrade to Premium
              </h2>
              <p className="text-muted-foreground mb-4">
                Get unlimited access to all premium tours and exclusive content!
              </p>
              <Button className="bg-gold hover:bg-gold-dark text-night">
                Upgrade Now
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tours;
