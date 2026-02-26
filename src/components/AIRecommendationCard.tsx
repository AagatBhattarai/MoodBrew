import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from './animations';

interface Recommendation {
  name: string;
  description: string;
  reason: string;
  moodMatch: number;
}

interface AIRecommendationCardProps {
  recommendations: Recommendation[];
  explanation: string;
  mood: string;
  isLoading?: boolean;
}

export function AIRecommendationCard({
  recommendations,
  explanation,
  mood,
  isLoading = false,
}: AIRecommendationCardProps) {
  if (isLoading) {
    return (
      <Card glass>
        <div className="flex flex-col gap-md">
          <div className="flex items-center gap-sm">
            <motion.div 
              className="h-6 w-6 rounded-full border-2 border-primary border-t-transparent"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            <h3 className="text-h3 text-text-primary">AI is analyzing your mood...</h3>
          </div>
          <p className="text-body-md text-text-secondary">
            Finding the perfect recommendations for your {mood} mood
          </p>
          {/* Shimmer skeleton */}
          <div className="flex gap-md overflow-x-auto pb-sm">
            {[1, 2, 3].map((i) => (
              <div key={i} className="min-w-[320px] flex-shrink-0">
                <div className="rounded-lg border border-primary/10 bg-surface p-md">
                  <div className="h-6 bg-background rounded shimmer mb-2"></div>
                  <div className="h-4 bg-background rounded shimmer mb-2 w-3/4"></div>
                  <div className="h-16 bg-background rounded shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card glass glowOnHover className="border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="flex flex-col gap-md">
          <div className="flex items-start justify-between">
            <div className="flex flex-1 flex-col gap-xs">
              <div className="flex items-center gap-sm">
                <motion.span 
                  className="text-2xl"
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  ✨
                </motion.span>
                <h3 className="text-h3 text-text-primary">AI Recommendations</h3>
                <Badge variant="calorie" pulse>AI Powered</Badge>
              </div>
              <p className="text-body-sm text-text-secondary">
                Personalized for your <span className="font-semibold text-primary">{mood}</span> mood
              </p>
              <motion.p 
                className="text-body-md text-text-secondary italic mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                {explanation}
              </motion.p>
            </div>
          </div>

          {/* Horizontal Slider */}
          <div className="relative">
            <div className="flex gap-md overflow-x-auto pb-sm scroll-smooth custom-scrollbar">
              {recommendations.map((rec, index) => (
                <motion.div
                  key={index}
                  className="flex min-w-[320px] flex-shrink-0 flex-col gap-sm rounded-lg border border-primary/20 bg-surface p-md"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.02,
                    borderColor: 'rgba(74, 44, 42, 0.4)',
                    boxShadow: '0 10px 30px -10px rgba(74, 44, 42, 0.3)',
                  }}
                >
                  <div className="flex items-start justify-between">
                    <h4 className="text-body-lg font-semibold text-text-primary">{rec.name}</h4>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-body-xs font-semibold text-primary">
                        {Math.round(rec.moodMatch * 100)}% match
                      </span>
                      <div className="h-2 w-20 rounded-full bg-background overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-primary"
                          initial={{ width: 0 }}
                          animate={{ width: `${rec.moodMatch * 100}%` }}
                          transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-body-sm text-text-secondary">{rec.description}</p>
                  <div className="rounded-md bg-primary/10 p-sm">
                    <p className="text-body-xs text-primary">
                      <span className="font-semibold">Why:</span> {rec.reason}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

