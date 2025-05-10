
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import LanguageSelector from '@/components/LanguageSelector';
import { MapPin, Headphones, Globe } from 'lucide-react';

const onboardingData = [
  {
    title: "Discover Hidden Stories",
    description: "Explore Saudi Arabia's rich cultural heritage through immersive audio tours narrated by expert local guides.",
    icon: <MapPin className="h-12 w-12 text-desert" />,
  },
  {
    title: "Audio at Your Pace",
    description: "Listen to historical facts, local legends and cultural insights as you explore landmarks at your own pace.",
    icon: <Headphones className="h-12 w-12 text-desert" />,
  },
  {
    title: "Available in Multiple Languages",
    description: "Experience tours in both English and Arabic, with authentic pronunciations and culturally nuanced storytelling.",
    icon: <Globe className="h-12 w-12 text-desert" />,
  },
];

const Onboarding = () => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const navigate = useNavigate();
  const { language } = useAuth();
  
  const handleNext = () => {
    if (currentScreen < onboardingData.length - 1) {
      setCurrentScreen(currentScreen + 1);
    } else {
      // Mark onboarding as completed
      localStorage.setItem('aaj_onboarded', 'true');
      navigate('/login');
    }
  };
  
  const handleSkip = () => {
    localStorage.setItem('aaj_onboarded', 'true');
    navigate('/login');
  };
  
  return (
    <div className={`min-h-screen flex flex-col bg-sand-light ${language === 'ar' ? 'text-right' : 'text-left'}`}>
      <div className="p-4 flex justify-end">
        <LanguageSelector />
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="mb-12 text-center">
          {onboardingData[currentScreen].icon}
          <h1 className="mt-6 text-3xl font-display font-semibold text-desert-dark">
            {onboardingData[currentScreen].title}
          </h1>
          <p className="mt-3 text-muted-foreground">
            {onboardingData[currentScreen].description}
          </p>
        </div>
        
        <div className="flex justify-center space-x-2 mb-8">
          {onboardingData.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full ${
                index === currentScreen ? 'bg-desert' : 'bg-border'
              }`}
            />
          ))}
        </div>
        
        <div className="w-full max-w-md space-y-4">
          <Button
            className="w-full bg-desert hover:bg-desert-dark text-white"
            onClick={handleNext}
          >
            {currentScreen === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          </Button>
          
          {currentScreen < onboardingData.length - 1 && (
            <Button
              variant="outline"
              className="w-full"
              onClick={handleSkip}
            >
              Skip
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
