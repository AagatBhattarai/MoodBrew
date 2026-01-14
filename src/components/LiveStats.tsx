import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';

interface Stat {
  label: string;
  value: number;
  icon: string;
  color: string;
  unit?: string;
}

export function LiveStats() {
  const [stats, setStats] = useState<Stat[]>([
    { label: 'Orders Today', value: 0, icon: '☕', color: '#4A2C2A', unit: '' },
    { label: 'Active Users', value: 0, icon: '👥', color: '#FF6B35', unit: '' },
    { label: 'Trending Now', value: 0, icon: '🔥', color: '#F39C12', unit: '' },
    { label: 'Happy Customers', value: 0, icon: '😊', color: '#4A7C59', unit: '%' },
  ]);

  const [recentOrders, setRecentOrders] = useState<string[]>([]);
  const [trendingDrink, setTrendingDrink] = useState('Caramel Latte');

  // Simulate live updates
  useEffect(() => {
    // Animate initial values
    const timeout = setTimeout(() => {
      setStats([
        { label: 'Orders Today', value: 247, icon: '☕', color: '#4A2C2A' },
        { label: 'Active Users', value: 38, icon: '👥', color: '#FF6B35' },
        { label: 'Trending Now', value: 15, icon: '🔥', color: '#F39C12' },
        { label: 'Happy Customers', value: 98, icon: '😊', color: '#4A7C59', unit: '%' },
      ]);
    }, 500);

    // Simulate real-time order updates
    const interval = setInterval(() => {
      setStats(prev => [
        { ...prev[0], value: prev[0].value + Math.floor(Math.random() * 3) },
        { ...prev[1], value: Math.max(20, prev[1].value + Math.floor(Math.random() * 5) - 2) },
        prev[2],
        prev[3],
      ]);

      // Add random orders
      const drinks = [
        'Caramel Latte',
        'Espresso',
        'Cappuccino',
        'Mocha',
        'Americano',
        'Flat White',
      ];
      const randomDrink = drinks[Math.floor(Math.random() * drinks.length)];
      setRecentOrders(prev => [randomDrink, ...prev].slice(0, 5));
      
      // Update trending
      if (Math.random() > 0.7) {
        setTrendingDrink(drinks[Math.floor(Math.random() * drinks.length)]);
      }
    }, 3000);

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
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
