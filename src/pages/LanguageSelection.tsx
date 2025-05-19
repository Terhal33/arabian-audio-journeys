
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Flag } from 'lucide-react';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { motion } from 'framer-motion';

const LanguageSelection: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'ar' | null>(null);
  const [languageStored, setLanguageStored] = useLocalStorage<string>('aaj_language', '');
  const { setLanguage } = useAuth();
  const navigate = useNavigate();

  // Check if language is already selected
  useEffect(() => {
    if (languageStored && (languageStored === 'en' || languageStored === 'ar')) {
      setSelectedLanguage(languageStored as 'en' | 'ar');
    }
  }, [languageStored]);

  const handleLanguageSelect = (language: 'en' | 'ar') => {
    setSelectedLanguage(language);
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      // Set language in auth context and local storage
      setLanguage(selectedLanguage);
      setLanguageStored(selectedLanguage);
      
      // Check if user has seen onboarding
      const hasSeenOnboarding = localStorage.getItem('aaj_onboarded') === 'true';
      
      // Navigate to onboarding if not seen, otherwise to login
      navigate(hasSeenOnboarding ? '/login' : '/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-sand-light flex flex-col items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-display font-bold text-desert-dark mb-3">
            Select your language
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose your preferred language
          </p>
          <p className="text-lg text-muted-foreground font-arabic">
            اختر لغتك المفضلة
          </p>
        </div>

        <div className="space-y-4 mb-10">
          <Button
            variant={selectedLanguage === 'en' ? 'default' : 'outline'}
            size="lg"
            className={`w-full h-20 text-lg justify-between px-6 ${
              selectedLanguage === 'en' ? 'bg-desert text-white' : 'border-2'
            }`}
            onClick={() => handleLanguageSelect('en')}
          >
            <div className="flex items-center">
              <Flag className="mr-4 h-6 w-6" />
              <span>English</span>
            </div>
            <div className="h-6 w-6 rounded-full border border-current flex items-center justify-center">
              {selectedLanguage === 'en' && <div className="h-4 w-4 rounded-full bg-current" />}
            </div>
          </Button>

          <Button
            variant={selectedLanguage === 'ar' ? 'default' : 'outline'}
            size="lg"
            className={`w-full h-20 text-lg justify-between px-6 ${
              selectedLanguage === 'ar' ? 'bg-desert text-white' : 'border-2'
            }`}
            onClick={() => handleLanguageSelect('ar')}
          >
            <div className="flex items-center">
              <Flag className="mr-4 h-6 w-6" />
              <span className="font-arabic">العربية</span>
            </div>
            <div className="h-6 w-6 rounded-full border border-current flex items-center justify-center">
              {selectedLanguage === 'ar' && <div className="h-4 w-4 rounded-full bg-current" />}
            </div>
          </Button>
        </div>

        <Button
          onClick={handleContinue}
          disabled={!selectedLanguage}
          className="w-full bg-desert hover:bg-desert-dark text-white h-12 text-base font-medium"
        >
          {selectedLanguage === 'ar' ? 'استمرار' : 'Continue'}
        </Button>
      </motion.div>
    </div>
  );
};

export default LanguageSelection;
