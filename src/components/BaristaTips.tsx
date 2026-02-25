import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';

const tips = [
  {
    tip: 'Coffee tastes best when brewed between 195–205°F!',
    barista: 'Chef Marco',
    icon: '🌡️',
    funFact: 'Water that is too hot over-extracts the beans, making it bitter.',
    didYouKnow: 'Ideal brew temp is just below boiling.',
  },
  {
    tip: 'Store your beans in an airtight container away from light.',
    barista: 'Sarah the Barista',
    icon: '☕',
    funFact: 'Exposure to air, light and moisture are coffee\'s biggest enemies.',
    didYouKnow: 'Never freeze freshly roasted beans — it damages the oils.',
  },
  {
    tip: 'Try our pour-over method for the cleanest flavor profile.',
    barista: 'Master Chen',
    icon: '💧',
    funFact: 'Pour-over extraction highlights floral and fruity notes in single-origins.',
    didYouKnow: 'A slow, circular pour creates an even extraction.',
  },
  {
    tip: 'Fresh beans are best used within 2–3 weeks of roasting.',
    barista: 'Emma',
    icon: '📅',
    funFact: 'CO₂ released from fresh beans is what creates that beautiful crema.',
    didYouKnow: 'Look for a roast date, not just an expiry date.',
  },
  {
    tip: 'Use filtered water for the best tasting coffee.',
    barista: 'Chef Marco',
    icon: '💎',
    funFact: 'Coffee is 98% water — its quality matters enormously.',
    didYouKnow: 'Soft water highlights sweetness; hard water adds body.',
  },
];

const brewStats = [
  { label: 'Brews Today', value: '127', icon: '☕' },
  { label: 'Happy Customers', value: '94%', icon: '😊' },
  { label: 'Avg Rating', value: '4.9★', icon: '⭐' },
];

export function BaristaTips() {
  const [currentTip, setCurrentTip] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const tip = tips[currentTip];

  return (
    <Card glass className="bg-gradient-to-br from-primary/5 to-secondary/5 h-full">
      <div className="flex flex-col h-full gap-4">

        {/* Header */}
        <div className="flex items-start gap-4">
          <motion.div
            className="text-5xl flex-shrink-0"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            👨‍🍳
          </motion.div>

          <div className="flex-1">
            <p className="text-body-sm font-semibold text-primary mb-1">💡 Barista Tip</p>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentTip}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4 }}
              >
                <p className="text-body-md font-semibold text-text-primary mb-1">
                  {tip.icon} {tip.tip}
                </p>
                <p className="text-body-sm text-text-secondary">— {tip.barista}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Fun Fact Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`fact-${currentTip}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-xl bg-primary/8 border border-primary/15 p-4"
          >
            <p className="text-body-xs font-bold text-primary uppercase tracking-wider mb-1">🔬 Why it matters</p>
            <p className="text-body-sm text-text-primary">{tip.funFact}</p>
          </motion.div>
        </AnimatePresence>

        {/* Did You Know */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`know-${currentTip}`}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="rounded-xl bg-secondary/8 border border-secondary/15 p-4"
          >
            <p className="text-body-xs font-bold text-secondary uppercase tracking-wider mb-1">✨ Did you know?</p>
            <p className="text-body-sm text-text-primary">{tip.didYouKnow}</p>
          </motion.div>
        </AnimatePresence>

        {/* Live Brew Stats */}
        <div className="grid grid-cols-3 gap-3 mt-auto">
          {brewStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center p-3 rounded-xl bg-surface border border-background text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.04, y: -2 }}
            >
              <span className="text-xl mb-1">{stat.icon}</span>
              <p className="text-body-lg font-black gradient-text">{stat.value}</p>
              <p className="text-body-xs text-text-secondary leading-tight">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="flex gap-1">
          {tips.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => setCurrentTip(index)}
              className={`h-1.5 rounded-full transition-all ${index === currentTip ? 'bg-primary w-8' : 'bg-background w-4'
                }`}
              animate={index === currentTip ? { scaleX: [0, 1] } : {}}
              transition={{ duration: 5 }}
            />
          ))}
        </div>

      </div>
    </Card>
  );
}
