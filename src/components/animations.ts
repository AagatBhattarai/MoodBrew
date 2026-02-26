import type { Variants } from 'framer-motion';

// Page transition variants - INSTANT
export const pageVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0 }
  },
};

// Stagger container - INSTANT
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0, delayChildren: 0 },
  },
};

// Stagger item - INSTANT
export const staggerItem: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0 }
  },
};

// Card hover effect - DISABLED
export const cardHover = {
  rest: { scale: 1 },
  hover: { scale: 1 },
  tap: { scale: 1 },
};

// Button interaction variants - DISABLED
export const buttonVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1 },
  tap: { scale: 1 },
};

// Fade in up animation - INSTANT
export const fadeInUp: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0 }
  },
};

// Scale in animation - INSTANT
export const scaleIn: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0 }
  },
};

// Mood selector animation - INSTANT
export const moodButtonVariants: Variants = {
  initial: { scale: 1, backgroundColor: 'transparent' },
  selected: {
    scale: 1,
    transition: { duration: 0 }
  },
  hover: {
    scale: 1,
    transition: { duration: 0 }
  },
};

// Ripple effect helper - DISABLED
export const rippleVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 0, transition: { duration: 0 } },
};

// Shimmer loading animation - DISABLED
export const shimmerVariants: Variants = {
  animate: {
    backgroundPosition: '0% 0',
    transition: { duration: 0 }
  },
};

// Bounce animation - DISABLED
export const bounceVariants: Variants = {
  animate: { y: 0, transition: { duration: 0 } },
};

// Pulse animation - DISABLED
export const pulseVariants: Variants = {
  animate: { scale: 1, opacity: 1, transition: { duration: 0 } },
};

// Float animation - DISABLED
export const floatVariants: Variants = {
  animate: { y: 0, transition: { duration: 0 } },
};

// Podium grow animation - INSTANT
export const podiumGrowVariants: Variants = {
  initial: { height: 0, opacity: 0 },
  animate: (height: number) => ({
    height,
    opacity: 1,
    transition: { duration: 0 },
  }),
};

// Medal spin animation - INSTANT
export const medalSpinVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    rotate: 0,
    scale: 1,
    transition: { duration: 0 }
  },
};

// Typewriter effect helper - INSTANT
export const typewriterVariants: Variants = {
  initial: { width: 0 },
  animate: {
    width: '100%',
    transition: { duration: 0 }
  },
};

// Slide in from direction - INSTANT
export const slideIn = (direction: 'left' | 'right' | 'up' | 'down'): Variants => {
  return {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0 }
    },
  };
};

// Modal overlay variants - INSTANT
export const modalOverlayVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

// Modal content variants - INSTANT
export const modalContentVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

// Magnetic effect helper function - DISABLED
export const magneticEffect = (event: React.MouseEvent<HTMLElement>, element: HTMLElement) => {
  return { x: 0, y: 0 };
};

// Easing functions - UNUSED
export const easings = {
  easeOutCubic: [0, 0, 1, 1],
  easeInOutCubic: [0, 0, 1, 1],
  spring: [0, 0, 1, 1],
  bounce: [0, 0, 1, 1],
};
