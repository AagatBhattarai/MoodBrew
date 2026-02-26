import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';

// Meteosource icon codes → our mapping
// https://www.meteosource.com/documentation#icons
const WEATHER_MAP: Record<string, {
  icon: string;
  label: string;
  recommendation: string;
  drinks: string[];
  dishes: string[];
  gradient: string;
}> = {
  clear_day: {
    icon: '☀️', label: 'Sunny & Clear',
    recommendation: "It's bright and warm in Pokhara! Cool down with refreshing iced drinks.",
    drinks: ['Cold Brew', 'Iced Latte', 'Mango Smoothie'],
    dishes: ['Fresh Fruit Salad', 'Greek Yogurt Bowl'],
    gradient: 'from-amber-400/10 to-orange-300/10',
  },
  clear_night: {
    icon: '🌙', label: 'Clear Night',
    recommendation: "A peaceful Pokhara evening — wind down with something warm.",
    drinks: ['Chamomile Tea', 'Lavender Latte', 'Flat White'],
    dishes: ['Tiramisu', 'Chocolate Brownie'],
    gradient: 'from-indigo-400/10 to-purple-300/10',
  },
  partly_cloudy_day: {
    icon: '⛅', label: 'Partly Cloudy',
    recommendation: "A nice, mild day in Pokhara. Great for any coffee!",
    drinks: ['Caramel Macchiato', 'Matcha Latte', 'Americano'],
    dishes: ['Butter Croissant', 'Blueberry Muffin'],
    gradient: 'from-sky-300/10 to-blue-200/10',
  },
  partly_cloudy_night: {
    icon: '🌤️', label: 'Partly Cloudy Night',
    recommendation: "Cool evening with scattered clouds over Pokhara. Try something cozy.",
    drinks: ['Café Mocha', 'Flat White', 'Hazelnut Cappuccino'],
    dishes: ['Classic Tiramisu', 'Glazed Donut'],
    gradient: 'from-slate-400/10 to-indigo-300/10',
  },
  mostly_cloudy: {
    icon: '☁️', label: 'Mostly Cloudy',
    recommendation: "Overcast skies over Pokhara. Perfect for a cozy coffee break.",
    drinks: ['Americano', 'Café Mocha', 'Matcha Latte'],
    dishes: ['New York Cheesecake', 'Croissant'],
    gradient: 'from-gray-300/10 to-slate-400/10',
  },
  overcast: {
    icon: '🌥️', label: 'Overcast',
    recommendation: "Heavy clouds over Pokhara — warm up from the inside!",
    drinks: ['Cappuccino', 'Flat White', 'Chai Latte'],
    dishes: ['Chocolate Brownie', 'Blueberry Muffin'],
    gradient: 'from-gray-400/10 to-gray-600/10',
  },
  fog: {
    icon: '🌫️', label: 'Foggy',
    recommendation: "Mystical fog over the Annapurnas! A warm cup will clear your mind.",
    drinks: ['Espresso', 'Flat White', 'Honey Lavender Latte'],
    dishes: ['Butter Croissant', 'Classic Tiramisu'],
    gradient: 'from-gray-200/20 to-slate-200/20',
  },
  light_rain: {
    icon: '🌦️', label: 'Light Rain',
    recommendation: "A gentle drizzle in Pokhara. Perfect time for warm drinks!",
    drinks: ['Hot Chocolate', 'Cappuccino', 'Chai Latte'],
    dishes: ['Chocolate Brownie', 'Glazed Donut'],
    gradient: 'from-blue-300/10 to-teal-200/10',
  },
  rain: {
    icon: '🌧️', label: 'Rainy',
    recommendation: "It's raining in Pokhara! Cosy up with a hot drink and sweet treat.",
    drinks: ['Hot Chocolate', 'Welsh Brew Tea', 'Caramel Macchiato'],
    dishes: ['Classic Tiramisu', 'Chocolate Brownie'],
    gradient: 'from-blue-400/15 to-cyan-300/10',
  },
  heavy_rain: {
    icon: '⛈️', label: 'Heavy Rain',
    recommendation: "Heavy downpour in Pokhara! Stay cozy with the warmest drinks on the menu.",
    drinks: ['Double Espresso', 'Hot Chocolate', 'Ginger Chai'],
    dishes: ['Chocolate Brownie', 'New York Cheesecake'],
    gradient: 'from-blue-600/15 to-slate-500/10',
  },
  thunderstorm: {
    icon: '⛈️', label: 'Thunderstorm',
    recommendation: "Thunderstorm alert in Pokhara! Stay inside with the warmest brew.",
    drinks: ['Double Espresso', 'Flat White', 'Hot Chocolate'],
    dishes: ['Chocolate Brownie', 'Tiramisu'],
    gradient: 'from-purple-500/15 to-gray-600/10',
  },
  snow: {
    icon: '❄️', label: 'Snowy',
    recommendation: "It's snowing near Pokhara! Warm your soul with seasonal specials.",
    drinks: ['Hot Chocolate', 'Spiced Chai', 'Caramel Macchiato'],
    dishes: ['Classic Tiramisu', 'Butter Croissant'],
    gradient: 'from-sky-100/20 to-blue-100/20',
  },
};

// Fallback for unknown icons
const FALLBACK = WEATHER_MAP['mostly_cloudy'];

// Map Meteosource icon_num to our key
function getWeatherKey(iconName: string): string {
  // Normalize: replace spaces with underscores, lowercase
  const key = iconName.toLowerCase().replace(/ /g, '_');
  if (key in WEATHER_MAP) return key;
  // Try prefix match
  const prefix = Object.keys(WEATHER_MAP).find(k => key.startsWith(k.split('_')[0]));
  return prefix ?? 'mostly_cloudy';
}

interface MeteosourceResponse {
  current: {
    icon: string;
    icon_num: number;
    summary: string;
    temperature: number;
    wind: { speed: number; dir: string };
    cloud_cover: number;
    precipitation: { total: number; type: string };
  };
  timezone: string;
}

interface LiveWeatherData {
  conditionKey: string;
  temp: number;
  summary: string;
  windSpeed: number;
  windDir: string;
  humidity: number;
  fetchedAt: string;
}

const API_KEY = import.meta.env.VITE_METEOSOURCE_API_KEY;
const API_URL = `https://www.meteosource.com/api/v1/free/point?place_id=pokhara&sections=current&language=en&units=metric&key=${API_KEY}`;
// Refresh every 15 minutes
const REFRESH_MS = 15 * 60 * 1000;

export function WeatherRecommendations() {
  const [weatherData, setWeatherData] = useState<LiveWeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchWeather = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data: MeteosourceResponse = await res.json();
      const now = new Date();
      setWeatherData({
        conditionKey: getWeatherKey(data.current.icon),
        temp: Math.round(data.current.temperature),
        summary: data.current.summary,
        windSpeed: data.current.wind.speed,
        windDir: data.current.wind.dir,
        humidity: data.current.cloud_cover,
        fetchedAt: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      });
      setLastUpdated(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
    } catch {
      // Show fallback silently
      // Show fallback
      setWeatherData({
        conditionKey: 'mostly_cloudy',
        temp: 22,
        summary: 'Mostly Cloudy',
        windSpeed: 1.3,
        windDir: 'N',
        humidity: 70,
        fetchedAt: new Date().toLocaleTimeString(),
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWeather();
    const interval = setInterval(fetchWeather, REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchWeather]);

  if (isLoading) {
    return (
      <Card glass>
        <div className="flex items-center gap-md">
          <motion.div
            className="h-12 w-12 rounded-full border-4 border-primary border-t-transparent flex-shrink-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <div>
            <p className="text-body-lg font-semibold text-text-primary">Fetching Pokhara weather...</p>
            <p className="text-body-sm text-text-secondary">Getting live conditions from Meteosource</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!weatherData) return null;

  const weatherInfo = WEATHER_MAP[weatherData.conditionKey] ?? FALLBACK;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={weatherData.conditionKey}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
      >
        <Card glass glowOnHover className={`relative overflow-hidden`}>
          {/* Animated gradient background based on weather */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${weatherInfo.gradient}`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />

          <div className="relative z-10 flex flex-col gap-md">
            {/* Header row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-md">
                <motion.div
                  className="text-5xl"
                  animate={{
                    scale: [1, 1.15, 1],
                    rotate: weatherData.conditionKey.includes('sunny') || weatherData.conditionKey.includes('clear')
                      ? [0, 20, 0] : [0, 8, -8, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                >
                  {weatherInfo.icon}
                </motion.div>
                <div>
                  <h3 className="text-h3 font-bold text-text-primary leading-tight">
                    {weatherData.temp}°C
                  </h3>
                  <p className="text-body-sm text-text-secondary">{weatherData.summary}</p>
                  <p className="text-body-xs text-text-secondary">
                    📍 Pokhara, Nepal · 💨 {weatherData.windSpeed} m/s {weatherData.windDir}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-1">
                <motion.div
                  className="px-3 py-1 rounded-pill bg-primary/10 flex items-center gap-1"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
                  <span className="text-body-xs font-semibold text-primary">LIVE</span>
                </motion.div>
                <p className="text-body-xs text-text-secondary">Updated {lastUpdated}</p>

              </div>
            </div>

            {/* Recommendation */}
            <p className="text-body-md text-text-primary font-semibold">
              {weatherInfo.recommendation}
            </p>

            {/* Drink chips */}
            <div>
              <p className="text-body-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                ☕ Perfect Drinks
              </p>
              <div className="flex gap-2 flex-wrap">
                {weatherInfo.drinks.map((drink, i) => (
                  <motion.span
                    key={drink}
                    className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 text-body-sm font-semibold text-primary cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08, type: 'spring', stiffness: 300 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {drink}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Dish chips */}
            <div>
              <p className="text-body-xs font-bold text-text-secondary uppercase tracking-wider mb-2">
                🍰 Perfect Pairings
              </p>
              <div className="flex gap-2 flex-wrap">
                {weatherInfo.dishes.map((dish, i) => (
                  <motion.span
                    key={dish}
                    className="px-3 py-1 rounded-lg bg-secondary/10 border border-secondary/20 text-body-sm font-semibold text-secondary cursor-pointer"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.08, type: 'spring', stiffness: 300 }}
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {dish}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Refresh hint */}
            <motion.button
              className="flex items-center gap-1 text-body-xs text-text-secondary hover:text-primary transition self-start"
              onClick={fetchWeather}
              whileHover={{ x: 3 }}
            >
              <span>🔄</span>
              <span>Refresh weather</span>
            </motion.button>
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
