
import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  text?: string;
  variant?: 'default' | 'overlay';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  className = '',
  text,
  variant = 'default'
}) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  if (variant === 'overlay') {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm z-50">
        <motion.div 
          className={cn("flex flex-col items-center justify-center", className)}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <div
            className={cn(
              "border-desert border-t-transparent rounded-full animate-spin mx-auto",
              sizeClasses[size]
            )}
          />
          {text && (
            <p className="text-muted-foreground mt-2 text-sm">{text}</p>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div 
      className={cn("flex flex-col items-center justify-center", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={cn(
          "border-desert border-t-transparent rounded-full animate-spin mx-auto",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-muted-foreground mt-2 text-sm">{text}</p>
      )}
    </motion.div>
  );
};

export default React.memo(LoadingSpinner);
