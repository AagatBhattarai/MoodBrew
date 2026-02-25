import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Badge } from './Badge';

export function CoffeePourHero() {
  const [timeOfDay, setTimeOfDay] = useState('morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setTimeOfDay('morning');
    else if (hour < 17) setTimeOfDay('afternoon');
    else setTimeOfDay('evening');
  }, []);

  const drinks = {
    morning: { name: 'Morning Espresso', adjective: 'revitalizing', color: '#4A2C2A' },
    afternoon: { name: 'Afternoon Latte', adjective: 'silky-smooth', color: '#6F4E37' },
    evening: { name: 'Evening Mocha', adjective: 'comforting', color: '#3E2723' },
  };

  const currentDrink = drinks[timeOfDay as keyof typeof drinks];

  return (
    <div className="relative min-h-[500px] overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary/10 via-background to-secondary/10 border border-primary/5 shadow-elevated p-8 md:p-12 lg:p-16">
      {/* 🌪️ Dynamic Ambient Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <motion.div
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[100px]"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-secondary/20 rounded-full blur-[100px]"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center h-full">
        {/* 📝 Left Content: Cinematic Typography */}
        <motion.div
          className="flex flex-col items-start gap-6"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge variant="discount" className="px-4 py-1.5 text-body-xs font-black tracking-widest uppercase">
              ✨ {timeOfDay} Ritual
            </Badge>
          </motion.div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-text-primary leading-[1.1] font-playfair">
            Your Perfect <br />
            <span className="gradient-text-animated">
              {currentDrink.name}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-text-secondary max-w-lg leading-relaxed">
            Experience the {currentDrink.adjective} notes of ethically sourced beans,
            handcrafted for your {timeOfDay} mood.
          </p>

          <Button
            className="px-10 py-5 text-xl font-bold rounded-2xl shadow-elevated pulse-glow mt-2"
          >
            Order Now →
          </Button>
        </motion.div>

        {/* ☕ Right Content: Aesthetic cup */}
        <motion.div
          className="relative flex justify-center lg:justify-end"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
            {/* Ambient Shadow */}
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-[60px]" />

            <motion.div
              className="relative text-[10rem] md:text-[14rem] drop-shadow-2xl"
              animate={{
                y: [0, -15, 0],
                rotate: [0, 2, -2, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              ☕

              {/* Orbital Stars */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute text-2xl md:text-3xl"
                  style={{
                    left: `${50 + Math.cos(i * 60 * Math.PI / 180) * 80}%`,
                    top: `${50 + Math.sin(i * 60 * Math.PI / 180) * 80}%`,
                  }}
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 0.7, 0],
                    rotate: [0, 180],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                >
                  ✨
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
