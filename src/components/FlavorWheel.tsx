import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';
import { Badge } from './Badge';

interface FlavorProfile {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  drinks: string[];
}

const flavorProfiles: FlavorProfile[] = [
  {
    id: 'sweet',
    name: 'Sweet',
    icon: '🍯',
    color: '#D4A373', // Warm Honey
    description: 'Rich, sugary notes with caramel and honey undertones',
    drinks: ['Caramel Latte', 'Vanilla Frappuccino', 'Honey Mocha'],
  },
  {
    id: 'bitter',
    name: 'Bitter',
    icon: '☕',
    color: '#3F2305', // Deep Coffee
    description: 'Bold, intense and sophisticated coffee flavor',
    drinks: ['Espresso', 'Americano', 'Double Ristretto'],
  },
  {
    id: 'nutty',
    name: 'Nutty',
    icon: '🌰',
    color: '#603808', // Roasted Nut
    description: 'Warm hazelnut, almond and toasted macadamia notes',
    drinks: ['Hazelnut Latte', 'Almond Cappuccino', 'Pistachio Brew'],
  },
  {
    id: 'fruity',
    name: 'Fruity',
    icon: '🍒',
    color: '#9E2A2B', // Berry Red
    description: 'Bright, tangy with summer berry and citrus hints',
    drinks: ['Berry Iced Tea', 'Lemon Cold Brew', 'Cherry Mocha'],
  },
  {
    id: 'chocolatey',
    name: 'Chocolatey',
    icon: '🍫',
    color: '#4B2E1E', // Dark Cocoa
    description: 'Indulgent smooth chocolate richness',
    drinks: ['Hot Cocoa', 'Swiss Mocha', 'Cocoa Flat White'],
  },
  {
    id: 'spicy',
    name: 'Spicy',
    icon: '🌶️',
    color: '#BC3908', // Spice Orange
    description: 'Warming spices like cinnamon, ginger and cardamom',
    drinks: ['Chai Latte', 'Spiced Mocha', 'Mexican Hot Cocoa'],
  },
];

export function FlavorWheel() {
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorProfile | null>(null);
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const angleStep = 360 / flavorProfiles.length;

  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    const extraSpins = 3 + Math.floor(Math.random() * 5); // 3-8 full rotations
    const randomFlavorIndex = Math.floor(Math.random() * flavorProfiles.length);
    const newRotation = rotation + (extraSpins * 360) + (randomFlavorIndex * angleStep);

    setRotation(newRotation);

    setTimeout(() => {
      setIsSpinning(false);
      // The current active flavor is determined by the final rotation
      // Since rotation is cumulative, we use % 360
      const finalNormalizedRotation = newRotation % 360;
      const index = Math.round(finalNormalizedRotation / angleStep) % flavorProfiles.length;
      setSelectedFlavor(flavorProfiles[index]);
    }, 2000); // Match CSS transition time
  }, [rotation, angleStep, isSpinning]);

  return (
    <Card glass glowOnHover className="relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-xl relative z-10">
        <div className="text-center">
          <Badge variant="discount" className="mb-4">Taste Exploration</Badge>
          <h3 className="text-h1 font-bold text-text-primary mb-2 font-playfair">Discover Your Profile</h3>
          <p className="text-body-lg text-text-secondary max-w-lg mx-auto">
            Interactive flavor exploration. Tap a profile or spin the wheel to find your next favorite brew.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Flavor Wheel Container */}
          <div className="flex flex-col items-center gap-8">
            <div className="relative w-[320px] h-[320px] md:w-[400px] md:h-[400px] flex items-center justify-center">
              {/* Main Outer Wheel */}
              <motion.div
                className="absolute inset-0 rounded-full p-1"
                style={{
                  background: 'linear-gradient(45deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1), inset 0 0 20px rgba(255,255,255,0.05)'
                }}
                animate={{ rotate: rotation }}
                transition={isSpinning ? { duration: 2, ease: [0.45, 0.05, 0.55, 0.95] } : { type: 'spring', stiffness: 30 }}
              >
                {/* Visual Segments (Dashed border look) */}
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-white/10" />

                {/* Flavor Profile Buttons */}
                {flavorProfiles.map((flavor, index) => {
                  const angle = index * angleStep;
                  const radians = (angle * Math.PI) / 180;
                  const radius = 135; // Position on the wheel
                  const x = Math.cos(radians) * radius;
                  const y = Math.sin(radians) * radius;

                  const isActive = selectedFlavor?.id === flavor.id;

                  return (
                    <motion.button
                      key={flavor.id}
                      className="absolute top-1/2 left-1/2 -ml-8 -mt-8 z-20"
                      style={{ x, y }}
                      onClick={() => !isSpinning && setSelectedFlavor(flavor)}
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <div
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 ${isActive ? 'shadow-lg scale-110 ring-4 ring-white/20' : 'shadow-md opacity-80'
                          }`}
                        style={{
                          background: `linear-gradient(135deg, ${flavor.color}, ${flavor.color}dd)`,
                          boxShadow: isActive ? `0 10px 20px ${flavor.color}44` : 'none'
                        }}
                      >
                        <motion.span
                          animate={isActive ? { rotate: [0, 10, -10, 0] } : {}}
                          transition={{ repeat: Infinity, duration: 2 }}
                        >
                          {flavor.icon}
                        </motion.span>
                      </div>
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Center Control Circle */}
              <motion.button
                onClick={handleSpin}
                className="relative w-28 h-28 rounded-full z-30 shadow-2xl flex items-center justify-center group overflow-hidden"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                disabled={isSpinning}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 group-hover:opacity-100 opacity-0 transition-opacity" />
                <div className="flex flex-col items-center">
                  <span className={`text-2xl transition-transform duration-500 ${isSpinning ? 'rotate-[720deg]' : ''}`}>☕</span>
                  <span className="text-body-sm font-black text-text-primary uppercase tracking-widest mt-1">
                    {isSpinning ? '...' : 'Spin'}
                  </span>
                </div>
              </motion.button>

              {/* Pointer indicator */}
              <div className="absolute -top-4 left-1/2 -ml-4 w-8 h-8 z-40 text-primary drop-shadow-md">
                ▼
              </div>
            </div>

            <p className="text-body-sm text-text-secondary font-medium">
              Spin to find a random flavor matched to your day
            </p>
          </div>

          {/* Details Section */}
          <div className="h-full flex items-center">
            <AnimatePresence mode="wait">
              {selectedFlavor ? (
                <motion.div
                  key={selectedFlavor.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -30, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                  className="w-full relative"
                >
                  <Card
                    glass
                    className="border-t-4 shadow-2xl"
                    style={{ borderTopColor: selectedFlavor.color }}
                  >
                    <div className="flex items-start gap-md mb-lg">
                      <div
                        className="w-20 h-20 rounded-3xl flex items-center justify-center text-5xl shadow-inner shrink-0"
                        style={{ background: `${selectedFlavor.color}15`, color: selectedFlavor.color }}
                      >
                        {selectedFlavor.icon}
                      </div>
                      <div className="pt-2">
                        <h4 className="text-h2 font-bold text-text-primary mb-1">{selectedFlavor.name}</h4>
                        <p className="text-body-md text-text-secondary leading-relaxed">
                          {selectedFlavor.description}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <div className="h-px flex-1 bg-border" />
                        <span className="text-body-xs font-black text-text-secondary uppercase tracking-[0.2em] px-2 whitespace-nowrap">
                          Recommended Brews
                        </span>
                        <div className="h-px flex-1 bg-border" />
                      </div>

                      <div className="grid gap-3">
                        {selectedFlavor.drinks.map((drink, i) => (
                          <motion.div
                            key={drink}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ x: 8, backgroundColor: 'rgba(var(--primary-rgb), 0.05)' }}
                            className="flex items-center gap-4 p-4 rounded-2xl bg-surface/40 backdrop-blur-sm border border-white/5 transition-all group hover:border-primary/20 cursor-pointer"
                          >
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                              ☕
                            </div>
                            <span className="text-body-lg font-bold text-text-primary flex-1">{drink}</span>
                            <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    <motion.div
                      className="mt-8 p-4 rounded-2xl bg-gradient-to-r from-primary/10 to-transparent border-l-4 border-primary"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p className="text-body-sm text-text-primary italic">
                        "The perfect {selectedFlavor.name.toLowerCase()} balance is achieved through meticulous medium-dark roasting techniques."
                      </p>
                    </motion.div>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full text-center p-xl border-2 border-dashed border-border rounded-3xl"
                >
                  <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-lg">
                    <motion.span
                      className="text-5xl"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      ✨
                    </motion.span>
                  </div>
                  <h4 className="text-h3 font-bold text-text-primary mb-2">Unlock Your Palate</h4>
                  <p className="text-body-md text-text-secondary">
                    Interacting with the wheel reveals tailored recommendations and brewing secrets.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Card>
  );
}

