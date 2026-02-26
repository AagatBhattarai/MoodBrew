import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { api } from '../lib/api';
import { staggerContainer, staggerItem, fadeInUp } from '../components/animations';

interface OrderItem { name: string; quantity: number; totalItemPrice?: number; price?: string; }
interface Order {
  id: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  items: OrderItem[];
  total_amount: number;
  created_at: string;
  delivery_address?: string;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: '⏳', variant: 'neutral' as const },
  preparing: { label: 'Preparing', color: 'bg-blue-100 text-blue-700', icon: '👨‍🍳', variant: 'discount' as const },
  ready: { label: 'Ready', color: 'bg-green-100 text-green-700', icon: '✅', variant: 'calorie' as const },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-700', icon: '✓', variant: 'neutral' as const },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: '✗', variant: 'neutral' as const },
};

function formatDate(dateStr: string) {
  try { return new Date(dateStr).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }); }
  catch { return dateStr; }
}

interface MyOrdersProps { onBack?: () => void; }

export function MyOrders({ onBack }: MyOrdersProps = {}) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    api.orders.getAll()
      .then((data: Order[]) => setOrders(data || []))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const filteredOrders = orders.filter(o => {
    if (activeFilter === 'active') return ['pending', 'preparing', 'ready'].includes(o.status);
    if (activeFilter === 'completed') return o.status === 'completed';
    return true;
  });

  const totalSpent = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <div className="flex flex-col gap-lg">
      {onBack && <Button variant="outline" onClick={onBack} className="self-start">← Back to Home</Button>}

      {/* Header */}
      <motion.div variants={fadeInUp} initial="initial" animate="animate" className="flex flex-col gap-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h1 font-bold text-text-primary mb-2">My Orders</h2>
            <p className="text-body-md text-text-secondary">Track your coffee journey ☕</p>
          </div>
          <motion.div className="flex items-center gap-2 px-4 py-2 rounded-pill bg-primary/10" whileHover={{ scale: 1.05 }}>
            <span className="text-h3 font-bold text-primary">{orders.length}</span>
            <span className="text-body-sm text-text-secondary">Total</span>
          </motion.div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-sm">
          {(['all', 'active', 'completed'] as const).map(f => (
            <motion.button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-md py-2 rounded-lg text-body-md font-semibold transition ${activeFilter === f ? 'bg-primary text-surface' : 'bg-surface text-text-secondary hover:bg-primary/10'
                }`}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            >
              {f === 'all' && '📋 All'}{f === 'active' && '🔥 Active'}{f === 'completed' && '✓ Completed'}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Loading skeleton */}
      {isLoading && (
        <div className="flex flex-col gap-md">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-surface animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && filteredOrders.length === 0 && (
        <Card glass className="text-center py-xl">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="text-6xl mb-md">📦</div>
            <h3 className="text-h3 font-bold text-text-primary mb-2">No orders yet</h3>
            <p className="text-body-md text-text-secondary mb-md">Start brewing your perfect cup!</p>
            <Button onClick={onBack}>Browse Menu</Button>
          </motion.div>
        </Card>
      )}

      {/* Orders list */}
      {!isLoading && filteredOrders.length > 0 && (
        <motion.div className="flex flex-col gap-md" variants={staggerContainer} initial="initial" animate="animate">
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, index) => {
              const isExpanded = expandedOrder === order.id;
              const statusInfo = statusConfig[order.status] || statusConfig.pending;
              const isActive = ['preparing', 'ready', 'pending'].includes(order.status);
              const itemList = Array.isArray(order.items) ? order.items : [];

              return (
                <motion.div
                  key={order.id}
                  variants={staggerItem}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    glass glowOnHover
                    className={`cursor-pointer ${isActive ? 'ring-2 ring-primary/30' : ''}`}
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex flex-col gap-md">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-sm mb-1">
                            <span className="text-h3 font-bold text-text-primary">
                              #{String(order.id).padStart(4, '0')}
                            </span>
                            {isActive ? (
                              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                                <Badge variant={statusInfo.variant}>{statusInfo.icon} {statusInfo.label}</Badge>
                              </motion.div>
                            ) : (
                              <Badge variant={statusInfo.variant}>{statusInfo.icon} {statusInfo.label}</Badge>
                            )}
                          </div>
                          <p className="text-body-sm text-text-secondary">📅 {formatDate(order.created_at)}</p>
                          {order.delivery_address && (
                            <p className="text-body-sm text-text-secondary">📍 {order.delivery_address}</p>
                          )}
                        </div>
                        <p className="text-h3 font-bold text-primary">${(order.total_amount || 0).toFixed(2)}</p>
                      </div>

                      {/* Items preview */}
                      <div className="flex flex-wrap gap-2">
                        {itemList.slice(0, isExpanded ? undefined : 2).map((item, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-center gap-2 px-sm py-1 rounded-pill bg-background text-body-sm"
                            initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <span>☕</span>
                            <span className="text-text-primary">{item.quantity || 1}x {item.name}</span>
                          </motion.div>
                        ))}
                        {!isExpanded && itemList.length > 2 && (
                          <div className="px-sm py-1 rounded-pill bg-primary/10 text-body-sm text-primary font-semibold">
                            +{itemList.length - 2} more
                          </div>
                        )}
                      </div>

                      {/* Expanded detail */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}
                          >
                            <div className="pt-md border-t border-background space-y-sm">
                              {itemList.map((item, idx) => (
                                <div key={idx} className="flex justify-between py-sm">
                                  <div className="flex items-center gap-sm">
                                    <span className="text-text-secondary">{item.quantity || 1}x</span>
                                    <span className="text-text-primary">{item.name}</span>
                                  </div>
                                  <span className="font-semibold">
                                    ${(item.totalItemPrice || 0).toFixed(2)}
                                  </span>
                                </div>
                              ))}
                              <div className="flex justify-between pt-sm border-t border-background">
                                <span className="font-bold text-text-primary">Total</span>
                                <span className="text-h3 font-bold text-primary">${(order.total_amount || 0).toFixed(2)}</span>
                              </div>
                            </div>
                            <div className="flex gap-sm mt-md">
                              {isActive && <Button variant="primary" className="flex-1">Track Order</Button>}
                              <Button variant="outline" className="flex-1">Re-order</Button>
                              <Button variant="outline">📄 Receipt</Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <motion.div
                        className="flex justify-center text-body-sm text-text-secondary"
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                      >▼</motion.div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Stats summary */}
      {!isLoading && orders.length > 0 && (
        <Card glass glowOnHover>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
            {[
              { label: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, icon: '💰', color: 'text-green-600' },
              { label: 'Orders Placed', value: String(orders.length), icon: '📊', color: 'text-blue-600' },
              { label: 'Active Orders', value: String(orders.filter(o => ['pending', 'preparing', 'ready'].includes(o.status)).length), icon: '🔥', color: 'text-orange-600' },
              { label: 'Completed', value: String(orders.filter(o => o.status === 'completed').length), icon: '✅', color: 'text-emerald-600' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="flex flex-col items-center text-center p-md rounded-xl bg-surface"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className={`text-h2 font-bold ${stat.color} mb-1`}>{stat.value}</div>
                <div className="text-body-sm text-text-secondary">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
