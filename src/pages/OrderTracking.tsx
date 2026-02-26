import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { CircularProgress } from '../components/CircularProgress';
import { OrderTimeline } from '../components/OrderTimeline';
import { pageVariants, fadeInUp } from '../components/animations';

export function OrderTracking() {
  const [currentStatus, setCurrentStatus] = useState('confirmed');
  const [estimatedTime, setEstimatedTime] = useState(15); // minutes
  const [progress, setProgress] = useState(25);

  // Mock order data
  const order = {
    id: '12345',
    cafeName: 'Artisan Coffee House',
    items: [
      { name: 'Caramel Latte', quantity: 1, price: '$5.50' },
      { name: 'Chocolate Croissant', quantity: 2, price: '$8.00' },
    ],
    total: '$13.50',
    orderType: 'pickup',
  };

  const timelineSteps = [
    {
      status: 'pending' as const,
      label: 'Order Placed',
      icon: '📱',
      timestamp: '10:15 AM',
      message: 'We received your order',
    },
    {
      status: 'confirmed' as const,
      label: 'Order Confirmed',
      icon: '✅',
      timestamp: '10:16 AM',
      message: 'Cafe confirmed your order',
    },
    {
      status: 'preparing' as const,
      label: 'Preparing',
      icon: '👨‍🍳',
      message: 'Your order is being prepared',
    },
    {
      status: 'ready' as const,
      label: 'Ready for Pickup',
      icon: '🎉',
      message: 'Your order is ready!',
    },
    {
      status: 'completed' as const,
      label: 'Completed',
      icon: '✨',
      message: 'Enjoy your coffee!',
    },
  ];

  // Simulate order progression
  useEffect(() => {
    const statuses = ['confirmed', 'preparing', 'ready', 'completed'];
    const progressValues = [25, 50, 75, 100];
    let currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < statuses.length - 1) {
        currentIndex++;
        setCurrentStatus(statuses[currentIndex]);
        setProgress(progressValues[currentIndex]);
        setEstimatedTime(prev => Math.max(0, prev - 5));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="min-h-screen bg-background px-md py-xl"
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <div className="mx-auto max-w-4xl">
        <motion.div variants={fadeInUp} className="mb-lg">
          <h1 className="text-h1 font-bold text-text-primary">Order Tracking</h1>
          <p className="text-body-md text-text-secondary mt-2">Track your order in real-time</p>
        </motion.div>

        <div className="grid gap-lg lg:grid-cols-[2fr,3fr]">
          {/* Order Summary Card */}
          <motion.div variants={fadeInUp}>
            <Card glass glowOnHover>
              <div className="flex flex-col gap-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-body-sm text-text-secondary">Order #{order.id}</p>
                    <h2 className="text-h3 font-bold text-text-primary mt-1">{order.cafeName}</h2>
                  </div>
                  <span className="rounded-pill px-sm py-1 text-body-xs font-semibold bg-primary/10 text-primary">
                    {order.orderType}
                  </span>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-body-md">
                      <span className="text-text-secondary">
                        {item.quantity}x {item.name}
                      </span>
                      <span className="font-semibold text-text-primary">{item.price}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-background pt-2">
                  <div className="flex justify-between">
                    <span className="text-body-lg font-bold text-text-primary">Total</span>
                    <span className="text-body-lg font-bold text-primary">{order.total}</span>
                  </div>
                </div>

                {/* Circular Progress */}
                <div className="flex flex-col items-center gap-md py-md border-t border-background">
                  <CircularProgress progress={progress} size={100} />
                  {estimatedTime > 0 && (
                    <div className="text-center">
                      <p className="text-body-sm text-text-secondary">Estimated time</p>
                      <p className="text-h3 font-bold text-primary">{estimatedTime} min</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Timeline Card */}
          <motion.div variants={fadeInUp}>
            <Card glass glowOnHover>
              <div className="flex flex-col gap-md">
                <h3 className="text-h3 font-bold text-text-primary">Order Status</h3>
                <OrderTimeline currentStatus={currentStatus} steps={timelineSteps} />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div 
          variants={fadeInUp}
          className="mt-lg flex gap-md justify-center"
        >
          <Button variant="secondary">Contact Cafe</Button>
          <Button variant="outline">Cancel Order</Button>
        </motion.div>

        {/* Barista Message */}
        {currentStatus === 'preparing' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-lg"
          >
            <Card glass className="bg-gradient-to-br from-primary/5 to-secondary/5">
              <div className="flex items-start gap-md">
                <motion.div
                  className="text-4xl"
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  👨‍🍳
                </motion.div>
                <div className="flex-1">
                  <p className="text-body-md text-text-primary">
                    <span className="font-semibold">Barista Note:</span>{' '}
                    "Making your perfect latte with love! We're using our premium beans today ☕"
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
