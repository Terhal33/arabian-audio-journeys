
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { fadeInVariants } from '@/utils/animation';

interface ProgressiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  lowResSrc?: string;
  blurHash?: string;
  alt: string;
  aspectRatio?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  className?: string;
  containerClassName?: string;
  loadingComponent?: React.ReactNode;
  errorComponent?: React.ReactNode;
}

const ProgressiveImage = ({
  src,
  lowResSrc,
  blurHash,
  alt,
  aspectRatio = '16/9',
  width,
  height,
  priority = false,
  onLoad,
  className,
  containerClassName,
  loadingComponent,
  errorComponent,
  ...props
}: ProgressiveImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    if (priority) {
      return; // Skip if image is priority
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && imgRef.current) {
            const img = imgRef.current;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              observerRef.current?.unobserve(img);
            }
          }
        });
      },
      { rootMargin: '200px 0px' }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [priority]);

  const handleImageLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    setIsError(true);
  };

  // Default loading component
  const defaultLoadingComponent = (
    <div className={cn("w-full h-full relative overflow-hidden rounded-md", containerClassName)}>
      {lowResSrc ? (
        <img
          src={lowResSrc}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover blur-sm opacity-70 transition-opacity"
          style={{ aspectRatio }}
        />
      ) : blurHash ? (
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: `url(${blurHash})`,
            aspectRatio,
          }}
        />
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </div>
  );

  // Default error component
  const defaultErrorComponent = (
    <div className={cn("w-full flex items-center justify-center bg-muted", containerClassName)} style={{ width, height, aspectRatio }}>
      <p className="text-muted-foreground text-sm">Image failed to load</p>
    </div>
  );

  if (isError) {
    return <>{errorComponent || defaultErrorComponent}</>;
  }

  return (
    <div className={cn("relative overflow-hidden", containerClassName)} style={{ width, height, aspectRatio }}>
      {!isLoaded && (loadingComponent || defaultLoadingComponent)}
      
      <motion.img
        ref={imgRef}
        src={priority ? src : undefined}
        data-src={!priority ? src : undefined}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        initial="initial"
        animate={isLoaded ? "animate" : "initial"}
        variants={fadeInVariants}
        className={cn(
          "w-full h-full object-cover",
          { "opacity-0": !isLoaded, "opacity-100": isLoaded },
          className
        )}
        style={{
          aspectRatio,
          width,
          height,
          transition: 'opacity 0.3s ease-in-out',
        }}
        {...props}
      />
    </div>
  );
};

export default React.memo(ProgressiveImage);
