import { motion } from 'framer-motion';
import { Coffee, ShoppingBag, MapPin, Trophy, User } from 'lucide-react';
import { useStore } from '@/store';

export function BottomNav() {
  const { setView, currentView } = useStore();

  const navItems = [
    { id: 'home', icon: Coffee, label: 'Home' },
    { id: 'products', icon: ShoppingBag, label: 'Discover' },
    { id: 'cafes', icon: MapPin, label: 'Cafes' },
    { id: 'rankings', icon: Trophy, label: 'Rankings' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      <div className="glass mx-4 mb-4 rounded-2xl">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => setView(item.id as any)}
                className="relative flex flex-col items-center gap-1 px-4 py-2"
                whileTap={{ scale: 0.9 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="bottom-nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-xl"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative z-10">
                  <Icon 
                    className={`w-5 h-5 transition-colors ${
                      isActive ? 'text-amber-400' : 'text-white/50'
                    }`} 
                  />
                </div>
                <span 
                  className={`relative z-10 text-xs font-medium transition-colors ${
                    isActive ? 'text-amber-400' : 'text-white/50'
                  }`}
                >
                  {item.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
