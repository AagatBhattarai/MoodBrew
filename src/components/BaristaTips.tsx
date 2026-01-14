import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';

const tips = [
  {
    tip: 'Coffee tastes best when brewed between 195-205°F!',
    barista: 'Chef Marco',
    icon: '🌡️',
  },
  {
    tip: 'Store your beans in an airtight container away from light',
    barista: 'Sarah the Barista',
    icon: '☕',
  },
  {
    tip: 'Try our pour-over method for the cleanest flavor profile',
    barista: 'Master Chen',
    icon: '💧',
  },
  {
    tip: 'Fresh coffee beans are best used within 2-3 weeks of roasting',
    barista: 'Emma',
    icon: '📅',
  },
  {
    tip: 'Use filtered water for the best tasting coffee',
    barista: 'Chef Marco',
    icon: '💎',
  },
];

export function BaristaTips() {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card glass className="bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="flex items-center gap-md">
        <motion.div
          className="text-5xl"
          animate={{
            rotate: [0, 10, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          👨‍🍳
        </motion.div>

        <div className="flex-1 overflow-hidden">
          <p className="text-body-sm font-semibold text-primary mb-1">
            💡 Barista Tip
          </p>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTip}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-body-md text-text-primary mb-1">
                {tips[currentTip].icon} {tips[currentTip].tip}
              </p>
              <p className="text-body-sm text-text-secondary">
                - {tips[currentTip].barista}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-1">
          {tips.map((_, index) => (
            <motion.div
              key={index}
              className={`h-1 w-8 rounded-full ${
                index === currentTip ? 'bg-primary' : 'bg-background'
              }`}
              animate={index === currentTip ? {
                scaleX: [0, 1],
              } : {}}
              transition={{
                duration: 5,
              }}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}
