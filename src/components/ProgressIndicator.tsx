
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressIndicatorProps {
  isLoading: boolean;
  className?: string;
  loadingDuration?: number;
}

const ProgressIndicator = ({ 
  isLoading, 
  className, 
  loadingDuration = 2000 
}: ProgressIndicatorProps) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    let timer: number;
    
    if (isLoading) {
      setProgress(0);
      
      // Animate to 90% over the specified duration
      const startTime = Date.now();
      const animateProgress = () => {
        const elapsedTime = Date.now() - startTime;
        const calculatedProgress = Math.min(90, (elapsedTime / loadingDuration) * 100);
        
        setProgress(calculatedProgress);
        
        if (calculatedProgress < 90) {
          timer = requestAnimationFrame(animateProgress);
        }
      };
      
      timer = requestAnimationFrame(animateProgress);
    } else if (progress > 0) {
      // Complete the progress to 100%
      setProgress(100);
      
      // Reset after animation completes
      const resetTimer = setTimeout(() => {
        setProgress(0);
      }, 500);
      
      return () => clearTimeout(resetTimer);
    }
    
    return () => cancelAnimationFrame(timer);
  }, [isLoading, loadingDuration]);
  
  return (
    <AnimatePresence>
      {progress > 0 && (
        <motion.div 
          className={cn("fixed top-0 left-0 right-0 z-50 h-0.5", className)}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.3, delay: 0.2 } }}
        >
          <motion.div 
            className="bg-desert h-full"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ 
              ease: progress === 100 ? "easeOut" : "easeInOut",
              duration: progress === 100 ? 0.2 : 0.5
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProgressIndicator;
