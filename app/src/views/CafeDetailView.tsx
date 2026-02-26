import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Star, Clock, Phone, MapPin, Navigation, Heart, Share2, ThumbsUp, ThumbsDown, Coffee, ChevronRight, TrendingUp, Award } from 'lucide-react';
import { useStore } from '@/store';
import { coffeeProducts } from '@/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

export function CafeDetailView() {
  const { selectedCafe, setView, setSelectedProduct, addToCart, showToast } = useStore();
  const [isLiked, setIsLiked] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  if (!selectedCafe) {
    setView('cafes');
    return null;
  }

  // Get menu items for this cafe
  const cafeMenu = coffeeProducts.filter(p => p.cafeId === selectedCafe.id || !p.cafeId).slice(0, 8);

  const handleProductClick = (product: typeof coffeeProducts[0]) => {
    setSelectedProduct(product);
    setView('product-detail');
  };

  const handleQuickOrder = (product: typeof coffeeProducts[0], e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      productId: product.id,
      name: product.name,
      image: product.image,
      size: 'medium',
      milk: 'regular',
      sweetness: 3,
      addOns: [],
      quantity: 1,
      price: product.price,
    });
    showToast(`Added ${product.name} to cart!`, 'success');
  };

  const reviews = [
    { id: 1, name: 'Sarah M.', rating: 5, comment: 'Amazing coffee and the view is unbeatable! The ' + selectedCafe.signatureDrinks[0] + ' is a must-try.', date: '2 days ago', avatar: 'S' },
    { id: 2, name: 'Raj K.', rating: 4, comment: 'Great atmosphere, loved the signature drinks. ' + selectedCafe.pros[0], date: '1 week ago', avatar: 'R' },
    { id: 3, name: 'Emma L.', rating: 5, comment: 'Best coffee in Pokhara, hands down. ' + selectedCafe.pros[1], date: '2 weeks ago', avatar: 'E' },
  ];

  return (
    <div className="min-h-screen pb-24 pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => setView('cafes')}
          className="flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Cafes
        </motion.button>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Main Image */}
            <div className="lg:col-span-2 relative h-64 md:h-96 rounded-2xl overflow-hidden">
              <motion.img
                src={selectedCafe.image}
                alt={selectedCafe.name}
                className="w-full h-full object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Ranking Badge */}
              {selectedCafe.rankingPosition && selectedCafe.rankingPosition <= 5 && (
                <div className="absolute top-4 left-4">
                  <Badge className="bg-yellow-500 text-black font-bold">
                    <Award className="w-4 h-4 mr-1" />
                    #{selectedCafe.rankingPosition} in Pokhara This Week
                  </Badge>
                </div>
              )}
              
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

              {/* Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-end justify-between">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                      {selectedCafe.name}
                    </h1>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <span className="text-white font-semibold">{selectedCafe.rating}</span>
                        <span className="text-white/50">({selectedCafe.reviewCount} reviews)</span>
                      </div>
                      <span className="text-white/30">|</span>
                      <span className="text-amber-400">{selectedCafe.vibe}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gallery */}
            <div className="flex lg:flex-col gap-2">
              {selectedCafe.gallery.map((img, index) => (
                <motion.button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  whileHover={{ scale: 1.02 }}
                  className={`flex-1 lg:flex-none h-20 lg:h-28 rounded-xl overflow-hidden border-2 transition-colors ${
                    activeImage === index ? 'border-amber-500' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Pros & Cons Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          <div className="glass-card p-5 border-green-500/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <ThumbsUp className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Pros</h3>
            </div>
            <ul className="space-y-2">
              {selectedCafe.pros.map((pro, index) => (
                <li key={index} className="flex items-start gap-2 text-white/70 text-sm">
                  <span className="text-green-400 mt-0.5">✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-5 border-red-500/20">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <ThumbsDown className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Cons</h3>
            </div>
            <ul className="space-y-2">
              {selectedCafe.cons.map((con, index) => (
                <li key={index} className="flex items-start gap-2 text-white/70 text-sm">
                  <span className="text-red-400 mt-0.5">•</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="menu" className="w-full">
            <TabsList className="glass border-white/10 mb-6">
              <TabsTrigger value="menu" className="data-[state=active]:bg-amber-500">
                <Coffee className="w-4 h-4 mr-2" />
                Menu
              </TabsTrigger>
              <TabsTrigger value="about" className="data-[state=active]:bg-amber-500">
                <MapPin className="w-4 h-4 mr-2" />
                About
              </TabsTrigger>
              <TabsTrigger value="reviews" className="data-[state=active]:bg-amber-500">
                <Star className="w-4 h-4 mr-2" />
                Reviews
              </TabsTrigger>
            </TabsList>

            <TabsContent value="menu" className="mt-0">
              {/* Signature Drinks Banner */}
              <div className="glass-card p-4 mb-6 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/30">
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-amber-400" />
                  <div>
                    <p className="text-white font-medium">Signature Drinks</p>
                    <p className="text-white/60 text-sm">{selectedCafe.signatureDrinks.join(' • ')}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {cafeMenu.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleProductClick(product)}
                    className="glass-card overflow-hidden cursor-pointer group"
                    whileHover={{ y: -4 }}
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      {product.isNepaliOrigin && (
                        <Badge className="absolute top-2 right-2 bg-green-500/80 text-white text-xs">
                          🇳🇵 Nepali
                        </Badge>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-white mb-1">{product.name}</h3>
                      <p className="text-white/60 text-sm mb-2 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-amber-400 font-medium">Rs. {product.price}</p>
                        <Button 
                          size="sm" 
                          className="bg-amber-500 hover:bg-amber-600"
                          onClick={(e) => handleQuickOrder(product, e)}
                        >
                          Add
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="about" className="mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Info Card */}
                <div className="glass-card p-6">
                  <h3 className="text-xl font-semibold text-white mb-4">About</h3>
                  <p className="text-white/70 leading-relaxed mb-6">
                    {selectedCafe.description}
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Address</p>
                        <p className="text-white/60 text-sm">{selectedCafe.location.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Phone</p>
                        <p className="text-white/60 text-sm">{selectedCafe.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-white font-medium">Opening Hours</p>
                        <div className="text-white/60 text-sm space-y-1 mt-1">
                          {Object.entries(selectedCafe.openingHours).map(([day, hours]) => (
                            <div key={day} className="flex justify-between">
                              <span className="capitalize">{day}</span>
                              <span>{hours}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features & Stats */}
                <div className="space-y-6">
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCafe.features.map(feature => (
                        <Badge key={feature} className="bg-white/10 text-white/80 px-3 py-1">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Weekly Stats */}
                  <div className="glass-card p-6">
                    <h3 className="text-xl font-semibold text-white mb-4">This Week</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 rounded-xl bg-white/5">
                        <p className="text-2xl font-bold text-amber-400">{selectedCafe.weeklyOrders}</p>
                        <p className="text-white/50 text-sm">Orders</p>
                      </div>
                      <div className="text-center p-4 rounded-xl bg-white/5">
                        <p className="text-2xl font-bold text-white">#{selectedCafe.rankingPosition}</p>
                        <p className="text-white/50 text-sm">Ranking</p>
                      </div>
                    </div>
                  </div>

                  {/* Map Embed */}
                  <div className="glass-card p-4 h-48 relative overflow-hidden rounded-xl">
                    <div className="absolute inset-0 bg-slate-700">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                          <p className="text-white font-medium">{selectedCafe.name}</p>
                          <p className="text-white/50 text-sm">{selectedCafe.location.address}</p>
                          <Button size="sm" className="mt-3 bg-amber-500 hover:bg-amber-600">
                            <Navigation className="w-4 h-4 mr-2" />
                            Get Directions
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="mt-0">
              <div className="max-w-2xl">
                {/* Rating Summary */}
                <div className="glass-card p-6 mb-6">
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-5xl font-bold text-white">{selectedCafe.rating}</p>
                      <div className="flex items-center justify-center gap-1 my-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <Star 
                            key={star} 
                            className={`w-4 h-4 ${star <= Math.round(selectedCafe.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} 
                          />
                        ))}
                      </div>
                      <p className="text-white/50 text-sm">{selectedCafe.reviewCount} reviews</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map(rating => (
                        <div key={rating} className="flex items-center gap-3">
                          <span className="text-white/60 text-sm w-4">{rating}</span>
                          <Star className="w-4 h-4 text-yellow-400" />
                          <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-yellow-400 rounded-full"
                              style={{ width: `${Math.random() * 60 + 20}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {reviews.map((review, index) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card p-5"
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12 border-2 border-white/20">
                          <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                            {review.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="text-white font-medium">{review.name}</p>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(star => (
                                  <Star 
                                    key={star} 
                                    className={`w-3 h-3 ${star <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/20'}`} 
                                  />
                                ))}
                              </div>
                            </div>
                            <span className="text-white/40 text-sm">{review.date}</span>
                          </div>
                          <p className="text-white/70">{review.comment}</p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
