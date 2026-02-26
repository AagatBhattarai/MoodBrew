import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600&h=600&fit=crop';
import { Search, SlidersHorizontal, Sparkles, X, Filter } from 'lucide-react';
import { useStore } from '@/store';
import { coffeeProducts, moodConfigs, flavorProfiles, getFlavorExplanation, generateFlavorStory, filterProductsByFlavors, getPerfectMatches } from '@/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import type { CoffeeProduct, Mood } from '@/types';

// Flavor wheel geometry – single source of truth for segment and icon alignment
const WHEEL_CX = 100;
const WHEEL_CY = 100;
const SEGMENT_COUNT = 12;
const SEGMENT_ANGLE_DEG = 360 / SEGMENT_COUNT;
const START_ANGLE_DEG = -90; // top of wheel
const INNER_R = 36;
const SEGMENT_OUTER_R = 94;
const ICON_R = 64; // inside the wheel, clearly within each segment
const VIEWBOX_SIZE = 200;
const toRad = (deg: number) => (deg * Math.PI) / 180;
const angleAt = (index: number, atSegmentCenter: boolean) =>
  START_ANGLE_DEG + index * SEGMENT_ANGLE_DEG + (atSegmentCenter ? SEGMENT_ANGLE_DEG / 2 : 0);

// 12-Segment Interactive Flavor Wheel with Icons
function FlavorWheel({ 
  selectedFlavors, 
  onFlavorToggle,
  onClearAll,
  canAddMore,
  selectedMood 
}: { 
  selectedFlavors: string[];
  onFlavorToggle: (flavorId: string) => void;
  onClearAll: () => void;
  canAddMore: boolean;
  selectedMood: Mood | null;
}) {
  const [hoveredFlavor, setHoveredFlavor] = useState<string | null>(null);
  
  const displayFlavor = hoveredFlavor || selectedFlavors[selectedFlavors.length - 1] || null;

  const flavorStory = selectedFlavors.length >= 2 
    ? generateFlavorStory(selectedFlavors)
    : null;

  return (
    <div className="relative">
      {/* Selection counter */}
      <div className="flex items-center justify-between mb-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/5 border border-white/10 px-3 py-1.5">
          <span className="text-white/50 text-xs font-medium">Selected</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-colors ${
                  i < selectedFlavors.length ? 'bg-amber-500' : 'bg-white/15'
                }`}
              />
            ))}
          </div>
          <span className="text-white/70 text-xs tabular-nums">
            {selectedFlavors.length}/3
          </span>
        </div>
        {selectedFlavors.length > 0 && (
          <button
            onClick={onClearAll}
            className="text-amber-400/90 text-sm hover:text-amber-300 flex items-center gap-1.5 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
            Clear
          </button>
        )}
      </div>

      <div className="w-full max-w-sm mx-auto aspect-square relative rounded-2xl overflow-hidden bg-white/[0.02]">
        <svg viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          {/* Light concentric guides */}
          {[45, 70].map((r) => (
            <circle key={r} cx={WHEEL_CX} cy={WHEEL_CY} r={r} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
          ))}
          
          {/* Radial dividers – segment boundaries, aligned with icon rays */}
          {flavorProfiles.map((_, index) => {
            const a = toRad(angleAt(index, false));
            const x1 = WHEEL_CX + INNER_R * Math.cos(a);
            const y1 = WHEEL_CY + INNER_R * Math.sin(a);
            const x2 = WHEEL_CX + SEGMENT_OUTER_R * Math.cos(a);
            const y2 = WHEEL_CY + SEGMENT_OUTER_R * Math.sin(a);
            return (
              <line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
            );
          })}
          
          {/* Flavor segments */}
          {flavorProfiles.map((flavor, index) => {
            const a1 = toRad(angleAt(index, false));
            const a2 = toRad(angleAt(index + 1, false));
            const isHovered = hoveredFlavor === flavor.id;
            const isSelected = selectedFlavors.includes(flavor.id);
            const r = isSelected ? SEGMENT_OUTER_R : isHovered ? SEGMENT_OUTER_R - 3 : SEGMENT_OUTER_R - 6;
            
            const x1 = WHEEL_CX + INNER_R * Math.cos(a1);
            const y1 = WHEEL_CY + INNER_R * Math.sin(a1);
            const x2 = WHEEL_CX + r * Math.cos(a1);
            const y2 = WHEEL_CY + r * Math.sin(a1);
            const x3 = WHEEL_CX + r * Math.cos(a2);
            const y3 = WHEEL_CY + r * Math.sin(a2);
            const x4 = WHEEL_CX + INNER_R * Math.cos(a2);
            const y4 = WHEEL_CY + INNER_R * Math.sin(a2);
            
            const colorMap: Record<string, [string, string]> = {
              'from-pink-300 to-purple-300': ['#f9a8d4', '#d8b4fe'],
              'from-yellow-300 to-orange-300': ['#fde047', '#fdba74'],
              'from-purple-400 to-red-400': ['#c084fc', '#f87171'],
              'from-amber-700 to-amber-900': ['#b45309', '#78350f'],
              'from-amber-500 to-yellow-600': ['#f59e0b', '#ca8a04'],
              'from-amber-400 to-orange-400': ['#fbbf24', '#fb923c'],
              'from-orange-500 to-red-500': ['#f97316', '#ef4444'],
              'from-green-700 to-emerald-900': ['#15803d', '#064e3b'],
              'from-green-400 to-teal-500': ['#4ade80', '#14b8a6'],
              'from-amber-100 to-yellow-200': ['#fef3c7', '#fef08a'],
              'from-slate-600 to-slate-800': ['#475569', '#1e293b'],
              'from-yellow-400 to-pink-400': ['#facc15', '#f472b6'],
            };
            const [color1, color2] = colorMap[flavor.color] || ['#888888', '#666666'];
            const gradientId = `gradient-${flavor.id}`;
            
            return (
              <g key={flavor.id}>
                <defs>
                  <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={color1} />
                    <stop offset="100%" stopColor={color2} />
                  </linearGradient>
                </defs>
                <motion.path
                  d={`M ${x1} ${y1} L ${x2} ${y2} A ${r} ${r} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${INNER_R} ${INNER_R} 0 0 0 ${x1} ${y1}`}
                  fill={`url(#${gradientId})`}
                  opacity={isSelected ? 1 : isHovered ? 0.9 : 0.6}
                  stroke={isHovered || isSelected ? 'rgba(255,255,255,0.3)' : 'none'}
                  strokeWidth={isSelected ? 2 : 0.8}
                  className={`cursor-pointer ${!canAddMore && !isSelected ? 'opacity-50' : ''}`}
                  onMouseEnter={() => setHoveredFlavor(flavor.id)}
                  onMouseLeave={() => setHoveredFlavor(null)}
                  onClick={() => onFlavorToggle(flavor.id)}
                  whileHover={canAddMore || isSelected ? { scale: 1.02 } : {}}
                  transition={{ duration: 0.2 }}
                />
              </g>
            );
          })}
          
          {/* Center */}
          <circle cx={WHEEL_CX} cy={WHEEL_CY} r="30" fill="rgba(12,18,16,0.98)" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
          <text x={WHEEL_CX} y={WHEEL_CY - 6} textAnchor="middle" fontSize="16">
            {selectedFlavors.length > 0 ? '☕' : '🎯'}
          </text>
          <text x={WHEEL_CX} y={WHEEL_CY + 8} textAnchor="middle" fill="rgba(255,255,255,0.55)" fontSize="6.5" fontWeight="500">
            {selectedFlavors.length > 0 ? `${selectedFlavors.length} FLAVOR${selectedFlavors.length > 1 ? 'S' : ''}` : 'PICK UP TO 3'}
          </text>
          
          {/* Icons in SVG: static g for position so Framer Motion scale never overrides translate */}
          {flavorProfiles.map((flavor, index) => {
            const deg = angleAt(index, true);
            const rad = toRad(deg);
            const cx = WHEEL_CX + ICON_R * Math.cos(rad);
            const cy = WHEEL_CY + ICON_R * Math.sin(rad);
            const isSelected = selectedFlavors.includes(flavor.id);
            const isDisabled = !canAddMore && !isSelected;
            return (
              <g
                key={flavor.id}
                transform={`translate(${cx}, ${cy})`}
                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer', opacity: isDisabled ? 0.5 : 1 }}
                onMouseEnter={() => setHoveredFlavor(flavor.id)}
                onMouseLeave={() => setHoveredFlavor(null)}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isDisabled) onFlavorToggle(flavor.id);
                }}
              >
                <title>{flavor.name}</title>
                <motion.g
                  whileHover={canAddMore || isSelected ? { scale: 1.15 } : { scale: 1.06 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  style={{ transformOrigin: '0 0' }}
                >
                  {/* Hit area */}
                  <circle r={14} fill="transparent" />
                  {/* Icon background */}
                  <circle
                    r={12}
                    fill={isSelected ? 'rgba(245,158,11,0.85)' : 'rgba(255,255,255,0.12)'}
                    style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                  />
                  {isSelected && (
                    <circle r={12} fill="none" stroke="rgba(251,191,36,0.5)" strokeWidth="1.5" />
                  )}
                  <text
                    textAnchor="middle"
                    dominantBaseline="central"
                    x={0}
                    y={0}
                    fontSize={14}
                    style={{ pointerEvents: 'none', userSelect: 'none' }}
                  >
                    {flavor.icon}
                  </text>
                </motion.g>
              </g>
            );
          })}
        </svg>
      </div>
      
      {/* Flavor Info Panel */}
      <AnimatePresence mode="wait">
        {flavorStory && selectedFlavors.length >= 2 ? (
          <motion.div
            key="story"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <p className="text-amber-400 font-semibold text-sm">AI Flavor Story</p>
            </div>
            <p className="text-white/90 text-sm italic leading-relaxed">"{flavorStory}"</p>
            <div className="flex flex-wrap gap-1 mt-3">
              {selectedFlavors.map(id => {
                const flavor = flavorProfiles.find(f => f.id === id);
                return (
                  <span key={id} className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300">
                    {flavor?.icon} {flavor?.name}
                  </span>
                );
              })}
            </div>
          </motion.div>
        ) : displayFlavor ? (
          <motion.div
            key="info"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4"
          >
            {(() => {
              const flavor = flavorProfiles.find(f => f.id === displayFlavor);
              if (!flavor) return null;
              const isSelected = selectedFlavors.includes(flavor.id);
              return (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{flavor.icon}</span>
                      <p className="text-white font-semibold">{flavor.name}</p>
                    </div>
                    {isSelected && (
                      <Badge className="bg-amber-500 text-white text-xs">Selected</Badge>
                    )}
                  </div>
                  <p className="text-white/60 text-sm mb-2">{flavor.description}</p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {flavor.notes.map(note => (
                      <span key={note} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                        {note}
                      </span>
                    ))}
                  </div>
                  {selectedMood && (
                    <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-emerald-400 text-sm">
                        <Sparkles className="w-4 h-4 inline mr-1" />
                        {getFlavorExplanation(flavor.id, selectedMood)}
                      </p>
                    </div>
                  )}
                </>
              );
            })()}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function ProductsView() {
  const { 
    setView, 
    setSelectedProduct, 
    currentMood, 
    selectedFlavors, 
    toggleFlavor, 
    clearFlavors,
    canAddMoreFlavors 
  } = useStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMood, setSelectedMood] = useState<Mood | null>(currentMood);
  const [intensityRange, setIntensityRange] = useState([0, 10]);
  const [showFilters, setShowFilters] = useState(false);
  const [showFlavorWheel, setShowFlavorWheel] = useState(true);
  const [sortBy, setSortBy] = useState<'popularity' | 'rating' | 'price'>('popularity');
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());

  const handleImageError = useCallback((productId: string) => {
    setFailedImageIds(prev => new Set(prev).add(productId));
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(coffeeProducts.map(p => p.category));
    return ['all', ...Array.from(cats)];
  }, []);

  const filteredProducts = useMemo(() => {
    let filtered = coffeeProducts.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.flavorNotes.some(note => note.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
      
      const matchesMood = !selectedMood || product.bestFor.includes(selectedMood);
      
      const matchesIntensity = product.intensity >= intensityRange[0] && product.intensity <= intensityRange[1];
      
      return matchesSearch && matchesCategory && matchesMood && matchesIntensity;
    });

    // Apply flavor filter if flavors selected
    if (selectedFlavors.length > 0) {
      filtered = filterProductsByFlavors(filtered, selectedFlavors);
    }

    // Sort
    switch (sortBy) {
      case 'popularity':
        filtered = filtered.sort((a, b) => (b.weeklyOrders || 0) - (a.weeklyOrders || 0));
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price':
        filtered = filtered.sort((a, b) => a.price - b.price);
        break;
    }
    
    return filtered;
  }, [searchQuery, selectedCategory, selectedMood, intensityRange, selectedFlavors, sortBy]);

  // Get perfect matches (products with ALL selected flavors)
  const perfectMatches = useMemo(() => {
    if (selectedFlavors.length < 2) return [];
    return getPerfectMatches(coffeeProducts, selectedFlavors);
  }, [selectedFlavors]);

  const handleProductClick = (product: CoffeeProduct) => {
    setSelectedProduct(product);
    setView('product-detail');
  };

  return (
    <div className="min-h-screen pb-24 pt-20 md:pt-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Discover Your <span className="text-gradient">Perfect Brew</span>
          </h1>
          <p className="text-white/60">Explore our curated selection of Himalayan coffees</p>
        </motion.div>

        {/* Search & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <Input
              placeholder="Search drinks, flavors, or notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 glass border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="h-12 px-4 rounded-lg glass border-white/10 text-white bg-transparent"
            >
              <option value="popularity" className="bg-slate-900">Sort by Popularity</option>
              <option value="rating" className="bg-slate-900">Sort by Rating</option>
              <option value="price" className="bg-slate-900">Sort by Price</option>
            </select>
            
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
              <SheetTrigger asChild>
                <Button 
                  variant="outline" 
                  className="h-12 px-6 glass border-white/10 text-white hover:bg-white/10"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-slate-900/95 border-white/10 w-full sm:max-w-md">
                <SheetHeader>
                  <SheetTitle className="text-white">Filter Products</SheetTitle>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Category</h4>
                    <div className="flex flex-wrap gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setSelectedCategory(cat)}
                          className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                            selectedCategory === cat
                              ? 'bg-amber-500 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Mood Filter */}
                  <div>
                    <h4 className="text-white font-medium mb-3">Best For Mood</h4>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setSelectedMood(null)}
                        className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                          selectedMood === null
                            ? 'bg-amber-500 text-white'
                            : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
                      >
                        Any
                      </button>
                      {moodConfigs.map(mood => (
                        <button
                          key={mood.id}
                          onClick={() => setSelectedMood(mood.id)}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                            selectedMood === mood.id
                              ? 'bg-amber-500 text-white'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {mood.emoji} {mood.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Intensity Slider */}
                  <div>
                    <h4 className="text-white font-medium mb-3">
                      Intensity: {intensityRange[0]} - {intensityRange[1]}
                    </h4>
                    <Slider
                      value={intensityRange}
                      onValueChange={setIntensityRange}
                      max={10}
                      step={1}
                      className="w-full"
                    />
                  </div>

                  <Button 
                    onClick={() => setShowFilters(false)}
                    className="w-full bg-amber-500 hover:bg-amber-600"
                  >
                    Apply Filters
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </motion.div>

        {/* Flavor Wheel Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              12-Flavor Profile Explorer
            </h2>
            <button
              onClick={() => setShowFlavorWheel(!showFlavorWheel)}
              className="text-amber-400 text-sm hover:text-amber-300"
            >
              {showFlavorWheel ? 'Hide' : 'Show'}
            </button>
          </div>
          
          <AnimatePresence>
            {showFlavorWheel && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <FlavorWheel 
                    selectedFlavors={selectedFlavors}
                    onFlavorToggle={toggleFlavor}
                    onClearAll={clearFlavors}
                    canAddMore={canAddMoreFlavors()}
                    selectedMood={selectedMood}
                  />
                  
                  <div className="space-y-5">
                    <h3 className="text-white font-semibold text-sm uppercase tracking-wider text-white/80">
                      How to Use
                    </h3>
                    <ul className="space-y-3 text-white/70 text-sm">
                      <li className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">1</span>
                        <span>Click up to 3 flavor icons to filter drinks</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">2</span>
                        <span>AI generates a unique story for your combination</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">3</span>
                        <span>Perfect matches contain ALL selected flavors</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-xs font-semibold">4</span>
                        <span>Hover segments to explore individual flavors</span>
                      </li>
                    </ul>
                    
                    {/* Perfect Matches */}
                    {perfectMatches.length > 0 && (
                      <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                        <p className="text-emerald-400 text-sm font-semibold mb-1">
                          🎯 Perfect Matches Found: {perfectMatches.length}
                        </p>
                        <p className="text-emerald-300/70 text-xs">
                          These drinks contain all your selected flavors!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Active Filters */}
        {(selectedCategory !== 'all' || selectedMood || selectedFlavors.length > 0 || intensityRange[0] > 0 || intensityRange[1] < 10) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-wrap gap-2 mb-6"
          >
            <span className="text-white/50 text-sm self-center">Active filters:</span>
            {selectedCategory !== 'all' && (
              <Badge className="bg-white/10 text-white cursor-pointer" onClick={() => setSelectedCategory('all')}>
                {selectedCategory} <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {selectedMood && (
              <Badge className="bg-amber-500/20 text-amber-400 cursor-pointer" onClick={() => setSelectedMood(null)}>
                {moodConfigs.find(m => m.id === selectedMood)?.emoji} {moodConfigs.find(m => m.id === selectedMood)?.label} <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            {selectedFlavors.map(flavorId => {
              const flavor = flavorProfiles.find(f => f.id === flavorId);
              return (
                <Badge key={flavorId} className="bg-purple-500/20 text-purple-400 cursor-pointer" onClick={() => toggleFlavor(flavorId)}>
                  {flavor?.icon} {flavor?.name} <X className="w-3 h-3 ml-1" />
                </Badge>
              );
            })}
            {(intensityRange[0] > 0 || intensityRange[1] < 10) && (
              <Badge className="bg-white/10 text-white cursor-pointer" onClick={() => setIntensityRange([0, 10])}>
                Intensity {intensityRange[0]}-{intensityRange[1]} <X className="w-3 h-3 ml-1" />
              </Badge>
            )}
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSelectedMood(null);
                clearFlavors();
                setIntensityRange([0, 10]);
              }}
              className="text-amber-400 text-sm hover:text-amber-300 ml-2"
            >
              Clear All
            </button>
          </motion.div>
        )}

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {searchQuery ? `Results for "${searchQuery}"` : 'All Drinks'}
            </h2>
            <p className="text-white/50 text-sm">{filteredProducts.length} products</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleProductClick(product)}
                  className="glass-card overflow-hidden cursor-pointer group"
                  whileHover={{ y: -4 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={failedImageIds.has(product.id) ? FALLBACK_PRODUCT_IMAGE : product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={() => handleImageError(product.id)}
                    />
                    {product.isSignature && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-amber-500 text-white text-xs">
                          <Sparkles className="w-3 h-3 mr-1" />
                          Signature
                        </Badge>
                      </div>
                    )}
                    {product.isNepaliOrigin && (
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-emerald-500 text-white text-xs">
                          Proudly Nepali
                        </Badge>
                      </div>
                    )}
                    {perfectMatches.some(pm => pm.id === product.id) && (
                      <div className="absolute bottom-3 left-3">
                        <Badge className="bg-purple-500 text-white text-xs">
                          🎯 Perfect Match
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-semibold line-clamp-1">{product.name}</h3>
                      <span className="text-amber-400 font-bold">Rs. {product.price}</span>
                    </div>
                    <p className="text-white/60 text-sm line-clamp-2 mb-3">{product.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {product.flavorNotes.slice(0, 3).map(note => (
                        <span key={note} className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/60">
                          {note}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <span className="text-amber-400 text-sm">★</span>
                        <span className="text-white/60 text-sm">{product.rating}</span>
                        <span className="text-white/40 text-xs">({product.reviewCount})</span>
                      </div>
                      <span className="text-white/40 text-xs">{product.prepTime} min</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {filteredProducts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="text-6xl mb-4">☕</div>
              <h3 className="text-white text-xl font-semibold mb-2">No drinks found</h3>
              <p className="text-white/60 mb-4">Try adjusting your filters or search query</p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setSelectedMood(null);
                  clearFlavors();
                  setIntensityRange([0, 10]);
                }}
                className="bg-amber-500 hover:bg-amber-600"
              >
                Clear All Filters
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
