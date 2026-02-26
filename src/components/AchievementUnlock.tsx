import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { modalOverlayVariants, scaleIn } from './animations';

interface Achievement {
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
}

interface AchievementUnlockProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-yellow-600',
};

const rarityBadges = {
  common: 'neutral' as const,
  rare: 'calorie' as const,
  epic: 'new' as const,
  legendary: 'discount' as const,
};

export function AchievementUnlock({ achievement, isOpen, onClose }: AchievementUnlockProps) {
  if (!achievement) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {achievement.rarity === 'epic' || achievement.rarity === 'legendary' ? (
            <Confetti
              width={window.innerWidth}
              height={window.innerHeight}
              recycle={false}
              numberOfPieces={200}
              gravity={0.3}
            />
          ) : null}

          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            variants={modalOverlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
          />

          <motion.div
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative z-10 w-full max-w-md"
          >
            <Card glass className="p-xl overflow-hidden">
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${rarityColors[achievement.rarity]} opacity-10`} />

              <div className="relative flex flex-col items-center gap-lg text-center">
                {/* Achievement unlocked text */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <p className="text-body-sm font-semibold uppercase tracking-wide text-text-secondary">
                    Achievement Unlocked!
                  </p>
                </motion.div>

                {/* Icon with animation */}
                <motion.div
                  className="relative"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.3,
                  }}
                >
                  <div className={`absolute inset-0 blur-2xl bg-gradient-to-br ${rarityColors[achievement.rarity]} opacity-50`} />
                  <motion.div
                    className="relative text-8xl"
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    {achievement.icon}
                  </motion.div>
                </motion.div>

                {/* Achievement details */}
                <motion.div
                  className="flex flex-col items-center gap-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <Badge variant={rarityBadges[achievement.rarity]} pulse>
                    {achievement.rarity.toUpperCase()}
                  </Badge>
                  <h2 className="text-h2 font-bold text-text-primary">{achievement.name}</h2>
                  <p className="text-body-md text-text-secondary">{achievement.description}</p>
                </motion.div>

                {/* Points earned */}
                <motion.div
                  className={`flex items-center gap-sm rounded-pill px-lg py-md bg-gradient-to-r ${rarityColors[achievement.rarity]}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.7, type: 'spring' }}
                >
                  <span className="text-body-lg font-bold text-surface">+{achievement.points} XP</span>
                  <span className="text-xl">✨</span>
                </motion.div>

                {/* Close button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9 }}
                  className="w-full"
                >
                  <Button onClick={onClose} className="w-full">
                    Awesome!
                  </Button>
                </motion.div>
              </div>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
