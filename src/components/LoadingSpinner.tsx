
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  className = '',
  text
}) => {
  const sizeClasses = {
    small: 'w-5 h-5 border-2',
    medium: 'w-8 h-8 border-3',
    large: 'w-12 h-12 border-4',
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div
        className={cn(
          "border-desert border-t-transparent rounded-full animate-spin mx-auto",
          sizeClasses[size]
        )}
      />
      {text && (
        <p className="text-muted-foreground mt-2 text-sm">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
