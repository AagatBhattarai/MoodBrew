import { motion } from 'framer-motion';

interface ProgressRingProps {
  level: number;
  currentXP: number;
  xpForNextLevel: number;
  size?: number;
  strokeWidth?: number;
}

export function ProgressRing({ 
  level, 
  currentXP, 
  xpForNextLevel, 
  size = 80,
  strokeWidth = 6 
}: ProgressRingProps) {
  const progress = (currentXP / xpForNextLevel) * 100;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="none"
          className="text-background"
        />
        {/* Progress circle with gradient */}
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4A2C2A" />
            <stop offset="100%" stopColor="#D4A574" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            strokeDasharray: circumference,
          }}
        />
      </svg>
      
      {/* Level display */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-h3 font-bold text-primary"
          key={level}
          initial={{ scale: 1.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring' }}
        >
          {level}
        </motion.span>
        <span className="text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
          Level
        </span>
      </div>

      {/* XP tooltip on hover */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-surface rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
          <p className="text-[10px] font-semibold text-text-primary">
            {currentXP} / {xpForNextLevel} XP
          </p>
        </div>
      </div>
    </div>
  );
}
