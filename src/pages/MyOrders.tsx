import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { staggerContainer, staggerItem, fadeInUp } from '../components/animations';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  items: {
    name: string;
    quantity: number;
    price: string;
  }[];
  total: string;
  cafe: string;
  estimatedTime?: string;
}

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: '#MB2024-001',
    date: '2024-01-14 10:30 AM',
    status: 'preparing',
    items: [
      { name: 'Caramel Latte', quantity: 2, price: '$11' },
      { name: 'Chocolate Croissant', quantity: 1, price: '$5' },
    ],
    total: '$27',
    cafe: 'MoodBrew Downtown',
    estimatedTime: '15 min',
  },
  {
    id: '2',
    orderNumber: '#MB2024-002',
    date: '2024-01-13 03:45 PM',
    status: 'completed',
    items: [
      { name: 'Espresso Shot', quantity: 3, price: '$4' },
      { name: 'Blueberry Muffin', quantity: 2, price: '$6' },
    ],
    total: '$24',
    cafe: 'MoodBrew Central',
  },
  {
    id: '3',
    orderNumber: '#MB2024-003',
    date: '2024-01-12 09:15 AM',
    status: 'completed',
    items: [
      { name: 'Flat White', quantity: 1, price: '$9' },
      { name: 'Avocado Toast', quantity: 1, price: '$12' },
    ],
    total: '$21',
    cafe: 'MoodBrew Downtown',
  },
  {
    id: '4',
    orderNumber: '#MB2024-004',
    date: '2024-01-11 02:20 PM',
    status: 'completed',
    items: [
      { name: 'Iced Mocha', quantity: 1, price: '$10' },
      { name: 'Chocolate Chip Cookie', quantity: 3, price: '$4' },
    ],
    total: '$22',
    cafe: 'MoodBrew Uptown',
  },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: '⏳', variant: 'neutral' as const },
  preparing: { label: 'Preparing', color: 'bg-blue-100 text-blue-700', icon: '👨‍🍳', variant: 'discount' as const },
  ready: { label: 'Ready', color: 'bg-green-100 text-green-700', icon: '✅', variant: 'calorie' as const },
  completed: { label: 'Completed', color: 'bg-gray-100 text-gray-700', icon: '✓', variant: 'neutral' as const },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: '✗', variant: 'neutral' as const },
};

interface MyOrdersProps {
  onBack?: () => void;
}

export function MyOrders({ onBack }: MyOrdersProps = {}) {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const filteredOrders = mockOrders.filter((order) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return order.status === 'pending' || order.status === 'preparing' || order.status === 'ready';
    if (activeFilter === 'completed') return order.status === 'completed';
    return true;
  });

  return (
    <div className="flex flex-col gap-lg">
      {/* Back Button */}
      {onBack && (
        <Button variant="outline" onClick={onBack} className="self-start">
          ← Back to Home
        </Button>
      )}
      
      {/* Header */}
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-md"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h1 font-bold text-text-primary mb-2">My Orders</h2>
            <p className="text-body-md text-text-secondary">
              Track your coffee journey ☕
            </p>
          </div>
          <motion.div
            className="flex items-center gap-2 px-4 py-2 rounded-pill bg-primary/10"
            whileHover={{ scale: 1.05 }}
          >
            <span className="text-h3 font-bold text-primary">{mockOrders.length}</span>
            <span className="text-body-sm text-text-secondary">Total Orders</span>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-sm">
          {(['all', 'active', 'completed'] as const).map((filter) => (
            <motion.button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-md py-2 rounded-lg text-body-md font-semibold transition ${
                activeFilter === filter
                  ? 'bg-primary text-surface'
                  : 'bg-surface text-text-secondary hover:bg-primary/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {filter === 'all' && '📋 All'}
              {filter === 'active' && '🔥 Active'}
              {filter === 'completed' && '✓ Completed'}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card glass className="text-center py-xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="text-6xl mb-md">📦</div>
            <h3 className="text-h3 font-bold text-text-primary mb-2">No orders yet</h3>
            <p className="text-body-md text-text-secondary mb-md">
              Start brewing your perfect cup!
            </p>
            <Button>Browse Menu</Button>
          </motion.div>
        </Card>
      ) : (
        <motion.div
          className="flex flex-col gap-md"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <AnimatePresence mode="popLayout">
            {filteredOrders.map((order, index) => {
              const isExpanded = expandedOrder === order.id;
              const statusInfo = statusConfig[order.status];
              const isActive = order.status === 'preparing' || order.status === 'ready';

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
                    glass 
                    glowOnHover
                    className={`cursor-pointer ${isActive ? 'ring-2 ring-primary/30' : ''}`}
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex flex-col gap-md">
                      {/* Order Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-sm mb-2">
                            <span className="text-h3 font-bold text-text-primary">
                              {order.orderNumber}
                            </span>
                            {isActive && (
                              <motion.div
                                animate={{
                                  scale: [1, 1.1, 1],
                                }}
                                transition={{
                                  duration: 2,
                                  repeat: Infinity,
                                }}
                              >
                                <Badge variant={statusInfo.variant}>
                                  {statusInfo.icon} {statusInfo.label}
                                </Badge>
                              </motion.div>
                            )}
                            {!isActive && (
                              <Badge variant={statusInfo.variant}>
                                {statusInfo.icon} {statusInfo.label}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-md text-body-sm text-text-secondary">
                            <span>📅 {order.date}</span>
                            <span>•</span>
                            <span>📍 {order.cafe}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-h3 font-bold text-primary">{order.total}</p>
                          {order.estimatedTime && (
                            <motion.p
                              className="text-body-sm text-text-secondary"
                              animate={{
                                opacity: [1, 0.6, 1],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                              }}
                            >
                              ⏱️ {order.estimatedTime}
                            </motion.p>
                          )}
                        </div>
                      </div>

                      {/* Order Items Preview */}
                      <div className="flex flex-wrap gap-2">
                        {order.items.slice(0, isExpanded ? undefined : 2).map((item, idx) => (
                          <motion.div
                            key={idx}
                            className="flex items-center gap-2 px-sm py-1 rounded-pill bg-background text-body-sm"
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <span>☕</span>
                            <span className="text-text-primary">
                              {item.quantity}x {item.name}
                            </span>
                          </motion.div>
                        ))}
                        {!isExpanded && order.items.length > 2 && (
                          <div className="px-sm py-1 rounded-pill bg-primary/10 text-body-sm text-primary font-semibold">
                            +{order.items.length - 2} more
                          </div>
                        )}
                      </div>

                      {/* Expanded Details */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="pt-md border-t border-background space-y-sm">
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between py-sm"
                                >
                                  <div className="flex items-center gap-sm">
                                    <span className="text-body-md text-text-secondary">
                                      {item.quantity}x
                                    </span>
                                    <span className="text-body-md text-text-primary">
                                      {item.name}
                                    </span>
                                  </div>
                                  <span className="text-body-md font-semibold text-text-primary">
                                    {item.price}
                                  </span>
                                </div>
                              ))}
                              <div className="flex items-center justify-between pt-sm border-t border-background">
                                <span className="text-body-lg font-bold text-text-primary">
                                  Total
                                </span>
                                <span className="text-h3 font-bold text-primary">
                                  {order.total}
                                </span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-sm mt-md">
                              {isActive && (
                                <Button variant="primary" className="flex-1">
                                  Track Order
                                </Button>
                              )}
                              <Button variant="outline" className="flex-1">
                                Reorder
                              </Button>
                              <Button variant="outline">
                                📄 Receipt
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Expand Indicator */}
                      <motion.div
                        className="flex items-center justify-center pt-sm text-body-sm text-text-secondary"
                        animate={{
                          rotate: isExpanded ? 180 : 0,
                        }}
                      >
                        ▼
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Order Stats */}
      <Card glass glowOnHover>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-md">
          {[
            { label: 'Total Spent', value: '$94', icon: '💰', color: 'text-green-600' },
            { label: 'Orders This Month', value: '4', icon: '📊', color: 'text-blue-600' },
            { label: 'Favorite Drink', value: 'Latte', icon: '☕', color: 'text-orange-600' },
            { label: 'Rewards Points', value: '2,300', icon: '⭐', color: 'text-yellow-600' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center text-center p-md rounded-xl bg-surface"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className={`text-h2 font-bold ${stat.color} mb-1`}>{stat.value}</div>
              <div className="text-body-sm text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
