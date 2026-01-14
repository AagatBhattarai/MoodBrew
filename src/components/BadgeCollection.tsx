import { motion } from 'framer-motion';
import { Card } from './Card';
import { Badge } from './Badge';
import { staggerContainer, staggerItem } from './animations';

interface UserBadge {
  achievementName: string;
  achievementDescription: string;
  achievementIcon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlockedAt: string;
}

interface BadgeCollectionProps {
  badges: UserBadge[];
  totalAchievements: number;
}

const rarityColors = {
  common: 'border-gray-300 bg-gray-50',
  rare: 'border-blue-300 bg-blue-50',
  epic: 'border-purple-300 bg-purple-50',
  legendary: 'border-yellow-300 bg-yellow-50',
};

export function BadgeCollection({ badges, totalAchievements }: BadgeCollectionProps) {
  const unlockedCount = badges.length;
  const completionPercent = Math.round((unlockedCount / totalAchievements) * 100);

  return (
    <Card glass glowOnHover>
      <div className="flex flex-col gap-lg">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-h2 font-bold text-text-primary">Badge Collection</h2>
            <p className="text-body-md text-text-secondary mt-1">
              {unlockedCount} of {totalAchievements} achievements unlocked
            </p>
          </div>
          <div className="text-right">
            <p className="text-h2 font-bold text-primary">{completionPercent}%</p>
            <p className="text-body-sm text-text-secondary">Complete</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-3 w-full rounded-full bg-background overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${completionPercent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>

        {/* Badges grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-md"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {badges.map((badge, index) => (
            <motion.div
              key={index}
              variants={staggerItem}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`relative rounded-xl border-2 p-md cursor-pointer ${rarityColors[badge.rarity]}`}
            >
              <div className="flex flex-col items-center gap-sm text-center">
                <motion.div
                  className="text-4xl"
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: index * 0.1,
                  }}
                >
                  {badge.achievementIcon}
                </motion.div>
                <div>
                  <h4 className="text-body-md font-bold text-text-primary">
                    {badge.achievementName}
                  </h4>
                  <p className="text-body-xs text-text-secondary mt-1">
                    {badge.achievementDescription}
                  </p>
                </div>
                <Badge variant="calorie" className="text-[10px]">
                  {badge.points} XP
                </Badge>
              </div>

              {/* Shine effect on hover */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-xl"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.6 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {badges.length === 0 && (
          <div className="text-center py-xl">
            <div className="text-6xl mb-md">🏆</div>
            <p className="text-body-lg text-text-secondary">
              Start your journey to unlock achievements!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
