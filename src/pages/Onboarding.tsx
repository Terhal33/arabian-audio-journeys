
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// Define the onboarding slides data
const onboardingSlides = [
  {
    id: 1,
    title: "Discover Cultural Heritage",
    description: "Explore Saudi Arabia's rich cultural tapestry through immersive audio tours narrated by local experts.",
    image: "https://images.unsplash.com/photo-1566442739419-e03dc6c3dcb4?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Experience at Your Own Pace",
    description: "Listen to historical insights and cultural stories as you explore iconic landmarks throughout the kingdom.",
    image: "https://images.unsplash.com/photo-1485977825569-72c5079c4390?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Navigate Like a Local",
    description: "Access interactive maps, offline content, and personalized recommendations for an authentic Saudi experience.",
    image: "https://images.unsplash.com/photo-1498816654819-7917d0e1f10f?q=80&w=1000&auto=format&fit=crop"
  }
];

const Onboarding: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  
  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      // Mark onboarding as completed
      localStorage.setItem('aaj_onboarded', 'true');
      navigate('/login');
    }
  };
  
  const handleSkip = () => {
    // Mark onboarding as completed
    localStorage.setItem('aaj_onboarded', 'true');
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="relative flex flex-col h-screen w-full"
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 z-0 bg-cover bg-center brightness-[0.8]" 
            style={{ backgroundImage: `url(${onboardingSlides[currentSlide].image})` }}
          />
          
          {/* Dark overlay */}
          <div className="absolute inset-0 z-10 bg-black/40" />
          
          {/* Skip button at top */}
          <div className="relative z-20 flex justify-end p-6">
            {currentSlide < onboardingSlides.length - 1 && (
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/20"
                onClick={handleSkip}
              >
                Skip
              </Button>
            )}
          </div>
          
          {/* Content */}
          <div className="relative z-20 flex flex-col flex-1 items-center justify-end p-8 text-center">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              {onboardingSlides[currentSlide].title}
            </h1>
            <p className="text-lg text-white/90 mb-12 max-w-md">
              {onboardingSlides[currentSlide].description}
            </p>
            
            {/* Progress indicator */}
            <div className="flex justify-center space-x-2 mb-12">
              {onboardingSlides.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
            
            {/* Action button */}
            <Button 
              className="w-full max-w-xs mb-10 bg-desert hover:bg-desert-dark text-white"
              onClick={handleNext}
            >
              {currentSlide === onboardingSlides.length - 1 ? (
                'Get Started'
              ) : (
                <>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Onboarding;
