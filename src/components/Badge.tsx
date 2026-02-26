import { type HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { pulseVariants } from './animations';

type BadgeVariant = 'discount' | 'calorie' | 'new' | 'neutral';

const variantClasses: Record<BadgeVariant, string> = {
  discount: 'bg-secondary text-surface',
  calorie: 'bg-accent text-surface',
  new: 'bg-info text-surface',
  neutral: 'bg-text-secondary/10 text-text-primary',
};

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant;
  pulse?: boolean;
};

export function Badge({ className = '', variant = 'neutral', pulse = false, ...props }: BadgeProps) {
  return (
    <motion.span
      className={`inline-flex items-center rounded-pill px-sm py-1 text-[12px] font-semibold uppercase tracking-wide ${variantClasses[variant]} ${className}`}
      variants={pulse ? pulseVariants : undefined}
      animate={pulse ? 'animate' : undefined}
      {...props}
    />
  );
}

