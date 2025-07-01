
import React from 'react';
import { HeadphonesIcon, MapPin, Star } from 'lucide-react';

const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      icon: HeadphonesIcon,
      title: 'Listen',
      description: 'Experience immersive audio',
      bgColor: 'bg-oasis'
    },
    {
      icon: MapPin,
      title: 'Explore',
      description: 'Navigate heritage sites',
      bgColor: 'bg-desert'
    },
    {
      icon: Star,
      title: 'Discover',
      description: 'Uncover rich history',
      bgColor: 'bg-gold'
    }
  ];

  return (
    <section className="py-16 px-4 bg-sand-light">
      <div className="container mx-auto">
        <h2 className="text-3xl font-display font-bold text-center mb-12 text-desert-dark">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className={`w-16 h-16 ${step.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                <step.icon className="h-8 w-8 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
