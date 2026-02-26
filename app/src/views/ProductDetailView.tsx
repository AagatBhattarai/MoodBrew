import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, Clock, Flame, Droplets, Heart, Share2, Info, ChevronRight, Plus, Minus } from 'lucide-react';
import { useStore } from '@/store';
import { coffeeProducts, moodConfigs } from '@/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { OrderItem } from '@/types';

export function ProductDetailView() {
  const { selectedProduct, setView, addToCart, showToast, currentMood } = useStore();
  const [size, setSize] = useState<'small' | 'medium' | 'large'>('medium');
  const [milk, setMilk] = useState('regular');
  const [sweetness, setSweetness] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [isLiked, setIsLiked] = useState(false);

  if (!selectedProduct) {
    setView('products');
    return null;
  }

  const sizeMultipliers = { small: 0.8, medium: 1, large: 1.3 };
  const milkPrices: Record<string, number> = { 
    regular: 0, 
    oat: 50, 
    almond: 60, 
    coconut: 70,
    soy: 50 
  };
  const addOnPrices: Record<string, number> = {
    'Extra Shot': 40,
    'Whipped Cream': 30,
    'Caramel Drizzle': 25,
    'Chocolate Shavings': 20,
  };

  const calculatePrice = () => {
    let price = selectedProduct.price * sizeMultipliers[size];
    price += milkPrices[milk] || 0;
    price += selectedAddOns.reduce((sum, addon) => sum + (addOnPrices[addon] || 0), 0);
    return Math.round(price * quantity);
  };

  const handleAddToCart = () => {
    const item: OrderItem = {
      productId: selectedProduct.id,
      name: selectedProduct.name,
      image: selectedProduct.image,
      size,
      milk,
      sweetness,
      addOns: selectedAddOns,
      quantity,
      price: calculatePrice() / quantity,
    };
    addToCart(item);
    showToast('Added to cart!', 'success');
  };

  const toggleAddOn = (addon: string) => {
    setSelectedAddOns(prev => 
      prev.includes(addon) 
        ? prev.filter(a => a !== addon)
        : [...prev, addon]
    );
  };

  const similarProducts = coffeeProducts
    .filter(p => p.id !== selectedProduct.id && 
      (p.category === selectedProduct.category || 
       p.bestFor.some(m => selectedProduct.bestFor.includes(m))))
    .slice(0, 3);

  return (
    <div className="min-h-screen pb-24 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setView('products')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Discover
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            <div className="relative aspect-square rounded-3xl overflow-hidden glass-card">
              <motion.img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLiked(!isLiked)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    isLiked ? 'bg-red-500 text-white' : 'bg-black/40 backdrop-blur-sm text-white'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm text-white flex items-center justify-center"
                >
                  <Share2 className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Badges */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                {selectedProduct.isSignature && (
                  <Badge className="bg-amber-500/90 text-white">
                    Signature Drink
                  </Badge>
                )}
                {selectedProduct.isNew && (
                  <Badge className="bg-green-500/90 text-white">
                    New
                  </Badge>
                )}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 mt-4">
              {[selectedProduct.image, selectedProduct.image, selectedProduct.image].map((img, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05 }}
                  className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-2 ${
                    i === 0 ? 'border-amber-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Title & Rating */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {selectedProduct.name}
                </h1>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white font-semibold">{selectedProduct.rating}</span>
                    <span className="text-white/50">({selectedProduct.reviewCount} reviews)</span>
                  </div>
                  <span className="text-white/30">|</span>
                  <div className="flex items-center gap-1 text-white/60">
                    <Clock className="w-4 h-4" />
                    <span>{selectedProduct.prepTime} min prep</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-amber-400">Rs. {calculatePrice()}</p>
                {quantity > 1 && (
                  <p className="text-white/50 text-sm">Rs. {Math.round(calculatePrice() / quantity)} each</p>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-white/70 text-lg mb-6 leading-relaxed">
              {selectedProduct.description}
            </p>

            {/* Flavor Profile */}
            <div className="glass-card p-5 mb-6">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-400" />
                Flavor Profile
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Intensity', value: selectedProduct.intensity, icon: Flame, color: 'from-orange-500 to-red-500' },
                  { label: 'Caffeine', value: selectedProduct.caffeineLevel, icon: Droplets, color: 'from-amber-500 to-orange-500' },
                  { label: 'Sweetness', value: selectedProduct.sweetness, icon: () => <span className="text-lg">🍯</span>, color: 'from-yellow-400 to-amber-500' },
                  { label: 'Acidity', value: selectedProduct.acidity, icon: () => <span className="text-lg">🍋</span>, color: 'from-green-400 to-yellow-400' },
                  { label: 'Body', value: selectedProduct.body, icon: () => <span className="text-lg">☕</span>, color: 'from-amber-600 to-amber-800' },
                ].map((metric) => (
                  <div key={metric.label} className="flex items-center gap-4">
                    <div className="w-24 flex items-center gap-2 text-white/60 text-sm">
                      <metric.icon className="w-4 h-4" />
                      <span>{metric.label}</span>
                    </div>
                    <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(metric.value / 10) * 100}%` }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                        className={`h-full bg-gradient-to-r ${metric.color}`}
                      />
                    </div>
                    <span className="w-8 text-white/60 text-sm text-right">{metric.value}/10</span>
                  </div>
                ))}
              </div>

              {/* Flavor Notes */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-white/60 text-sm mb-2">Flavor Notes:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.flavorNotes.map(note => (
                    <Badge key={note} variant="secondary" className="bg-white/10 text-white/80">
                      {note}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Configurator */}
            <div className="glass-card p-5 mb-6">
              <h3 className="font-semibold text-white mb-4">Customize Your Drink</h3>
              
              {/* Size Selection */}
              <div className="mb-5">
                <label className="text-white/60 text-sm mb-2 block">Size</label>
                <div className="flex gap-2">
                  {(['small', 'medium', 'large'] as const).map((s) => (
                    <motion.button
                      key={s}
                      onClick={() => setSize(s)}
                      whileTap={{ scale: 0.95 }}
                      className={`flex-1 py-3 px-4 rounded-xl font-medium capitalize transition-all ${
                        size === s
                          ? 'bg-amber-500 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {s}
                      <span className="block text-xs opacity-70">
                        {s === 'small' ? '8 oz' : s === 'medium' ? '12 oz' : '16 oz'}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Milk Selection */}
              <div className="mb-5">
                <label className="text-white/60 text-sm mb-2 block">Milk</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'regular', label: 'Regular', price: 0 },
                    { id: 'oat', label: 'Oat', price: 50 },
                    { id: 'almond', label: 'Almond', price: 60 },
                    { id: 'coconut', label: 'Coconut', price: 70 },
                    { id: 'soy', label: 'Soy', price: 50 },
                  ].map((m) => (
                    <motion.button
                      key={m.id}
                      onClick={() => setMilk(m.id)}
                      whileTap={{ scale: 0.95 }}
                      className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        milk === m.id
                          ? 'bg-amber-500 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {m.label}
                      {m.price > 0 && <span className="ml-1 text-xs opacity-70">+Rs. {m.price}</span>}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Sweetness Slider */}
              <div className="mb-5">
                <label className="text-white/60 text-sm mb-2 block">
                  Sweetness: {sweetness}/5
                </label>
                <Slider
                  value={[sweetness]}
                  onValueChange={(v) => setSweetness(v[0])}
                  max={5}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Add-ons */}
              <div className="mb-5">
                <label className="text-white/60 text-sm mb-2 block">Add-ons</label>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(addOnPrices).map(([addon, price]) => (
                    <motion.button
                      key={addon}
                      onClick={() => toggleAddOn(addon)}
                      whileTap={{ scale: 0.95 }}
                      className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${
                        selectedAddOns.includes(addon)
                          ? 'bg-amber-500 text-white'
                          : 'bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      {addon}
                      <span className="ml-1 text-xs opacity-70">+Rs. {price}</span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <label className="text-white/60 text-sm">Quantity</label>
                <div className="flex items-center gap-3">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded-lg bg-white/5 text-white flex items-center justify-center hover:bg-white/10"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="text-white font-semibold w-8 text-center">{quantity}</span>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded-lg bg-white/5 text-white flex items-center justify-center hover:bg-white/10"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
            </div>

            {/* AI Recommendation */}
            {currentMood && selectedProduct.bestFor.includes(currentMood) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-4 mb-6 border-amber-500/30"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xl">✨</span>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">Perfect for your mood!</p>
                    <p className="text-white/60 text-sm">
                      This drink is specially recommended for when you're feeling {' '}
                      <span className="text-amber-400">
                        {moodConfigs.find(m => m.id === currentMood)?.label}
                      </span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Add to Cart Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                onClick={handleAddToCart}
                className="w-full h-14 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-semibold text-lg rounded-xl"
              >
                Add to Cart - Rs. {calculatePrice()}
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-16"
          >
            <h2 className="text-2xl font-bold text-white mb-6">Similar Brews</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {similarProducts.map((product) => (
                <motion.div
                  key={product.id}
                  onClick={() => setView('products')}
                  className="glass-card overflow-hidden cursor-pointer group"
                  whileHover={{ y: -4 }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                    <p className="text-amber-400 font-medium">Rs. {product.price}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
