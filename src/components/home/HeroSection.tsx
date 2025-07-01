
import React from 'react';
import { Button } from '@/components/ui/button';
import { HeadphonesIcon } from 'lucide-react';

interface HeroSectionProps {
  isAuthenticated: boolean;
  onNavigate: (destination: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ isAuthenticated, onNavigate }) => {
  return (
    <section className="relative py-20 px-4 bg-gradient-to-br from-desert-light to-sand-light">
      <div className="container mx-auto text-center max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-display font-bold text-desert-dark mb-6">
          Discover Saudi
        </h1>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg" 
            className="bg-desert hover:bg-desert-dark text-white"
            onClick={() => onNavigate('tours')}
            aria-label="Explore UNESCO World Heritage audio tours"
          >
            <HeadphonesIcon className="mr-2 h-5 w-5" aria-hidden="true" />
            Explore
          </Button>
          {!isAuthenticated && (
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => onNavigate('signup')}
              aria-label="Create a free account to access tours"
            >
              Join
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
