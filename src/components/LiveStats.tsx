import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { api } from '../lib/api';

interface Stat {
  label: string;
  value: number;
  icon: string;
  color: string;
  unit?: string;
}

interface UserStats {
  xp: number;
  points: number;
  level: number;
  total_orders: number;
  total_spent: number;
  streak_days: number;
}

export function LiveStats() {
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [stats, setStats] = useState<Stat[]>([
    { label: 'Orders Today', value: 0, icon: '☕', color: '#4A2C2A', unit: '' },
    { label: 'Active Users', value: 0, icon: '👥', color: '#FF6B35', unit: '' },
    { label: 'Trending Now', value: 0, icon: '🔥', color: '#F39C12', unit: '' },
    { label: 'Happy Customers', value: 0, icon: '😊', color: '#4A7C59', unit: '%' },
  ]);

  const [recentOrders, setRecentOrders] = useState<string[]>([]);
  const [trendingDrink, setTrendingDrink] = useState('Caramel Latte');

  const fetchUserStats = useCallback(async () => {
    try {
      const data = await api.stats.get();
      if (data) setUserStats(data);
    } catch { /* not logged in */ }
  }, []);

  useEffect(() => {
    fetchUserStats();
    const poll = setInterval(fetchUserStats, 30000);
    return () => clearInterval(poll);
  }, [fetchUserStats]);

  // Simulate live cafe activity
  useEffect(() => {
    const timeout = setTimeout(() => {
      setStats([
        { label: 'Orders Today', value: 247, icon: '☕', color: '#4A2C2A' },
        { label: 'Active Users', value: 38, icon: '👥', color: '#FF6B35' },
        { label: 'Trending Now', value: 15, icon: '🔥', color: '#F39C12' },
        { label: 'Happy Customers', value: 98, icon: '😊', color: '#4A7C59', unit: '%' },
      ]);
    }, 500);

    const interval = setInterval(() => {
      setStats(prev => [
        { ...prev[0], value: prev[0].value + Math.floor(Math.random() * 3) },
        { ...prev[1], value: Math.max(20, prev[1].value + Math.floor(Math.random() * 5) - 2) },
        prev[2],
        prev[3],
      ]);
      const drinks = ['Caramel Latte', 'Espresso', 'Cappuccino', 'Mocha', 'Americano', 'Flat White'];
      setRecentOrders(prev => [drinks[Math.floor(Math.random() * drinks.length)], ...prev].slice(0, 5));
      if (Math.random() > 0.7) setTrendingDrink(drinks[Math.floor(Math.random() * drinks.length)]);
    }, 3000);

    return () => { clearTimeout(timeout); clearInterval(interval); };
  }, []);

  return (
    <Card glass glowOnHover>
      <div className="flex flex-col gap-lg">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-h2 font-bold text-text-primary">Live Activity</h3>
            <p className="text-body-sm text-text-secondary">Real-time cafe stats</p>
          </div>
          <motion.div
            className="flex items-center gap-2 px-3 py-1 rounded-pill bg-green-100"
            animate={{
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-body-xs font-semibold text-green-700">LIVE</span>
          </motion.div>
        </div>

        {/* User Stats Section */}
        {userStats && (
          <motion.div
            className="p-4 rounded-2xl bg-primary/5 border border-primary/10 mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🏆</span>
                <span className="text-body-sm font-bold text-primary">Your Progress</span>
              </div>
              <span className="text-body-xs font-bold text-secondary uppercase">Level {userStats.level}</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-h3 font-black text-text-primary">{userStats.xp.toLocaleString()}</p>
                <p className="text-body-xs text-text-secondary uppercase">Total XP</p>
              </div>
              <div className="text-center border-x border-primary/10">
                <p className="text-h3 font-black text-primary">{userStats.points.toLocaleString()}</p>
                <p className="text-body-xs text-text-secondary uppercase">Points</p>
              </div>
              <div className="text-center">
                <p className="text-h3 font-black text-secondary">{userStats.streak_days}d</p>
                <p className="text-body-xs text-text-secondary uppercase">Streak</p>
              </div>
            </div>
            {/* Progress Bar */}
            <div className="mt-3">
              <div className="flex justify-between text-body-xs mb-1">
                <span className="text-text-secondary">Progress to Level {userStats.level + 1}</span>
                <span className="text-primary font-bold">{userStats.xp % 500} / 500 XP</span>
              </div>
              <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${(userStats.xp % 500) / 5}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="rounded-xl p-md text-center"
              style={{ backgroundColor: `${stat.color}10` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
            >
              <motion.div
                className="text-4xl mb-2"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              >
                {stat.icon}
              </motion.div>
              <motion.div
                className="text-h2 font-bold mb-1"
                style={{ color: stat.color }}
                key={stat.value}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring' }}
              >
                {stat.value}{stat.unit}
              </motion.div>
              <p className="text-body-sm text-text-secondary">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders & Trending */}
        <div className="grid lg:grid-cols-2 gap-md">
          {/* Recent Orders */}
          <div className="rounded-xl bg-surface p-md">
            <h4 className="text-body-lg font-semibold text-text-primary mb-sm flex items-center gap-2">
              <span>🔔</span>
              Recent Orders
            </h4>
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {recentOrders.slice(0, 4).map((drink, index) => (
                  <motion.div
                    key={`${drink}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-2 p-sm rounded-lg bg-background"
                  >
                    <span className="text-body-sm">☕</span>
                    <span className="text-body-sm text-text-primary flex-1">{drink}</span>
                    <span className="text-body-xs text-text-secondary">Just now</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Trending Drink */}
          <div className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-md">
            <h4 className="text-body-lg font-semibold text-text-primary mb-sm flex items-center gap-2">
              <motion.span
                animate={{
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                }}
              >
                🔥
              </motion.span>
              Trending Now
            </h4>
            <AnimatePresence mode="wait">
              <motion.div
                key={trendingDrink}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center py-md"
              >
                <div className="text-5xl mb-2">☕</div>
                <p className="text-h3 font-bold text-primary mb-1">{trendingDrink}</p>
                <p className="text-body-sm text-text-secondary">15+ orders in last hour</p>
                <motion.button
                  className="mt-md px-4 py-2 rounded-lg bg-primary text-surface text-body-sm font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Order Now
                </motion.button>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Card>
  );
}
