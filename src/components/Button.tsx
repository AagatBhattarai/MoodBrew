import { type ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { buttonVariants } from './animations';

type ButtonVariant = 'primary' | 'secondary' | 'outline';

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-surface hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary/40',
  secondary:
    'bg-surface text-primary border border-primary hover:bg-primary/5 focus-visible:ring-2 focus-visible:ring-primary/30',
  outline:
    'bg-transparent text-text-primary border border-text-secondary hover:bg-text-secondary/10 focus-visible:ring-2 focus-visible:ring-text-secondary/30',
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  return (
    <motion.button
      className={`inline-flex items-center justify-center rounded-lg px-md py-2 text-button transition-colors duration-200 focus-visible:outline-none relative overflow-hidden ${variantClasses[variant]} ${className}`}
      variants={buttonVariants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      {...props}
    />
  );
}

