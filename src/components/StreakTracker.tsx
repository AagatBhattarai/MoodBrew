import { motion } from 'framer-motion';
import { Card } from './Card';

interface StreakTrackerProps {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate?: string;
}

export function StreakTracker({ currentStreak, longestStreak, lastActivityDate }: StreakTrackerProps) {
  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const isActive = i < currentStreak;
    return { day: i + 1, isActive };
  });

  return (
    <Card glass glowOnHover className="bg-gradient-to-br from-primary/5 to-secondary/5">
      <div className="flex flex-col gap-lg">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-sm">
              <motion.span
                className="text-3xl"
                animate={{
                  scale: currentStreak > 0 ? [1, 1.2, 1] : 1,
                  rotate: currentStreak > 0 ? [0, 10, -10, 0] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: currentStreak > 0 ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              >
                🔥
              </motion.span>
              <h2 className="text-h2 font-bold text-text-primary">Daily Streak</h2>
            </div>
            <p className="text-body-md text-text-secondary mt-1">
              Keep visiting to maintain your streak!
            </p>
          </div>
        </div>

        {/* Current streak display */}
        <div className="grid grid-cols-2 gap-md">
          <div className="rounded-xl bg-surface p-md text-center">
            <motion.p
              className="text-h1 font-bold text-primary"
              key={currentStreak}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
            >
              {currentStreak}
            </motion.p>
            <p className="text-body-sm text-text-secondary mt-1">Current Streak</p>
          </div>

          <div className="rounded-xl bg-surface p-md text-center">
            <p className="text-h1 font-bold text-secondary">{longestStreak}</p>
            <p className="text-body-sm text-text-secondary mt-1">Longest Streak</p>
          </div>
        </div>

        {/* Visual streak days */}
        <div className="flex justify-between gap-2">
          {streakDays.map((day) => (
            <motion.div
              key={day.day}
              className={`flex-1 h-12 rounded-lg flex items-center justify-center font-bold transition ${
                day.isActive
                  ? 'bg-primary text-surface'
                  : 'bg-background text-text-secondary'
              }`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: day.day * 0.1 }}
              whileHover={{ scale: 1.1 }}
            >
              {day.isActive ? '🔥' : day.day}
            </motion.div>
          ))}
        </div>

        {/* Motivational message */}
        <div className="rounded-lg bg-primary/10 p-sm">
          <p className="text-body-sm text-primary text-center">
            {currentStreak === 0 && "Start your streak today!"}
            {currentStreak > 0 && currentStreak < 3 && "Keep it up! You're on fire! 🔥"}
            {currentStreak >= 3 && currentStreak < 7 && "Amazing streak! Don't break it! 💪"}
            {currentStreak >= 7 && "You're unstoppable! Legend status! 🌟"}
          </p>
        </div>

        {lastActivityDate && (
          <p className="text-body-xs text-text-secondary text-center">
            Last activity: {new Date(lastActivityDate).toLocaleDateString()}
          </p>
        )}
      </div>
    </Card>
  );
}
