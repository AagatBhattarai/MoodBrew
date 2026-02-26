import { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FALLBACK_CAFE_IMAGE = 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=500&fit=crop';
import { MapPin, Star, Clock, Navigation, Heart, Search, TrendingUp, ChevronRight, ThumbsUp, ThumbsDown, Award, Locate } from 'lucide-react';
import { useStore } from '@/store';
import { cafes } from '@/data';
import { calculateDistance, getUserPosition, POKHARA_CENTER } from '@/data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Cafe } from '@/types';

// Cafe Leaderboard Component
function CafeLeaderboard({
  failedImageIds,
  onImageError,
}: {
  failedImageIds?: Set<string>;
  onImageError?: (id: string) => void;
} = {}) {
  const sortedCafes = [...cafes].sort((a, b) => (b.weeklyOrders || 0) - (a.weeklyOrders || 0)).slice(0, 5);
  
  return (
    <div className="glass-card p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          Top Cafes This Week
        </h3>
        <Badge className="bg-green-500/20 text-green-400 text-xs">Live</Badge>
      </div>
      
      <div className="space-y-3">
        {sortedCafes.map((cafe, index) => (
          <motion.div
            key={cafe.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              index === 0 ? 'bg-yellow-500 text-black' :
              index === 1 ? 'bg-slate-300 text-black' :
              index === 2 ? 'bg-amber-600 text-white' :
              'bg-white/10 text-white'
            }`}>
              {index + 1}
            </div>
            <img
              src={failedImageIds?.has(cafe.id) ? FALLBACK_CAFE_IMAGE : cafe.image}
              alt={cafe.name}
              className="w-12 h-12 rounded-lg object-cover"
              onError={() => onImageError?.(cafe.id)}
            />
            <div className="flex-1">
              <p className="text-white font-medium text-sm">{cafe.name}</p>
              <p className="text-white/50 text-xs">{cafe.weeklyOrders} orders this week</p>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-sm">{cafe.rating}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function CafesView() {
  const { setView, setSelectedCafe } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'popular' | 'new' | 'nepali'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [likedCafes, setLikedCafes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'ranking' | 'rating' | 'distance'>('ranking');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());

  const handleImageError = useCallback((cafeId: string) => {
    setFailedImageIds(prev => new Set(prev).add(cafeId));
  }, []);

  // Get user location on mount
  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGetLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    try {
      const position = await getUserPosition();
      setUserLocation(position);
    } catch (error) {
      setLocationError('Using Pokhara center as default location');
      setUserLocation(POKHARA_CENTER);
    } finally {
      setIsLocating(false);
    }
  };

  // Calculate distances for all cafes
  const cafesWithDistance = useMemo(() => {
    if (!userLocation) return cafes.map(c => ({ ...c, distance: undefined }));
    
    return cafes.map(cafe => ({
      ...cafe,
      distance: calculateDistance(
        userLocation.lat,
        userLocation.lng,
        cafe.location.lat,
        cafe.location.lng
      )
    }));
  }, [userLocation]);

  const filteredCafes = useMemo(() => {
    let filtered = cafesWithDistance.filter(cafe => {
      const matchesSearch = cafe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cafe.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesFilter = selectedFilter === 'all' || 
        (selectedFilter === 'popular' && cafe.isPopular) ||
        (selectedFilter === 'new' && cafe.isNew) ||
        (selectedFilter === 'nepali' && cafe.signatureDrinks.some(d => d.includes('Nepali')));
      
      return matchesSearch && matchesFilter;
    });

    // Sort
    switch (sortBy) {
      case 'ranking':
        filtered = filtered.sort((a, b) => (a.rankingPosition || 99) - (b.rankingPosition || 99));
        break;
      case 'rating':
        filtered = filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        filtered = filtered.sort((a, b) => (a.distance || 999) - (b.distance || 999));
        break;
    }
    
    return filtered;
  }, [searchQuery, selectedFilter, sortBy, cafesWithDistance]);

  const handleCafeClick = (cafe: Cafe) => {
    setSelectedCafe(cafe);
    setView('cafe-detail');
  };

  const toggleLike = (cafeId: string) => {
    setLikedCafes(prev => 
      prev.includes(cafeId) 
        ? prev.filter(id => id !== cafeId)
        : [...prev, cafeId]
    );
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
            Pokhara <span className="text-gradient">Cafes</span>
          </h1>
          <p className="text-white/60">Discover the best coffee spots around Lakeside and beyond</p>
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
              placeholder="Search cafes, features, or vibes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 glass border-white/10 text-white placeholder:text-white/40"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {(['all', 'popular', 'new', 'nepali'] as const).map(filter => (
              <Button
                key={filter}
                variant={selectedFilter === filter ? 'default' : 'outline'}
                onClick={() => setSelectedFilter(filter)}
                className={`h-12 px-4 capitalize ${selectedFilter === filter ? 'bg-amber-500' : 'glass border-white/10 text-white'}`}
              >
                {filter === 'nepali' ? 'Proudly Nepali' : filter}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Sort & View Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-white/50 text-sm">Sort by:</span>
            {(['ranking', 'rating', 'distance'] as const).map(sort => (
              <button
                key={sort}
                onClick={() => setSortBy(sort)}
                className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                  sortBy === sort
                    ? 'bg-amber-500 text-white'
                    : 'bg-white/5 text-white/70 hover:bg-white/10'
                }`}
              >
                {sort === 'distance' ? '📍 Distance' : sort}
              </button>
            ))}
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className="px-3 py-1.5 rounded-lg text-sm bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 flex items-center gap-1 disabled:opacity-50"
            >
              <Locate className="w-3 h-3" />
              {isLocating ? 'Locating...' : 'Update Location'}
            </button>
          </div>
          
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'map')}>
            <TabsList className="glass border-white/10">
              <TabsTrigger value="list" className="data-[state=active]:bg-amber-500">
                List View
              </TabsTrigger>
              <TabsTrigger value="map" className="data-[state=active]:bg-amber-500">
                Map View
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Location Status */}
        {locationError && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20"
          >
            <p className="text-amber-400 text-sm">{locationError}</p>
          </motion.div>
        )}

        {/* Cafe Leaderboard */}
        <CafeLeaderboard failedImageIds={failedImageIds} onImageError={handleImageError} />

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'list' ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {filteredCafes.map((cafe, index) => (
                <motion.div
                  key={cafe.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCafeClick(cafe)}
                  className="glass-card overflow-hidden cursor-pointer group"
                  whileHover={{ y: -4 }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={failedImageIds.has(cafe.id) ? FALLBACK_CAFE_IMAGE : cafe.image}
                      alt={cafe.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      onError={() => handleImageError(cafe.id)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    
                    {/* Ranking Badge */}
                    {cafe.rankingPosition && cafe.rankingPosition <= 3 && (
                      <div className="absolute top-4 left-4">
                        <Badge className={`${
                          cafe.rankingPosition === 1 ? 'bg-yellow-500' :
                          cafe.rankingPosition === 2 ? 'bg-slate-300 text-black' :
                          'bg-amber-600'
                        } text-white`}>
                          <Award className="w-3 h-3 mr-1" />
                          #{cafe.rankingPosition} This Week
                        </Badge>
                      </div>
                    )}

                    {/* New Badge */}
                    {cafe.isNew && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-emerald-500 text-white">
                          NEW
                        </Badge>
                      </div>
                    )}

                    {/* Like Button */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLike(cafe.id);
                      }}
                      whileTap={{ scale: 0.9 }}
                      className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                        likedCafes.includes(cafe.id) 
                          ? 'bg-red-500 text-white' 
                          : 'bg-black/40 backdrop-blur-sm text-white'
                      }`}
                    >
                      <Heart className={`w-5 h-5 ${likedCafes.includes(cafe.id) ? 'fill-current' : ''}`} />
                    </motion.button>

                    {/* Rating */}
                    <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-white font-semibold">{cafe.rating}</span>
                      <span className="text-white/50 text-sm">({cafe.reviewCount})</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-white mb-1">{cafe.name}</h3>
                        <p className="text-white/50 text-sm flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {cafe.location.address}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-amber-400 text-sm font-medium">{cafe.vibe}</span>
                      </div>
                    </div>

                    <p className="text-white/60 text-sm mb-4 line-clamp-2">
                      {cafe.description}
                    </p>

                    {/* Distance Badge */}
                    {cafe.distance !== undefined && (
                      <div className="mb-3">
                        <Badge className="bg-blue-500/20 text-blue-400 text-xs">
                          <Navigation className="w-3 h-3 mr-1" />
                          {cafe.distance} km away
                        </Badge>
                      </div>
                    )}

                    {/* Pros & Cons Preview */}
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                        <div className="flex items-center gap-1 text-green-400 text-xs mb-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>Pros</span>
                        </div>
                        <p className="text-white/70 text-xs line-clamp-1">{cafe.pros[0]}</p>
                      </div>
                      <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20">
                        <div className="flex items-center gap-1 text-red-400 text-xs mb-1">
                          <ThumbsDown className="w-3 h-3" />
                          <span>Cons</span>
                        </div>
                        <p className="text-white/70 text-xs line-clamp-1">{cafe.cons[0]}</p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {cafe.features.slice(0, 4).map(feature => (
                        <span 
                          key={feature} 
                          className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70"
                        >
                          {feature}
                        </span>
                      ))}
                      {cafe.features.length > 4 && (
                        <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/50">
                          +{cafe.features.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Signature Drinks */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-white/50 text-sm">Signature:</span>
                      <div className="flex gap-1 flex-wrap">
                        {cafe.signatureDrinks.slice(0, 2).map(drink => (
                          <Badge key={drink} variant="secondary" className="bg-amber-500/20 text-amber-400 text-xs">
                            {drink}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4 text-white/50 text-sm">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>Open Now</span>
                        </div>
                        {cafe.weeklyOrders && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            <span>{cafe.weeklyOrders} orders/wk</span>
                          </div>
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        className="bg-amber-500 hover:bg-amber-600 text-white"
                      >
                        View Details <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="map"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass-card h-[600px] relative overflow-hidden"
            >
              {/* Mock Map */}
              <div className="absolute inset-0 bg-slate-800">
                <div className="absolute inset-0 opacity-30">
                  <svg className="w-full h-full" viewBox="0 0 800 600">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <line key={`h-${i}`} x1="0" y1={i * 30} x2="800" y2={i * 30} stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    ))}
                    {Array.from({ length: 27 }).map((_, i) => (
                      <line key={`v-${i}`} x1={i * 30} y1="0" x2={i * 30} y2="600" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
                    ))}
                    
                    {/* Lake Phewa approximation */}
                    <ellipse cx="400" cy="300" rx="150" ry="100" fill="rgba(59,130,246,0.2)" />
                    
                    {/* Roads */}
                    <path d="M 0 300 Q 200 280 400 300 T 800 300" stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="none" />
                    <path d="M 400 0 Q 420 200 400 300 T 400 600" stroke="rgba(255,255,255,0.2)" strokeWidth="3" fill="none" />
                  </svg>
                </div>

                {/* Cafe Pins */}
                {filteredCafes.map((cafe, index) => {
                  const x = 200 + (parseInt(cafe.id) * 35) % 400;
                  const y = 150 + (parseInt(cafe.id) * 45) % 300;
                  
                  return (
                    <motion.button
                      key={cafe.id}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleCafeClick(cafe)}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                      style={{ left: x, top: y }}
                    >
                      <div className="relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                          cafe.rankingPosition && cafe.rankingPosition <= 3
                            ? 'bg-yellow-500'
                            : 'bg-amber-500'
                        }`}>
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-3 bg-amber-500 rotate-45" />
                        
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="glass px-3 py-2 rounded-lg whitespace-nowrap">
                            <p className="text-white text-sm font-medium">{cafe.name}</p>
                            <div className="flex items-center gap-2 text-white/60 text-xs">
                              <span>★ {cafe.rating}</span>
                              {cafe.distance && <span>📍 {cafe.distance}km</span>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}

                {/* Current Location */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg" />
                  <div className="absolute inset-0 w-4 h-4 rounded-full bg-blue-500 animate-ping opacity-50" />
                </div>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <Button 
                  size="icon" 
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="glass border-white/10 text-white hover:bg-white/10"
                >
                  <Locate className={`w-5 h-5 ${isLocating ? 'animate-spin' : ''}`} />
                </Button>
              </div>

              {/* Cafe List Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
                  {filteredCafes.slice(0, 5).map((cafe) => (
                    <motion.button
                      key={cafe.id}
                      onClick={() => handleCafeClick(cafe)}
                      whileHover={{ scale: 1.02 }}
                      className="flex-shrink-0 glass-card p-3 flex items-center gap-3 min-w-[250px]"
                    >
                      <img 
                        src={cafe.image} 
                        alt={cafe.name}
                        className="w-14 h-14 rounded-lg object-cover"
                      />
                      <div className="text-left">
                        <p className="text-white font-medium text-sm">{cafe.name}</p>
                        <div className="flex items-center gap-2 text-white/50 text-xs">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span>{cafe.rating}</span>
                          {cafe.distance && <span>📍 {cafe.distance}km</span>}
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {filteredCafes.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center">
              <Search className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="text-white font-medium mb-2">No cafes found</h3>
            <p className="text-white/50 text-sm">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
