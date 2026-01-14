import { type HTMLAttributes, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hover3d?: boolean;
  glowOnHover?: boolean;
}

export function Card({ 
  className = '', 
  glass = false,
  hover3d = false,
  glowOnHover = false,
  children,
  ...props 
}: CardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-100, 100], [5, -5]);
  const rotateY = useTransform(x, [-100, 100], [-5, 5]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!hover3d) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (hover3d) {
      x.set(0);
      y.set(0);
    }
  };

  const baseClasses = glass
    ? 'glass noise-texture'
    : 'bg-surface';

  const shadowClasses = glowOnHover
    ? 'floating-shadow'
    : 'shadow-md';

  return (
    <motion.div
      className={`rounded-lg p-md transition-all duration-300 perspective ${baseClasses} ${shadowClasses} ${className}`}
      style={hover3d ? {
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
      } : undefined}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={hover3d ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

