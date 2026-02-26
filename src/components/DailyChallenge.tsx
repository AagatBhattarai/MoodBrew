import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';

const challenges = [
  {
    title: 'Try Something New',
    description: 'Order a drink you\'ve never tried before',
    reward: '50 XP + Mystery Badge',
    icon: '🎯',
  },
  {
    title: 'Early Bird Special',
    description: 'Order before 9 AM',
    reward: '30 XP',
    icon: '🌅',
  },
  {
    title: 'Share the Love',
    description: 'Share your favorite cafe on social media',
    reward: '40 XP',
    icon: '💕',
  },
];

export function DailyChallenge() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [challenge] = useState(challenges[Math.floor(Math.random() * challenges.length)]);

  return (
    <Card glass glowOnHover className="relative overflow-hidden">
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="scratch"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-lg cursor-pointer"
            onClick={() => setIsRevealed(true)}
          >
            <motion.div
              className="text-6xl mb-md"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              🎁
            </motion.div>
            <h3 className="text-h3 font-bold text-text-primary mb-2">
              Today's Challenge
            </h3>
            <p className="text-body-md text-text-secondary mb-md">
              Click to reveal!
            </p>
            <motion.div
              className="inline-block px-6 py-3 rounded-xl bg-primary/10 border-2 border-dashed border-primary"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-body-lg font-semibold text-primary">
                Tap to Scratch 🎲
              </span>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="revealed"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring' }}
            className="text-center py-lg"
          >
            {/* Confetti effect */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  background: ['#FF6B35', '#F39C12', '#4A7C59', '#E74C3C'][i % 4],
                  left: `${50}%`,
                  top: `${50}%`,
                }}
                animate={{
                  x: [0, (Math.random() - 0.5) * 200],
                  y: [0, (Math.random() - 0.5) * 200],
                  opacity: [1, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 1,
                  ease: 'easeOut',
                }}
              />
            ))}

            <motion.div
              className="text-6xl mb-md"
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 0.5,
              }}
            >
              {challenge.icon}
            </motion.div>
            <h3 className="text-h3 font-bold text-text-primary mb-2">
              {challenge.title}
            </h3>
            <p className="text-body-md text-text-secondary mb-md">
              {challenge.description}
            </p>
            <div className="inline-block px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-surface font-semibold">
              🎁 Reward: {challenge.reward}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
