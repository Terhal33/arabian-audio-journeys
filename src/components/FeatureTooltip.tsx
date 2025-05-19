
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { slideUpVariants } from '@/utils/animation';

interface FeatureTooltipProps {
  id: string; // Unique ID for this tooltip
  targetRef: React.RefObject<HTMLElement>; // Reference to the element to attach the tooltip to
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right'; // Position of the tooltip
  showOnce?: boolean; // Whether to show the tooltip only once
  delay?: number; // Delay before showing the tooltip
  maxWidth?: number; // Maximum width of the tooltip
  onDismiss?: () => void; // Callback when the tooltip is dismissed
  className?: string;
}

const FeatureTooltip = ({
  id,
  targetRef,
  title,
  description,
  position = 'bottom',
  showOnce = true,
  delay = 1000,
  maxWidth = 250,
  onDismiss,
  className,
}: FeatureTooltipProps) => {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const [viewedTooltips, setViewedTooltips] = useLocalStorage<string[]>('viewed_tooltips', []);
  
  // Check if the tooltip has been viewed before
  useEffect(() => {
    if (showOnce && viewedTooltips.includes(id)) {
      setIsDismissed(true);
      return;
    }
    
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [id, showOnce, viewedTooltips, delay]);
  
  // Position the tooltip relative to the target element
  useEffect(() => {
    if (!targetRef.current || !isVisible) return;
    
    const updatePosition = () => {
      const targetRect = targetRef.current?.getBoundingClientRect();
      if (!targetRect) return;
      
      let top = 0;
      let left = 0;
      
      switch (position) {
        case 'top':
          top = targetRect.top - 10;
          left = targetRect.left + targetRect.width / 2;
          break;
        case 'bottom':
          top = targetRect.bottom + 10;
          left = targetRect.left + targetRect.width / 2;
          break;
        case 'left':
          top = targetRect.top + targetRect.height / 2;
          left = targetRect.left - 10;
          break;
        case 'right':
          top = targetRect.top + targetRect.height / 2;
          left = targetRect.right + 10;
          break;
      }
      
      setTooltipPosition({ top, left });
    };
    
    updatePosition();
    
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [targetRef, isVisible, position]);
  
  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
    
    if (showOnce && !viewedTooltips.includes(id)) {
      setViewedTooltips([...viewedTooltips, id]);
    }
    
    if (onDismiss) {
      onDismiss();
    }
  };
  
  if (isDismissed) return null;
  
  // Determine position classes and transform origin
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return {
          containerClass: 'origin-bottom',
          arrowClass: 'bottom-0 left-1/2 -translate-x-1/2 translate-y-full border-t-desert border-x-transparent border-b-transparent'
        };
      case 'bottom':
        return {
          containerClass: 'origin-top',
          arrowClass: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-desert border-x-transparent border-t-transparent'
        };
      case 'left':
        return {
          containerClass: 'origin-right',
          arrowClass: 'right-0 top-1/2 translate-x-full -translate-y-1/2 border-l-desert border-y-transparent border-r-transparent'
        };
      case 'right':
        return {
          containerClass: 'origin-left',
          arrowClass: 'left-0 top-1/2 -translate-x-full -translate-y-1/2 border-r-desert border-y-transparent border-l-transparent'
        };
      default:
        return {
          containerClass: 'origin-top',
          arrowClass: 'top-0 left-1/2 -translate-x-1/2 -translate-y-full border-b-desert border-x-transparent border-t-transparent'
        };
    }
  };
  
  const { containerClass, arrowClass } = getPositionClasses();
  const positionStyle = {
    [position === 'top' ? 'bottom' : position === 'bottom' ? 'top' : 'top']: 
      position === 'top' ? `calc(100% - ${tooltipPosition.top}px)` : 
      position === 'bottom' ? `${tooltipPosition.top}px` : 
      `${tooltipPosition.top}px`,
    [position === 'left' ? 'right' : position === 'right' ? 'left' : 'left']: 
      position === 'left' ? `calc(100% - ${tooltipPosition.left}px)` : 
      position === 'right' ? `${tooltipPosition.left}px` : 
      `${tooltipPosition.left}px`,
    transform: 
      position === 'top' || position === 'bottom' ? 'translateX(-50%)' : 
      position === 'left' || position === 'right' ? 'translateY(-50%)' : 
      'translate(-50%, -50%)',
    maxWidth: `${maxWidth}px`,
  };
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={cn(
            "fixed z-50 flex flex-col p-3 bg-desert text-white rounded-md shadow-lg",
            containerClass,
            className
          )}
          style={positionStyle}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={slideUpVariants}
        >
          <button 
            className="absolute top-1 right-1 p-1 text-white/80 hover:text-white transition-colors"
            onClick={handleDismiss}
            aria-label="Close tooltip"
          >
            <X size={14} />
          </button>
          
          <h4 className="font-medium text-sm mb-1">{title}</h4>
          <p className="text-xs text-white/90 mb-2">{description}</p>
          
          <Button 
            onClick={handleDismiss} 
            variant="ghost" 
            size="sm"
            className="text-xs self-end text-white/90 hover:text-white hover:bg-desert-dark py-1 h-auto"
          >
            Got it <ChevronRight size={12} className="ml-1" />
          </Button>
          
          <div className={cn(
            "absolute w-0 h-0 border-solid border-4",
            arrowClass
          )} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeatureTooltip;
