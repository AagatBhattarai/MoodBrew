import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';

interface WeatherData {
  condition: string;
  temp: number;
  icon: string;
  recommendation: string;
  drinks: string[];
}

export function WeatherRecommendations() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate weather API call
    // In production, use: https://api.openweathermap.org/data/2.5/weather
    const fetchWeather = async () => {
      setIsLoading(true);
      
      // Mock data based on random conditions
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const conditions = [
        {
          condition: 'Sunny',
          temp: 28,
          icon: '☀️',
          recommendation: "It's hot outside! Cool down with...",
          drinks: ['Iced Latte', 'Cold Brew', 'Frappuccino'],
        },
        {
          condition: 'Rainy',
          temp: 18,
          icon: '🌧️',
          recommendation: "Perfect weather for a warm drink!",
          drinks: ['Hot Chocolate', 'Cappuccino', 'Chai Latte'],
        },
        {
          condition: 'Cloudy',
          temp: 22,
          icon: '☁️',
          recommendation: "Cozy weather calls for...",
          drinks: ['Americano', 'Latte', 'Mocha'],
        },
        {
          condition: 'Cold',
          temp: 12,
          icon: '🥶',
          recommendation: "Warm up with our specialty...",
          drinks: ['Espresso', 'Flat White', 'Caramel Macchiato'],
        },
      ];

      const randomWeather = conditions[Math.floor(Math.random() * conditions.length)];
      setWeather(randomWeather);
      setIsLoading(false);
    };

    fetchWeather();
  }, []);

  if (isLoading) {
    return (
      <Card glass>
        <div className="flex items-center gap-md">
          <motion.div
            className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <div>
            <p className="text-body-lg font-semibold text-text-primary">Checking weather...</p>
            <p className="text-body-sm text-text-secondary">Finding perfect drinks for you</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!weather) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        <Card glass glowOnHover className="relative overflow-hidden">
          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/10 to-accent/5"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% 200%',
            }}
          />

          <div className="relative z-10 flex flex-col gap-md">
            {/* Weather Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-md">
                <motion.div
                  className="text-6xl"
                  animate={{
                    scale: [1, 1.2, 1],
                    rotate: weather.condition === 'Sunny' ? [0, 360] : [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  {weather.icon}
                </motion.div>
                <div>
                  <h3 className="text-h3 font-bold text-text-primary">{weather.condition}</h3>
                  <p className="text-body-lg text-text-secondary">{weather.temp}°C</p>
                </div>
              </div>

              <motion.div
                className="px-4 py-2 rounded-pill bg-primary/10"
                whileHover={{ scale: 1.05 }}
              >
                <span className="text-body-sm font-semibold text-primary">Live Weather</span>
              </motion.div>
            </div>

            {/* Recommendation */}
            <div className="flex flex-col gap-sm">
              <p className="text-body-lg text-text-primary font-semibold">
                {weather.recommendation}
              </p>

              {/* Drink suggestions */}
              <div className="flex gap-sm flex-wrap">
                {weather.drinks.map((drink, index) => (
                  <motion.button
                    key={drink}
                    className="px-md py-2 rounded-lg bg-surface border border-primary/20 hover:border-primary/40 transition"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, type: 'spring' }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-body-md font-semibold text-text-primary">{drink}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Call to action */}
            <motion.div
              className="flex items-center gap-2 text-body-sm text-primary"
              animate={{
                x: [0, 5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              <span className="font-semibold">Order now</span>
              <span>→</span>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
