import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from './animations';

interface TimelineStep {
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed';
  label: string;
  icon: string;
  timestamp?: string;
  message?: string;
}

interface OrderTimelineProps {
  currentStatus: string;
  steps: TimelineStep[];
}

export function OrderTimeline({ currentStatus, steps }: OrderTimelineProps) {
  const statusOrder = ['pending', 'confirmed', 'preparing', 'ready', 'completed'];
  const currentIndex = statusOrder.indexOf(currentStatus);

  return (
    <motion.div
      className="flex flex-col gap-0"
      variants={staggerContainer}
      initial="initial"
      animate="animate"
    >
      {steps.map((step, index) => {
        const stepIndex = statusOrder.indexOf(step.status);
        const isCompleted = stepIndex <= currentIndex;
        const isCurrent = stepIndex === currentIndex;

        return (
          <motion.div
            key={step.status}
            variants={staggerItem}
            className="relative flex gap-md"
          >
            {/* Timeline line */}
            {index < steps.length - 1 && (
              <div className="absolute left-[22px] top-[44px] bottom-0 w-0.5 bg-background">
                {isCompleted && (
                  <motion.div
                    className="absolute inset-0 bg-primary"
                    initial={{ height: 0 }}
                    animate={{ height: '100%' }}
                    transition={{ delay: index * 0.2, duration: 0.5 }}
                  />
                )}
              </div>
            )}

            {/* Step indicator */}
            <motion.div
              className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border-2 transition ${
                isCompleted
                  ? 'border-primary bg-primary text-surface'
                  : 'border-background bg-surface text-text-secondary'
              }`}
              animate={isCurrent ? {
                scale: [1, 1.1, 1],
              } : {}}
              transition={{
                duration: 1,
                repeat: isCurrent ? Infinity : 0,
                ease: 'easeInOut',
              }}
            >
              <span className="text-xl">{step.icon}</span>
              {isCurrent && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-primary"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [1, 0, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeOut',
                  }}
                />
              )}
            </motion.div>

            {/* Step content */}
            <div className="flex-1 pb-lg">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className={`text-body-lg font-semibold ${isCompleted ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {step.label}
                  </h4>
                  {step.message && (
                    <p className="text-body-sm text-text-secondary mt-1">{step.message}</p>
                  )}
                </div>
                {step.timestamp && isCompleted && (
                  <span className="text-body-xs text-text-secondary">{step.timestamp}</span>
                )}
              </div>
              
              {isCurrent && (
                <motion.div
                  className="mt-2 flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.div
                    className="h-2 w-2 rounded-full bg-primary"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.5, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                  <span className="text-body-sm font-semibold text-primary">In Progress</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
