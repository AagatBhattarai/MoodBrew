import { motion } from 'framer-motion';
import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { fadeInUp } from './animations';

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed';
  items: string[];
  total: string;
  estimatedTime?: string;
}

interface MyOrdersPreviewProps {
  onViewAll: () => void;
}

const mockRecentOrders: RecentOrder[] = [
  {
    id: '1',
    orderNumber: '#MB2024-001',
    status: 'preparing',
    items: ['Caramel Latte', 'Chocolate Croissant'],
    total: '$27',
    estimatedTime: '15 min',
  },
  {
    id: '2',
    orderNumber: '#MB2024-002',
    status: 'completed',
    items: ['Espresso Shot', 'Blueberry Muffin'],
    total: '$24',
  },
];

const statusConfig = {
  pending: { label: 'Pending', icon: '⏳', color: 'bg-yellow-100 text-yellow-700' },
  preparing: { label: 'Preparing', icon: '👨‍🍳', color: 'bg-blue-100 text-blue-700' },
  ready: { label: 'Ready', icon: '✅', color: 'bg-green-100 text-green-700' },
  completed: { label: 'Completed', icon: '✓', color: 'bg-gray-100 text-gray-700' },
};

export function MyOrdersPreview({ onViewAll }: MyOrdersPreviewProps) {
  const activeOrder = mockRecentOrders.find(
    (order) => order.status === 'preparing' || order.status === 'ready' || order.status === 'pending'
  );

  return (
    <Card glass glowOnHover className="relative z-10">
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="flex flex-col gap-md"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-sm">
            <span className="text-3xl">🛍️</span>
            <h3 className="text-h3 font-bold text-text-primary">My Orders</h3>
          </div>
          <Button variant="outline" onClick={onViewAll} className="text-body-sm">
            View All →
          </Button>
        </div>

        {/* Active Order Highlight */}
        {activeOrder ? (
          <motion.div
            className="rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 p-md border-2 border-primary/30"
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(74, 44, 42, 0)',
                '0 0 0 8px rgba(74, 44, 42, 0.1)',
                '0 0 0 0 rgba(74, 44, 42, 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <div className="flex items-start justify-between mb-sm">
              <div>
                <div className="flex items-center gap-sm mb-1">
                  <span className="text-body-lg font-bold text-text-primary">
                    {activeOrder.orderNumber}
                  </span>
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Badge variant="discount">
                      {statusConfig[activeOrder.status].icon} {statusConfig[activeOrder.status].label}
                    </Badge>
                  </motion.div>
                </div>
                <p className="text-body-sm text-text-secondary">
                  {activeOrder.items.slice(0, 2).join(', ')}
                  {activeOrder.items.length > 2 && ` +${activeOrder.items.length - 2} more`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-h3 font-bold text-primary">{activeOrder.total}</p>
                {activeOrder.estimatedTime && (
                  <motion.p
                    className="text-body-sm text-text-secondary"
                    animate={{ opacity: [1, 0.6, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    ⏱️ {activeOrder.estimatedTime}
                  </motion.p>
                )}
              </div>
            </div>
            <Button variant="primary" className="w-full" onClick={onViewAll}>
              Track Order
            </Button>
          </motion.div>
        ) : (
          /* Recent Orders Summary */
          <div className="flex flex-col gap-sm">
            <div className="flex items-center justify-between p-sm rounded-lg bg-surface hover:bg-primary/5 transition cursor-pointer" onClick={onViewAll}>
              <div className="flex items-center gap-sm">
                <span className="text-2xl">☕</span>
                <div>
                  <p className="text-body-md font-semibold text-text-primary">
                    {mockRecentOrders[0].orderNumber}
                  </p>
                  <p className="text-body-sm text-text-secondary">
                    {mockRecentOrders[0].items[0]}
                    {mockRecentOrders[0].items.length > 1 && ` +${mockRecentOrders[0].items.length - 1}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-sm">
                <span className="text-body-md font-bold text-primary">
                  {mockRecentOrders[0].total}
                </span>
                <span className={`px-2 py-1 rounded-pill text-body-xs ${statusConfig[mockRecentOrders[0].status].color}`}>
                  {statusConfig[mockRecentOrders[0].status].icon}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-sm pt-sm border-t border-background">
          <div className="text-center">
            <p className="text-h3 font-bold text-primary">{mockRecentOrders.length}</p>
            <p className="text-body-xs text-text-secondary">This Week</p>
          </div>
          <div className="text-center">
            <p className="text-h3 font-bold text-secondary">$94</p>
            <p className="text-body-xs text-text-secondary">Total Spent</p>
          </div>
          <div className="text-center">
            <p className="text-h3 font-bold text-accent">2,300</p>
            <p className="text-body-xs text-text-secondary">Points</p>
          </div>
        </div>
      </motion.div>
    </Card>
  );
}
