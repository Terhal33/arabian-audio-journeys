import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getTours } from '@/services/toursData';
import TourCard from '@/components/TourCard';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const Tours = () => {
  const tours = getTours();
  const { isAuthenticated } = useAuth();

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
          
          {!isAuthenticated && (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">
                To unlock the full experience, create an account and start your audio journey today!
              </p>
              <Button asChild className="mt-4 bg-desert hover:bg-desert-dark text-white">
                <Link to="/signup">Sign Up Now</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Tours;
