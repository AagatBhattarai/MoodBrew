import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Sparkles, Sun, Cloud, Droplets, Wind, TrendingUp, Award, MapPin, Clock, ChevronRight, Flame, Mountain, Leaf, Users, Package, Coffee, Star, ArrowRight, Thermometer } from 'lucide-react';

const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&h=600&fit=crop';
const FALLBACK_FACT_IMAGES = [
  'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop',
];
import { useStore } from '@/store';
import { moodConfigs, coffeeProducts, aiRecommendations, nepaliCoffeeHistory, nepaliCoffeeFacts, getFlavorExplanation, flavorProfiles } from '@/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { Mood, CoffeeProduct, AIRecommendation } from '@/types';

// Interactive Flavor Wheel Component
function FlavorWheel({ selectedMood, onFlavorClick }: { selectedMood: Mood | null; onFlavorClick?: (flavor: string) => void }) {
  const [hoveredFlavor, setHoveredFlavor] = useState<string | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string | null>(null);
  
  const handleFlavorClick = (flavorId: string) => {
    setSelectedFlavor(flavorId);
    onFlavorClick?.(flavorId);
  };

  return (
    <div className="relative w-full max-w-md mx-auto aspect-square">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Background circles */}
        {[25, 50, 75, 100].map((r, i) => (
          <circle
            key={i}
            cx="100"
            cy="100"
            r={r}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />
        ))}
        
        {/* Flavor segments */}
        {flavorProfiles.map((flavor, index) => {
          const angle = (index * 360) / flavorProfiles.length - 90;
          const nextAngle = ((index + 1) * 360) / flavorProfiles.length - 90;
          const rad = (Math.PI / 180);
          const isHovered = hoveredFlavor === flavor.id;
          const isSelected = selectedFlavor === flavor.id;
          const radius = isSelected ? 95 : isHovered ? 90 : 85;
          
          const x1 = 100 + 30 * Math.cos(angle * rad);
          const y1 = 100 + 30 * Math.sin(angle * rad);
          const x2 = 100 + radius * Math.cos(angle * rad);
          const y2 = 100 + radius * Math.sin(angle * rad);
          const x3 = 100 + radius * Math.cos(nextAngle * rad);
          const y3 = 100 + radius * Math.sin(nextAngle * rad);
          const x4 = 100 + 30 * Math.cos(nextAngle * rad);
          const y4 = 100 + 30 * Math.sin(nextAngle * rad);
          
          const gradientId = `gradient-${flavor.id}`;
          
          return (
            <g key={flavor.id}>
              <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={flavor.color.split(' ')[0].replace('from-', '').replace('bg-', '')} />
                  <stop offset="100%" stopColor={flavor.color.split(' ')[1].replace('to-', '')} />
                </linearGradient>
              </defs>
              <motion.path
                d={`M ${x1} ${y1} L ${x2} ${y2} A ${radius} ${radius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A 30 30 0 0 0 ${x1} ${y1}`}
                fill={`url(#${gradientId})`}
                opacity={isSelected ? 1 : isHovered ? 0.9 : 0.6}
                stroke={isSelected ? 'white' : 'none'}
                strokeWidth={isSelected ? 2 : 0}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredFlavor(flavor.id)}
                onMouseLeave={() => setHoveredFlavor(null)}
                onClick={() => handleFlavorClick(flavor.id)}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              />
            </g>
          );
        })}
        
        {/* Center */}
        <circle cx="100" cy="100" r="25" fill="rgba(20,20,30,0.9)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
        <text x="100" y="95" textAnchor="middle" fill="white" fontSize="8" fontWeight="bold">
          FLAVOR
        </text>
        <text x="100" y="108" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="6">
          WHEEL
        </text>
      </svg>
      
      {/* Flavor Labels */}
      {flavorProfiles.map((flavor, index) => {
        const angle = (index * 360) / flavorProfiles.length - 90 + (360 / flavorProfiles.length / 2);
        const rad = (Math.PI / 180);
        const labelRadius = 110;
        const x = 100 + labelRadius * Math.cos(angle * rad);
        const y = 100 + labelRadius * Math.sin(angle * rad);
        
        return (
          <motion.button
            key={flavor.id}
            className="absolute text-xs font-medium text-white/70 hover:text-white transition-colors"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => setHoveredFlavor(flavor.id)}
            onMouseLeave={() => setHoveredFlavor(null)}
            onClick={() => handleFlavorClick(flavor.id)}
            whileHover={{ scale: 1.1 }}
          >
            {flavor.name.split(' ')[0]}
          </motion.button>
        );
      })}
      
      {/* Flavor Tooltip */}
      <AnimatePresence>
        {(hoveredFlavor || selectedFlavor) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 glass-card p-3 min-w-[200px]"
          >
            {(() => {
              const flavor = flavorProfiles.find(f => f.id === (hoveredFlavor || selectedFlavor));
              if (!flavor) return null;
              return (
                <>
                  <p className="text-white font-semibold text-sm mb-1">{flavor.name}</p>
                  <p className="text-white/60 text-xs mb-2">{flavor.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {flavor.notes.map(note => (
                      <span key={note} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                        {note}
                      </span>
                    ))}
                  </div>
                  {selectedMood && (
                    <p className="text-amber-400 text-xs mt-2 italic">
                      "{getFlavorExplanation(flavor.id, selectedMood)}"
                    </p>
                  )}
                </>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Proudly Nepali Section
function ProudlyNepaliSection() {
  const [activeTimelineIndex, setActiveTimelineIndex] = useState(0);
  const [failedFactImageIds, setFailedFactImageIds] = useState<Set<number>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleFactImageError = (factId: number) => {
    setFailedFactImageIds(prev => new Set(prev).add(factId));
  };

  return (
    <section className="py-16">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/20 text-amber-400 text-sm font-medium mb-4">
          <Mountain className="w-4 h-4" />
          Proudly Nepali
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          From the <span className="text-gradient">Himalayas</span> to Your Cup
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Discover the rich history and unique flavors of Nepali coffee, grown at high altitudes 
          by over 500 farming families across the Himalayan foothills.
        </p>
      </motion.div>

      {/* History Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16"
      >
        <h3 className="text-xl font-semibold text-white mb-6 text-center">Our Coffee Journey</h3>
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          
          {/* Timeline Items */}
          <div className="flex overflow-x-auto scrollbar-hide gap-4 pb-4" ref={scrollRef}>
            {nepaliCoffeeHistory.map((event, index) => (
              <motion.button
                key={event.year}
                onClick={() => setActiveTimelineIndex(index)}
                className={`flex-shrink-0 w-64 glass-card p-4 text-left transition-all ${
                  activeTimelineIndex === index ? 'border-amber-500/50 bg-amber-500/5' : ''
                }`}
                whileHover={{ y: -4 }}
              >
                <div className={`w-4 h-4 rounded-full mb-3 mx-auto ${
                  activeTimelineIndex === index ? 'bg-amber-500' : 'bg-white/20'
                }`} />
                <p className="text-amber-400 font-bold text-lg mb-1">{event.year}</p>
                <p className="text-white font-medium text-sm mb-2">{event.title}</p>
                <p className="text-white/50 text-xs line-clamp-2">{event.description}</p>
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Active Timeline Detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTimelineIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 glass-card p-6 flex flex-col md:flex-row gap-6"
          >
            <img
              src={nepaliCoffeeHistory[activeTimelineIndex].image}
              alt={nepaliCoffeeHistory[activeTimelineIndex].title}
              className="w-full md:w-48 h-32 object-cover rounded-xl"
            />
            <div>
              <p className="text-amber-400 font-bold text-xl mb-2">{nepaliCoffeeHistory[activeTimelineIndex].year}</p>
              <h4 className="text-white font-semibold text-lg mb-2">{nepaliCoffeeHistory[activeTimelineIndex].title}</h4>
              <p className="text-white/70">{nepaliCoffeeHistory[activeTimelineIndex].description}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Educational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {nepaliCoffeeFacts.map((fact, index) => (
          <motion.div
            key={fact.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-card overflow-hidden group"
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={failedFactImageIds.has(fact.id) ? FALLBACK_FACT_IMAGES[(fact.id - 1) % FALLBACK_FACT_IMAGES.length] : fact.image}
                alt={fact.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                onError={() => handleFactImageError(fact.id)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-4 left-4">
                <div className="text-3xl font-bold text-amber-400">{fact.stat}</div>
                <div className="text-white/70 text-sm">{fact.statLabel}</div>
              </div>
            </div>
            <div className="p-5">
              <h4 className="text-white font-semibold mb-2">{fact.title}</h4>
              <p className="text-white/60 text-sm">{fact.description}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-12 text-center"
      >
        <div className="glass-card p-8 inline-block">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <div className="text-left">
              <p className="text-white font-semibold">Support Local Farmers</p>
              <p className="text-white/50 text-sm">Every cup directly impacts 500+ families</p>
            </div>
          </div>
          <Button className="bg-amber-500 hover:bg-amber-600 text-white">
            <Package className="w-4 h-4 mr-2" />
            Buy Nepali Beans
          </Button>
        </div>
      </motion.div>
    </section>
  );
}

// Cafe Ranking Snippet
function CafeRankingSnippet() {
  const { setView, setSelectedCafe } = useStore();
  const topCafes = [
    { name: 'Himalayan Java', orders: 1245, trend: '+12%' },
    { name: 'The Juicery Cafe', orders: 892, trend: '+8%' },
    { name: 'Cafe Camellia', orders: 756, trend: '+23%' },
  ];

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-400" />
          Live Cafe Rankings
        </h3>
        <Badge className="bg-green-500/20 text-green-400 text-xs">This Week</Badge>
      </div>
      
      <div className="space-y-3">
        {topCafes.map((cafe, index) => (
          <div key={cafe.name} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
              index === 0 ? 'bg-yellow-500 text-black' :
              index === 1 ? 'bg-slate-300 text-black' :
              index === 2 ? 'bg-amber-600 text-white' :
              'bg-white/10 text-white'
            }`}>
              {index + 1}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">{cafe.name}</p>
              <p className="text-white/50 text-xs">{cafe.orders} orders</p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 text-xs">
              {cafe.trend}
            </Badge>
          </div>
        ))}
      </div>
      
      <Button 
        variant="ghost" 
        size="sm" 
        className="w-full mt-4 text-amber-400"
        onClick={() => setView('cafes')}
      >
        View Full Rankings <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}

export function HomeView() {
  const { 
    user, 
    currentMood, 
    setMood, 
    weather, 
    dailyChallenges, 
    setView, 
    setSelectedProduct,
    setRecommendations,
    addMoodHistory,
    showToast,
  } = useStore();
  
  const [greeting, setGreeting] = useState('');
  const [recommendations, setLocalRecommendations] = useState<AIRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showFlavorWheel, setShowFlavorWheel] = useState(false);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());

  const handleImageError = useCallback((productId: string) => {
    setFailedImageIds(prev => new Set(prev).add(productId));
  }, []);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    if (currentMood) {
      generateRecommendations(currentMood);
    }
  }, [currentMood]);

  const generateRecommendations = async (mood: Mood) => {
    setIsGenerating(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Enhanced AI logic with weather and ranking boost
    let moodProducts = coffeeProducts.filter(p => p.bestFor.includes(mood));
    
    // Weather boost
    if (weather) {
      if (weather.temperature > 26) {
        moodProducts = moodProducts.sort((a, b) => 
          (b.temperature === 'iced' ? 1 : 0) - (a.temperature === 'iced' ? 1 : 0)
        );
      } else if (weather.condition.includes('Rain')) {
        moodProducts = moodProducts.sort((a, b) => 
          (b.temperature === 'hot' ? 1 : 0) - (a.temperature === 'hot' ? 1 : 0)
        );
      }
    }
    
    // Ranking boost (+25% for top 10)
    moodProducts = moodProducts.sort((a, b) => {
      const aBoost = (a.weeklyOrders || 0) > 200 ? 1.25 : 1;
      const bBoost = (b.weeklyOrders || 0) > 200 ? 1.25 : 1;
      return (b.rating * bBoost) - (a.rating * aBoost);
    });
    
    const topProducts = moodProducts.slice(0, 10);
    
    const recs: AIRecommendation[] = topProducts.map((product, index) => ({
      product,
      reason: aiRecommendations(mood),
      confidence: 0.75 + (0.2 * (10 - index) / 10),
      pairing: index === 0 ? 'Perfect with a morning pastry' : 
               index === 1 ? 'Pairs well with quiet moments' :
               index === 2 ? 'Trending this week in Pokhara' :
               index === 3 ? 'Barista favorite' :
               index === 4 ? 'Great with brunch' :
               'A hidden gem for your mood',
      cafeName: 'Himalayan Java',
      cafeRating: 4.8,
      trendingPosition: index < 3 ? index + 1 : undefined,
    }));
    
    setLocalRecommendations(recs);
    setRecommendations(recs);
    setIsGenerating(false);
  };

  const handleMoodSelect = (mood: Mood) => {
    setMood(mood);
    addMoodHistory({
      date: new Date().toISOString(),
      mood,
      drinkId: '',
      drinkName: '',
    });
  };

  const handleProductClick = (product: CoffeeProduct) => {
    setSelectedProduct(product);
    setView('product-detail');
  };

  const currentMoodConfig = moodConfigs.find(m => m.id === currentMood);

  // Weather-based drink suggestion
  const getWeatherSuggestion = () => {
    if (!weather) return null;
    if (weather.temperature > 26) return { text: 'Perfect weather for an iced cold brew!', icon: Sun, color: 'text-orange-400' };
    if (weather.temperature < 18) return { text: 'A warm latte would be perfect right now.', icon: Cloud, color: 'text-blue-400' };
    if (weather.condition.includes('Rain')) return { text: 'Rainy day? Try our spiced Nepali coffee!', icon: Cloud, color: 'text-slate-400' };
    return { text: 'Great weather for any brew!', icon: Sun, color: 'text-yellow-400' };
  };

  const weatherSuggestion = getWeatherSuggestion();

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Section */}
      <section className="relative px-4 pt-24 md:pt-32 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Greeting & Weather */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          >
            <div>
              <p className="text-white/60 text-sm md:text-base mb-1">
                {greeting} in Pokhara
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                Namaste, <span className="text-gradient">{user?.name}</span> ☕
              </h1>
            </div>
            
            {weather && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card px-4 py-3 flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Thermometer className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">{weather.temperature}°C</p>
                  <p className="text-white/50 text-sm">{weather.condition}</p>
                </div>
                <div className="h-8 w-px bg-white/10 mx-2" />
                <div className="flex items-center gap-2 text-white/50 text-sm">
                  <Droplets className="w-4 h-4" />
                  <span>{weather.humidity}%</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          {/* Weather Suggestion */}
          {weatherSuggestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <div className="inline-flex items-center gap-2 glass-card px-4 py-2">
                <weatherSuggestion.icon className={`w-4 h-4 ${weatherSuggestion.color}`} />
                <span className="text-white/80 text-sm">{weatherSuggestion.text}</span>
              </div>
            </motion.div>
          )}

          {/* Mood Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              How are you feeling today?
            </h2>
            
            <div className="flex flex-wrap gap-2 md:gap-3">
              {moodConfigs.map((mood, index) => {
                const isSelected = currentMood === mood.id;
                
                return (
                  <motion.button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-4 py-2 md:px-6 md:py-3 rounded-full font-medium text-sm md:text-base transition-all duration-300 ${
                      isSelected
                        ? `bg-gradient-to-r ${mood.gradient} text-white shadow-lg`
                        : 'glass-button text-white/80 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{mood.emoji}</span>
                      <span className="hidden sm:inline">{mood.label}</span>
                    </span>
                    
                    {isSelected && (
                      <motion.div
                        layoutId="mood-glow"
                        className="absolute inset-0 rounded-full"
                        style={{ 
                          boxShadow: `0 0 30px ${mood.color}`,
                        }}
                        transition={{ type: 'spring', bounce: 0.2 }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
            
            {currentMoodConfig && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-3 text-white/60 text-sm"
              >
                {currentMoodConfig.description}
              </motion.p>
            )}
          </motion.div>

          {/* Flavor Wheel Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mb-8"
          >
            <button
              onClick={() => setShowFlavorWheel(!showFlavorWheel)}
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-colors"
            >
              <Coffee className="w-5 h-5" />
              {showFlavorWheel ? 'Hide Flavor Wheel' : 'Explore Flavor Profiles'}
              <ChevronRight className={`w-4 h-4 transition-transform ${showFlavorWheel ? 'rotate-90' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showFlavorWheel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4"
                >
                  <div className="glass-card p-6">
                    <p className="text-white/60 text-sm mb-4 text-center">
                      Click on a flavor segment to explore drinks with those notes
                      {currentMood && ' • AI will explain why it matches your mood'}
                    </p>
                    <FlavorWheel selectedMood={currentMood} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* AI Recommendations */}
          <AnimatePresence mode="wait">
            {currentMood && (
              <motion.div
                key="recommendations"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    AI Recommendations for your {currentMoodConfig?.label} mood
                  </h2>
                  {isGenerating && (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      <Sparkles className="w-5 h-5 text-amber-400" />
                    </motion.div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendations.map((rec, index) => (
                    <motion.div
                      key={rec.product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => handleProductClick(rec.product)}
                      className="glass-card overflow-hidden cursor-pointer group relative"
                      whileHover={{ y: -4 }}
                    >
                      {/* Trending Badge */}
                      {rec.trendingPosition && rec.trendingPosition <= 3 && (
                        <div className="absolute top-3 left-3 z-10">
                          <Badge className={`${
                            rec.trendingPosition === 1 ? 'bg-yellow-500' :
                            rec.trendingPosition === 2 ? 'bg-slate-400' :
                            'bg-amber-600'
                          } text-white text-xs`}>
                            <TrendingUp className="w-3 h-3 mr-1" />
                            #{rec.trendingPosition} Trending
                          </Badge>
                        </div>
                      )}
                      
                      {/* Nepali Origin Badge */}
                      {rec.product.isNepaliOrigin && (
                        <div className="absolute top-3 right-3 z-10">
                          <Badge className="bg-green-500/80 text-white text-xs">
                            <Mountain className="w-3 h-3 mr-1" />
                            Nepali
                          </Badge>
                        </div>
                      )}
                      
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={failedImageIds.has(rec.product.id) ? FALLBACK_PRODUCT_IMAGE : rec.product.image}
                          alt={rec.product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          onError={() => handleImageError(rec.product.id)}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <Badge className="bg-amber-500/80 text-white text-xs">
                            {Math.round(rec.confidence * 100)}% Match
                          </Badge>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-white mb-1">{rec.product.name}</h3>
                        <p className="text-white/60 text-sm mb-2 line-clamp-2">{rec.reason}</p>
                        {rec.pairing && (
                          <p className="text-amber-400/80 text-xs italic mb-2">💡 {rec.pairing}</p>
                        )}
                        <div className="flex items-center justify-between">
                          <p className="text-amber-400 font-medium">Rs. {rec.product.price}</p>
                          {rec.cafeName && (
                            <p className="text-white/50 text-xs flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {rec.cafeName}
                            </p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Daily Challenges */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="glass-card p-5 lg:col-span-2"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Award className="w-5 h-5 text-amber-400" />
                  Daily Challenges
                </h3>
                <Button variant="ghost" size="sm" className="text-amber-400">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              
              <div className="space-y-3">
                {dailyChallenges.slice(0, 2).map((challenge) => (
                  <div key={challenge.id} className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white text-sm font-medium">{challenge.title}</span>
                        <span className="text-amber-400 text-xs">+{challenge.reward} pts</span>
                      </div>
                      <Progress 
                        value={(challenge.progress / challenge.maxProgress) * 100} 
                        className="h-2 bg-white/10"
                      />
                      <p className="text-white/50 text-xs mt-1">{challenge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Streak Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass-card p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Flame className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{user?.stats.currentStreak}</p>
                  <p className="text-white/50 text-sm">Day Streak</p>
                </div>
              </div>
              <p className="text-white/60 text-xs mb-2">
                Keep it up! Your longest streak was {user?.stats.longestStreak} days.
              </p>
              <p className="text-white/50 text-xs leading-relaxed">
                Order or check in daily to build your streak. Unlock rewards at 3, 7, and 30 days!
              </p>
              <p className="text-amber-400/80 text-xs mt-2 font-medium">
                Tip: Visit any partner cafe or log a drink to keep the flame alive.
              </p>
            </motion.div>

            {/* Cafe Ranking Snippet */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <CafeRankingSnippet />
            </motion.div>

            {/* Brew of the Day - unique featured card */}
            {(() => {
              const brewOfTheDay = coffeeProducts.find(p => p.isSignature) || coffeeProducts[0];
              if (!brewOfTheDay) return null;
              return (
                <motion.div
                  key="brew-of-day"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card overflow-hidden cursor-pointer group relative lg:col-span-2"
                  onClick={() => {
                    setSelectedProduct(brewOfTheDay);
                    setView('products');
                  }}
                  whileHover={{ y: -4 }}
                >
                  <div className="relative h-32 md:h-36 overflow-hidden">
                    <img
                      src={failedImageIds.has(brewOfTheDay.id) ? FALLBACK_PRODUCT_IMAGE : brewOfTheDay.image}
                      alt="Brew of the Day"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={() => handleImageError(brewOfTheDay.id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                      <div>
                        <Badge className="bg-amber-500/90 text-white text-xs mb-1">Brew of the Day</Badge>
                        <p className="text-white font-semibold">{brewOfTheDay.name}</p>
                        <p className="text-white/70 text-sm">Tap to explore</p>
                      </div>
                      <ChevronRight className="w-6 h-6 text-amber-400 flex-shrink-0" />
                    </div>
                  </div>
                  <div className="p-4 border-t border-white/10">
                    <p className="text-white/70 text-sm line-clamp-2">{brewOfTheDay.description}</p>
                  </div>
                </motion.div>
              );
            })()}
          </div>

          {/* Proudly Nepali Section */}
          <ProudlyNepaliSection />

          {/* Trending Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-amber-400" />
                Trending in Pokhara
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-amber-400"
                onClick={() => setView('products')}
              >
                See All <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {coffeeProducts.filter(p => p.isSignature).slice(0, 5).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  onClick={() => handleProductClick(product)}
                  className="flex-shrink-0 w-64 glass-card overflow-hidden cursor-pointer group"
                  whileHover={{ y: -4 }}
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={failedImageIds.has(product.id) ? FALLBACK_PRODUCT_IMAGE : product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={() => handleImageError(product.id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {product.isNew && (
                      <Badge className="absolute top-2 left-2 bg-green-500/80 text-white">
                        New
                      </Badge>
                    )}
                    {product.isNepaliOrigin && (
                      <Badge className="absolute top-2 right-2 bg-green-500/80 text-white">
                        <Mountain className="w-3 h-3 mr-1" />
                        Nepali
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 line-clamp-1">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-amber-400 font-medium">Rs. {product.price}</p>
                      <div className="flex items-center gap-1 text-white/50 text-sm">
                        <Clock className="w-3 h-3" />
                        <span>{product.prepTime}m</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* AI Tip of the Day */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-8 glass-card p-5"
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">Barista AI Tip of the Day</h3>
                <p className="text-white/70 text-sm leading-relaxed">
                  Did you know? Nepali coffee is grown at elevations of 1,000-2,100 meters, 
                  making it some of the highest-grown coffee in the world. The cool Himalayan 
                  climate slows bean development, resulting in denser beans with complex floral 
                  and citrus notes. Our baristas recommend trying Gulmi beans for their wild 
                  honey sweetness and Ilam beans for their delicate jasmine aromatics!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
