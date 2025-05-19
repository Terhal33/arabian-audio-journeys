
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import ProgressiveImage from '@/components/ProgressiveImage';

const Splash = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        const newValue = prev + Math.random() * 15;
        return newValue > 100 ? 100 : newValue;
      });
    }, 300);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-sand-light relative overflow-hidden">
      {/* Background Pattern - Subtle Saudi geometric pattern */}
      <div className="absolute inset-0 opacity-5 bg-repeat" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23805b10' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
           }}></div>
      
      <motion.div 
        className="flex flex-col items-center justify-center z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Logo Container with golden border */}
        <div className="w-32 h-32 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-gold mb-6">
          <div className="text-5xl font-display font-bold text-desert-dark">
            A<span className="text-gold">A</span>
          </div>
        </div>
        
        <div className="text-5xl font-display font-bold text-center text-desert-dark">
          Arabian<span className="text-gold">Audio</span>
        </div>
        
        <div className="text-xl text-center text-muted-foreground mt-2">
          Your journey through Saudi Arabia's history
        </div>
        
        {/* Loading progress bar */}
        <div className="w-64 h-2 bg-sand mt-12 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gold"
            initial={{ width: 0 }}
            animate={{ width: `${loadingProgress}%` }}
            transition={{ ease: "easeInOut" }}
          />
        </div>
      </motion.div>
      
      {/* Audio bars animation at bottom */}
      <div className="absolute bottom-12 flex space-x-2 items-center">
        <motion.div 
          animate={{ 
            height: [8, 24, 8],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.1,
          }}
          className={cn("audio-bar w-2 bg-desert rounded-full")}
        ></motion.div>
        <motion.div 
          animate={{ 
            height: [12, 32, 12],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className={cn("audio-bar w-2 bg-desert rounded-full")}
        ></motion.div>
        <motion.div 
          animate={{ 
            height: [18, 24, 18],
          }}
          transition={{
            duration: 1.3,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.2,
          }}
          className={cn("audio-bar w-2 bg-desert rounded-full")}
        ></motion.div>
        <motion.div 
          animate={{ 
            height: [24, 40, 24],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.3,
          }}
          className={cn("audio-bar w-2 bg-desert rounded-full")}
        ></motion.div>
        <motion.div 
          animate={{ 
            height: [16, 22, 16],
          }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: 0.1,
          }}
          className={cn("audio-bar w-2 bg-desert rounded-full")}
        ></motion.div>
      </div>
    </div>
  );
};

export default Splash;
