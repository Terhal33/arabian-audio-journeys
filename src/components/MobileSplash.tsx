
import React, { useEffect, useState } from 'react';
import { SplashScreen } from '@capacitor/splash-screen';
import { useMobileFeatures } from '@/hooks/useMobileFeatures';

const MobileSplash: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const { isNative } = useMobileFeatures();

  useEffect(() => {
    const initializeApp = async () => {
      // Simulate app initialization time
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isNative) {
        await SplashScreen.hide();
      }
      
      setIsReady(true);
    };

    initializeApp();
  }, [isNative]);

  if (!isReady) {
    return (
      <div className="fixed inset-0 bg-sand-light flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-display font-bold text-desert-dark mb-4">
            Terhal
          </div>
          <div className="text-lg text-muted-foreground mb-8">
            Discover Saudi Arabia
          </div>
          <div className="w-12 h-12 border-4 border-desert border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default MobileSplash;
