
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  lowQualitySrc?: string;
  fadeInDuration?: number;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
  backgroundColor?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  lowQualitySrc,
  fadeInDuration = 300,
  loadingComponent,
  errorComponent,
  backgroundColor = 'bg-muted',
  ...props
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Use Intersection Observer for lazy loading
  useEffect(() => {
    if (!imageRef.current) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // When element comes into view, set the actual src
          const img = entry.target as HTMLImageElement;
          if (img.dataset.src) {
            img.src = img.dataset.src;
          }
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px', // Start loading 200px before it comes into view
      threshold: 0.01
    });
    
    observer.observe(imageRef.current);
    
    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [src]);
  
  const handleLoad = () => {
    setLoaded(true);
  };
  
  const handleError = () => {
    setError(true);
  };
  
  // Default loading placeholder
  const defaultLoadingComponent = (
    <div 
      className={cn(
        "flex items-center justify-center", 
        backgroundColor
      )}
      style={{ width, height }}
    >
      <Skeleton className={cn("w-full h-full rounded-none", className)} />
    </div>
  );
  
  // Default error placeholder
  const defaultErrorComponent = (
    <div 
      className={cn(
        "flex items-center justify-center text-center p-4", 
        backgroundColor
      )}
      style={{ width, height }}
    >
      <p className="text-muted-foreground text-sm">Image could not be loaded</p>
    </div>
  );
  
  if (error) {
    return errorComponent || defaultErrorComponent;
  }
  
  return (
    <div className="relative" style={{ width, height }}>
      {!loaded && (lowQualitySrc ? (
        <img
          src={lowQualitySrc}
          alt={alt}
          className={cn(
            "absolute inset-0 w-full h-full object-cover blur-sm", 
            className
          )}
          style={{ width, height }}
        />
      ) : (
        loadingComponent || defaultLoadingComponent
      ))}
      
      <img
        ref={imageRef}
        data-src={src} // Use data-src for lazy loading
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "w-full h-full object-cover transition-opacity duration-300",
          { "opacity-0": !loaded, "opacity-100": loaded },
          className
        )}
        style={{ 
          transitionDuration: `${fadeInDuration}ms`, 
          width, 
          height
        }}
        {...props}
      />
    </div>
  );
};

export default React.memo(OptimizedImage);
