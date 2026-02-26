import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  ChefHat, 
  Bike, 
  Package, 
  MapPin, 
  ChevronRight,
  RotateCcw,
  Star,
  Calendar
} from 'lucide-react';
import { useStore } from '@/store';
import { coffeeProducts } from '@/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import type { Order } from '@/types';

export function OrdersView() {
  const { cart, clearCart, showToast, addOrderToHistory, user, updateUserStats } = useStore();
  const [activeTab, setActiveTab] = useState('active');
  const [orderStatus, setOrderStatus] = useState<'pending' | 'preparing' | 'ready' | 'delivered'>('pending');

  // Real order history from store (persisted); show in History tab
  const orderHistory = useStore((s) => s.orderHistory);

  const statusSteps = [
    { id: 'pending', label: 'Order Placed', icon: CheckCircle2 },
    { id: 'preparing', label: 'Preparing', icon: ChefHat },
    { id: 'ready', label: 'Ready', icon: Package },
    { id: 'delivered', label: 'Delivered', icon: Bike },
  ];

  const getStatusProgress = (status: string) => {
    const index = statusSteps.findIndex(s => s.id === status);
    return ((index + 1) / statusSteps.length) * 100;
  };

  const handleReorder = (order: Order) => {
    showToast('Items added to cart!', 'success');
  };

  const handlePlaceOrder = () => {
    if (!cart || cart.items.length === 0) return;
    const order: Order = {
      id: `ORD-${Date.now()}`,
      items: cart.items,
      cafeName: cart.cafeName,
      cafeId: cart.cafeId,
      type: cart.type,
      status: 'pending',
      total: cart.total,
      createdAt: new Date().toISOString(),
    };
    addOrderToHistory(order, user?.name);
    updateUserStats({
      totalOrders: (user?.stats?.totalOrders ?? 0) + 1,
      totalSpent: (user?.stats?.totalSpent ?? 0) + cart.total,
    });
    clearCart();
    showToast('Order placed! Tracking progress…', 'success');
    simulateOrderProgress();
  };

  const simulateOrderProgress = () => {
    const statuses: Array<'pending' | 'preparing' | 'ready' | 'delivered'> = ['pending', 'preparing', 'ready', 'delivered'];
    let currentIndex = 0;
    
    const interval = setInterval(() => {
      currentIndex++;
      if (currentIndex < statuses.length) {
        setOrderStatus(statuses[currentIndex]);
      } else {
        clearInterval(interval);
        showToast('Order delivered! Enjoy your coffee!', 'success');
      }
    }, 3000);
  };

  return (
    <div className="min-h-screen pb-24 pt-20 md:pt-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            My <span className="text-gradient">Orders</span>
          </h1>
          <p className="text-white/60">Track your orders and view your history</p>
        </motion.div>

        {/* Cart Section */}
        {cart && cart.items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  Current Cart
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearCart}
                  className="text-red-400 hover:text-red-300"
                >
                  Clear Cart
                </Button>
              </div>

              <div className="space-y-4 mb-6">
                {cart.items.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white/5"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{item.name}</h3>
                      <p className="text-white/50 text-sm">
                        {item.size} • {item.milk} milk • {item.sweetness}/5 sweet
                        {item.addOns.length > 0 && ` • ${item.addOns.join(', ')}`}
                      </p>
                      <p className="text-amber-400 text-sm">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-white font-semibold">Rs. {item.price * item.quantity}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="text-white/60 text-sm">Total</p>
                  <p className="text-2xl font-bold text-white">Rs. {cart.total}</p>
                </div>
                <Button 
                  onClick={handlePlaceOrder}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-8"
                >
                  Place Order
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Order Tracking */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="glass border-white/10 mb-6">
            <TabsTrigger value="active" className="data-[state=active]:bg-amber-500">
              Active Orders
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-amber-500">
              Order History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-0">
            {/* Demo Active Order */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-white/60 text-sm">Order #MOOD-2024-001</p>
                  <h3 className="text-xl font-semibold text-white">Himalayan Java</h3>
                </div>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                  {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                </Badge>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <Progress 
                  value={getStatusProgress(orderStatus)} 
                  className="h-2 bg-white/10"
                />
                <div className="flex justify-between mt-3">
                  {statusSteps.map((step, index) => {
                    const Icon = step.icon;
                    const isActive = statusSteps.findIndex(s => s.id === orderStatus) >= index;
                    const isCurrent = step.id === orderStatus;
                    
                    return (
                      <div key={step.id} className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                          isActive 
                            ? isCurrent 
                              ? 'bg-amber-500 text-white' 
                              : 'bg-green-500 text-white'
                            : 'bg-white/10 text-white/40'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className={`text-xs ${isActive ? 'text-white' : 'text-white/40'}`}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                  <img 
                    src={coffeeProducts[0].image} 
                    alt="Coffee"
                    className="w-14 h-14 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="text-white font-medium">Himalayan Arabica Pour-Over</h4>
                    <p className="text-white/50 text-sm">Medium • Oat milk • 3/5 sweet</p>
                  </div>
                  <p className="text-white font-semibold">Rs. 380</p>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Pickup at Himalayan Java</p>
                  <p className="text-white/50 text-sm">Lakeside Rd, Pokhara 33700</p>
                </div>
                <Button size="sm" variant="outline" className="glass border-white/10 text-white">
                  <MapPin className="w-4 h-4 mr-2" />
                  View Map
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          <TabsContent value="history" className="mt-0">
            <div className="space-y-4">
              {orderHistory.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-card p-8 text-center"
                >
                  <ShoppingBag className="w-12 h-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/70 font-medium">No orders yet</p>
                  <p className="text-white/50 text-sm mt-1">Orders you place will appear here.</p>
                </motion.div>
              ) : orderHistory.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="glass-card p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-white/60 text-sm">{order.id}</p>
                        <Badge className={
                          order.status === 'delivered' ? 'bg-green-500/20 text-green-400' :
                          order.status === 'ready' ? 'bg-amber-500/20 text-amber-400' :
                          order.status === 'preparing' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-white/20 text-white/80'
                        } text-xs capitalize">
                          {order.status}
                        </Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-white">{order.cafeName || 'Pickup'}</h3>
                      <p className="text-white/50 text-sm flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(order.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-white">Rs. {order.total}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-10 h-10 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="text-white text-sm">{item.name}</p>
                          <p className="text-white/50 text-xs">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-white/10">
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleReorder(order)}
                      className="flex-1 glass border-white/10 text-white hover:bg-white/10"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reorder
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 glass border-white/10 text-white hover:bg-white/10"
                    >
                      <Star className="w-4 h-4 mr-2" />
                      Rate
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
