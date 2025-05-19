
import { type Variants } from 'framer-motion';

// Base animation timing
export const timings = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
};

// Reusable easing functions
export const easing = {
  smooth: [0.4, 0.0, 0.2, 1],
  decelerate: [0.0, 0.0, 0.2, 1],
  accelerate: [0.4, 0.0, 1, 1],
  spring: [0.175, 0.885, 0.32, 1.275],
};

// Page transition variants
export const pageTransitionVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timings.normal,
      ease: easing.decelerate,
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: timings.fast,
      ease: easing.accelerate,
    },
  },
};

// Card animation variants
export const cardVariants: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      duration: timings.normal,
      ease: easing.spring,
    }
  },
  hover: {
    scale: 1.03,
    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
    transition: {
      duration: timings.fast,
      ease: easing.spring,
    }
  },
  tap: {
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: easing.decelerate,
    }
  },
};

// List item stagger variants
export const listItemVariants: Variants = {
  initial: { opacity: 0, x: -10 },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: timings.normal,
      ease: easing.decelerate,
    }
  },
};

// Fade in animation for images and content
export const fadeInVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      duration: timings.normal,
      ease: easing.decelerate,
    }
  },
};

// Slide up animation for bottom sheets and modals
export const slideUpVariants: Variants = {
  initial: { opacity: 0, y: 50 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: timings.normal,
      ease: easing.spring,
    }
  },
  exit: {
    opacity: 0,
    y: 50,
    transition: {
      duration: timings.fast,
      ease: easing.accelerate,
    }
  },
};

// Scale animation for buttons and interactive elements
export const scaleVariants: Variants = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { 
    scale: 1, 
    opacity: 1,
    transition: {
      duration: timings.fast,
      ease: easing.spring,
    }
  },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

// Provides haptic feedback for interactions if available
export const triggerHapticFeedback = (pattern: 'light' | 'medium' | 'heavy' = 'light') => {
  if (!window.navigator) return;
  
  const patternMap = {
    light: 10,
    medium: 25,
    heavy: 50
  };
  
  try {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(patternMap[pattern]);
    }
  } catch (error) {
    console.error('Haptic feedback failed:', error);
  }
};
