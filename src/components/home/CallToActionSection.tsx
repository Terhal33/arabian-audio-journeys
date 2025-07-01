
import React from 'react';
import { Button } from '@/components/ui/button';

interface CallToActionSectionProps {
  onNavigate: (destination: string) => void;
}

const CallToActionSection: React.FC<CallToActionSectionProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl font-display font-bold mb-6 text-desert-dark">
          Ready to Explore?
        </h2>
        <Button 
          size="lg" 
          className="bg-desert hover:bg-desert-dark text-white"
          onClick={() => onNavigate('tours')}
          aria-label="Start exploring UNESCO heritage sites"
        >
          Start Exploring
        </Button>
      </div>
    </section>
  );
};

export default CallToActionSection;
