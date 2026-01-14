import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function CoffeePourHero() {
  const [timeOfDay, setTimeOfDay] = useState('morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  const drinks = {
    morning: { name: 'Morning Espresso', color: '#4A2C2A' },
    afternoon: { name: 'Afternoon Latte', color: '#6F4E37' },
    evening: { name: 'Evening Mocha', color: '#3E2723' },
  };

  const currentDrink = drinks[timeOfDay as keyof typeof drinks];

  return (
    <div className="relative h-[400px] overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10">
      {/* Background Steam */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-32 h-32 rounded-full blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            left: `${20 + i * 15}%`,
            bottom: '30%',
          }}
          animate={{
            y: [0, -100, -200],
            opacity: [0, 0.5, 0],
            scale: [0.5, 1, 1.5],
          }}
          transition={{
            duration: 3 + i,
            repeat: Infinity,
            delay: i * 0.5,
            ease: 'easeOut',
          }}
        />
      ))}

      <div className="relative z-10 flex items-center justify-between h-full px-xl">
        {/* Left: Text Content */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block px-4 py-2 rounded-pill bg-primary/10 mb-4"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <span className="text-body-sm font-semibold text-primary">
              ✨ Perfect for {timeOfDay}
            </span>
          </motion.div>
          
          <h1 className="text-6xl font-bold text-text-primary mb-4 leading-tight">
            Your Perfect
            <br />
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              {currentDrink.name}
            </span>
          </h1>
          
          <p className="text-body-lg text-text-secondary mb-6 max-w-md">
            Handcrafted with love, brewed to perfection, served with a smile ☕
          </p>

          <motion.button
            className="px-8 py-4 rounded-xl bg-primary text-surface font-semibold text-body-lg shadow-lg"
            whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(74, 44, 42, 0.3)' }}
            whileTap={{ scale: 0.95 }}
          >
            Order Now →
          </motion.button>
        </motion.div>

        {/* Right: Animated Coffee Cup */}
        <motion.div
          className="relative w-64 h-64"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Cup */}
          <motion.div
            className="absolute inset-0"
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            {/* Coffee Cup SVG */}
            <div className="relative w-full h-full flex items-center justify-center">
              <motion.div
                className="text-9xl"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                ☕
              </motion.div>

              {/* Pour Animation */}
              <motion.div
                className="absolute -top-12 left-1/2 transform -translate-x-1/2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <svg width="40" height="80" viewBox="0 0 40 80">
                  <motion.path
                    d="M20 0 Q15 40, 20 80"
                    fill="none"
                    stroke={currentDrink.color}
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 1, 0], opacity: [0, 1, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </svg>
              </motion.div>

              {/* Sparkles */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl"
                  style={{
                    left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 100}px`,
                    top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 100}px`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0],
                    rotate: [0, 180, 360],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
