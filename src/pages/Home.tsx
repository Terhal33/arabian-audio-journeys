
import React from 'react';
import Navbar from '@/components/Navbar';
import { tours } from '@/services/toursData';
import TourCard from '@/components/TourCard';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  const featuredTours = tours.slice(0, 3); // Show just the first 3 tours

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-6 bg-sand-light">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold mb-2 text-desert-dark">
              Welcome{user?.name ? `, ${user.name}` : ''}
            </h1>
            <p className="text-muted-foreground">
              Discover audio tours across Saudi Arabia's rich cultural landmarks
            </p>
          </div>
          
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-xl font-bold text-desert-dark">Featured Tours</h2>
              <Link to="/tours" className="text-oasis text-sm font-medium">View All</Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredTours.map(tour => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          </section>
          
          <section>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="font-display text-xl font-bold mb-4 text-desert-dark">Continue Listening</h2>
              <p className="text-muted-foreground mb-4">Pick up where you left off on your audio journey</p>
              <Button className="bg-desert hover:bg-desert-dark">
                Resume Last Tour
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
