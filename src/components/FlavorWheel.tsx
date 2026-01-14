import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from './Card';

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
    color: '#F39C12',
    description: 'Rich, sugary notes with caramel undertones',
    drinks: ['Caramel Latte', 'Vanilla Frappuccino', 'Mocha'],
  },
  {
    id: 'bitter',
    name: 'Bitter',
    icon: '☕',
    color: '#4A2C2A',
    description: 'Bold, intense coffee flavor',
    drinks: ['Espresso', 'Americano', 'Black Coffee'],
  },
  {
    id: 'nutty',
    name: 'Nutty',
    icon: '🌰',
    color: '#8B4513',
    description: 'Warm hazelnut and almond notes',
    drinks: ['Hazelnut Latte', 'Almond Cappuccino'],
  },
  {
    id: 'fruity',
    name: 'Fruity',
    icon: '🍒',
    color: '#E74C3C',
    description: 'Bright, tangy with berry hints',
    drinks: ['Berry Iced Tea', 'Lemon Cold Brew'],
  },
  {
    id: 'chocolatey',
    name: 'Chocolatey',
    icon: '🍫',
    color: '#6F4E37',
    description: 'Smooth chocolate richness',
    drinks: ['Hot Chocolate', 'Chocolate Mocha', 'Cocoa Latte'],
  },
  {
    id: 'spicy',
    name: 'Spicy',
    icon: '🌶️',
    color: '#FF6B35',
    description: 'Warming spices like cinnamon and cardamom',
    drinks: ['Chai Latte', 'Spiced Mocha', 'Cinnamon Coffee'],
  },
];

export function FlavorWheel() {
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorProfile | null>(null);
  const [rotation, setRotation] = useState(0);

  const angleStep = 360 / flavorProfiles.length;

  return (
    <Card glass glowOnHover>
      <div className="flex flex-col gap-lg">
        <div className="text-center">
          <h3 className="text-h2 font-bold text-text-primary mb-2">Discover Your Taste</h3>
          <p className="text-body-md text-text-secondary">
            Spin the wheel to explore flavor profiles
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-lg items-center">
          {/* Flavor Wheel */}
          <div className="relative w-80 h-80 mx-auto">
            {/* Center circle */}
            <motion.div
              className="absolute inset-0 m-auto w-64 h-64 rounded-full"
              style={{
                background: 'conic-gradient(from 0deg, #4A2C2A 0deg, #6F4E37 60deg, #8B4513 120deg, #E74C3C 180deg, #F39C12 240deg, #FF6B35 300deg, #4A2C2A 360deg)',
              }}
              animate={{ rotate: rotation }}
              transition={{ type: 'spring', stiffness: 50 }}
              drag
              dragElastic={0.1}
              dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
              onDragEnd={(_, info) => {
                const newRotation = rotation + (info.offset.x / 2);
                setRotation(newRotation);
              }}
              whileHover={{ scale: 1.05 }}
            >
              {/* Inner circle */}
              <div className="absolute inset-0 m-auto w-32 h-32 rounded-full bg-surface shadow-xl flex items-center justify-center">
                <span className="text-h3 font-bold text-primary">Spin</span>
              </div>
            </motion.div>

            {/* Flavor segments */}
            {flavorProfiles.map((flavor, index) => {
              const angle = index * angleStep - rotation;
              const radians = (angle * Math.PI) / 180;
              const radius = 120;
              const x = Math.cos(radians) * radius;
              const y = Math.sin(radians) * radius;

              return (
                <motion.button
                  key={flavor.id}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    x,
                    y,
                  }}
                  onClick={() => setSelectedFlavor(flavor)}
                  whileHover={{ scale: 1.3, zIndex: 10 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {/* Dynamic color - must use inline style for runtime color value */}
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-lg cursor-pointer"
                    style={{ backgroundColor: flavor.color }}
                    animate={{
                      boxShadow: selectedFlavor?.id === flavor.id
                        ? `0 0 20px ${flavor.color}`
                        : '0 4px 6px rgba(0,0,0,0.1)',
                    }}
                  >
                    {flavor.icon}
                  </motion.div>
                </motion.button>
              );
            })}
          </div>

          {/* Selected Flavor Details */}
          <div className="flex-1 min-w-[300px]">
            <AnimatePresence mode="wait">
              {selectedFlavor ? (
                <motion.div
                  key={selectedFlavor.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="rounded-xl p-lg border-2"
                  style={{ borderColor: selectedFlavor.color }}
                >
                  <div className="flex items-center gap-md mb-md">
                    {/* Dynamic color - must use inline style for runtime color value */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center text-4xl"
                      style={{ backgroundColor: selectedFlavor.color }}
                    >
                      {selectedFlavor.icon}
                    </div>
                    <div>
                      <h4 className="text-h3 font-bold text-text-primary">{selectedFlavor.name}</h4>
                      <p className="text-body-sm text-text-secondary">{selectedFlavor.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-body-sm font-semibold text-text-primary">Recommended Drinks:</p>
                    {selectedFlavor.drinks.map((drink, i) => (
                      <motion.div
                        key={drink}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 p-sm rounded-lg bg-surface hover:bg-primary/5 transition cursor-pointer"
                      >
                        <span className="text-primary">☕</span>
                        <span className="text-body-md text-text-primary">{drink}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center p-xl rounded-xl bg-surface"
                >
                  <motion.div
                    className="text-6xl mb-md"
                    animate={{
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  >
                    👉
                  </motion.div>
                  <p className="text-body-lg text-text-secondary">
                    Click on a flavor to explore drinks!
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
