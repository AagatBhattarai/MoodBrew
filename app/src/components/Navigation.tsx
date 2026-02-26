import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, User, LogOut, MapPin, ShoppingBag, Trophy, Menu, X } from 'lucide-react';
import { useStore } from '@/store';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export function Navigation() {
  const { user, logout, setView, currentView, cart } = useStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home', icon: Coffee },
    { id: 'products', label: 'Discover', icon: ShoppingBag },
    { id: 'cafes', label: 'Cafes', icon: MapPin },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'rankings', label: 'Rankings', icon: Trophy },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const cartItemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="glass">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <motion.button
                onClick={() => setView('home')}
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <Coffee className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gradient">MoodBrew</span>
              </motion.button>

              {/* Nav Links */}
              <div className="flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id || 
                    (item.id === 'orders' && currentView === 'orders');
                  
                  return (
                    <motion.button
                      key={item.id}
                      onClick={() => setView(item.id as any)}
                      className={`relative px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors ${
                        isActive 
                          ? 'text-white' 
                          : 'text-white/60 hover:text-white/90'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="nav-pill"
                          className="absolute inset-0 bg-white/10 rounded-lg"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      <span className="relative z-10 flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        {item.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* User Actions */}
              <div className="flex items-center gap-3">
                {/* Cart Button */}
                <motion.button
                  onClick={() => setView('orders')}
                  className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ShoppingBag className="w-5 h-5 text-white/80" />
                  {cartItemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full text-xs font-bold flex items-center justify-center text-white"
                    >
                      {cartItemCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* User Menu */}
                <div className="flex items-center gap-3 pl-4 border-l border-white/10">
                  <Avatar className="w-9 h-9 border-2 border-white/20">
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white text-sm font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden lg:block">
                    <p className="text-sm font-medium text-white">{user?.name}</p>
                    <p className="text-xs text-white/50">Level {user?.stats.level}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="text-white/60 hover:text-white hover:bg-white/10"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 md:hidden">
        <div className="glass px-4 py-3">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => setView('home')}
              className="flex items-center gap-2"
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                <Coffee className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-gradient">MoodBrew</span>
            </motion.button>

            <div className="flex items-center gap-2">
              <motion.button
                onClick={() => setView('orders')}
                className="relative p-2 rounded-lg hover:bg-white/10"
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag className="w-5 h-5 text-white/80" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full text-xs font-bold flex items-center justify-center text-white">
                    {cartItemCount}
                  </span>
                )}
              </motion.button>

              <motion.button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg hover:bg-white/10"
                whileTap={{ scale: 0.95 }}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-white" />
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="glass mx-4 mt-2 rounded-2xl overflow-hidden"
            >
              <div className="p-4">
                {/* User Info */}
                <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10">
                  <Avatar className="w-12 h-12 border-2 border-white/20">
                    <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-semibold">
                      {user?.name?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-white">{user?.name}</p>
                    <p className="text-sm text-white/50">Level {user?.stats.level} • {user?.stats.points} pts</p>
                  </div>
                </div>

                {/* Nav Items */}
                <div className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentView === item.id;
                    
                    return (
                      <motion.button
                        key={item.id}
                        onClick={() => {
                          setView(item.id as any);
                          setIsMenuOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                          isActive 
                            ? 'bg-white/10 text-white' 
                            : 'text-white/60 hover:bg-white/5 hover:text-white/90'
                        }`}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{item.label}</span>
                        {isActive && (
                          <motion.div
                            layoutId="mobile-nav-indicator"
                            className="ml-auto w-2 h-2 rounded-full bg-amber-500"
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>

                {/* Logout */}
                <motion.button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 mt-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                  whileTap={{ scale: 0.98 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Logout</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
