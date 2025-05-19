
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface TutorialStep {
  title: string;
  description: string;
  image?: string;
  highlightElement?: string; // CSS selector for element to highlight
}

interface OnboardingTutorialProps {
  steps: TutorialStep[];
  onComplete: () => void;
  showOnlyOnce?: boolean;
  forceShow?: boolean;
  tutorialId: string; // Unique ID for this tutorial
}

const OnboardingTutorial = ({
  steps,
  onComplete,
  showOnlyOnce = true,
  forceShow = false,
  tutorialId
}: OnboardingTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [completedTutorials, setCompletedTutorials] = useLocalStorage<string[]>('completed_tutorials', []);
  
  useEffect(() => {
    // Check if this tutorial should be shown
    if (forceShow || !showOnlyOnce || !completedTutorials.includes(tutorialId)) {
      setIsVisible(true);
    }
  }, [completedTutorials, forceShow, showOnlyOnce, tutorialId]);
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = () => {
    // Mark tutorial as completed
    if (showOnlyOnce && !completedTutorials.includes(tutorialId)) {
      setCompletedTutorials([...completedTutorials, tutorialId]);
    }
    setIsVisible(false);
    onComplete();
  };
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg p-6 max-w-md w-full mx-4 relative"
        >
          <button 
            onClick={handleComplete}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted transition-colors"
            aria-label="Close tutorial"
          >
            <X size={18} />
          </button>
          
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 ${
                    index === currentStep ? 'bg-desert' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            
            {steps[currentStep].image && (
              <div className="mb-4 flex justify-center">
                <img 
                  src={steps[currentStep].image} 
                  alt={steps[currentStep].title}
                  className="max-h-40 object-contain rounded-md" 
                />
              </div>
            )}
            
            <h3 className="text-xl font-display font-bold mb-2">{steps[currentStep].title}</h3>
            <p className="text-muted-foreground">{steps[currentStep].description}</p>
          </div>
          
          <div className="flex justify-between">
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={currentStep === 0 ? 'invisible' : ''}
            >
              <ChevronLeft size={16} className="mr-1" /> Previous
            </Button>
            
            <Button onClick={handleNext} className="bg-desert hover:bg-desert-dark ml-auto">
              {currentStep === steps.length - 1 ? 'Finish' : 'Next'} <ChevronRight size={16} className="ml-1" />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingTutorial;
