import { Card } from './Card';
import { Badge } from './Badge';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from './animations';

interface ReviewSummaryData {
  overallSentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number;
  keyPoints: string[];
  pros: string[];
  cons: string[];
  summary: string;
  recommendation: string;
}

interface ReviewSummaryProps {
  summary: ReviewSummaryData;
  isLoading?: boolean;
  reviewCount?: number;
}

export function ReviewSummary({ summary, isLoading = false, reviewCount }: ReviewSummaryProps) {
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
            <h3 className="text-h3 text-text-primary">AI is analyzing reviews...</h3>
          </div>
          <p className="text-body-md text-text-secondary">
            Summarizing customer feedback and insights
          </p>
          {/* Shimmer skeleton */}
          <div className="space-y-3">
            <div className="h-20 bg-background rounded shimmer"></div>
            <div className="grid gap-md sm:grid-cols-2">
              <div className="h-32 bg-background rounded shimmer"></div>
              <div className="h-32 bg-background rounded shimmer"></div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  const sentimentColors = {
    positive: 'text-green-600 bg-green-50 border-green-200',
    neutral: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    negative: 'text-red-600 bg-red-50 border-red-200',
  };

  const sentimentEmoji = {
    positive: '😊',
    neutral: '😐',
    negative: '😞',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card glass glowOnHover className="border-primary/20">
        <div className="flex flex-col gap-md">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-xs">
              <div className="flex items-center gap-sm">
                <motion.span 
                  className="text-2xl"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  📊
                </motion.span>
                <h3 className="text-h3 text-text-primary">AI Review Summary</h3>
              </div>
              {reviewCount && (
                <p className="text-body-sm text-text-secondary">
                  Based on {reviewCount} {reviewCount === 1 ? 'review' : 'reviews'}
                </p>
              )}
            </div>
            <Badge variant="calorie" pulse>AI Generated</Badge>
          </div>

        <motion.div 
          className="flex items-center gap-md"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div
            className={`flex items-center gap-sm rounded-lg border px-md py-2 ${sentimentColors[summary.overallSentiment]}`}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
          >
            <span className="text-2xl">{sentimentEmoji[summary.overallSentiment]}</span>
            <div className="flex flex-col">
              <span className="text-body-xs font-semibold uppercase">
                {summary.overallSentiment}
              </span>
              <span className="text-body-sm">
                {Math.round(summary.sentimentScore * 100)}% positive
              </span>
            </div>
          </motion.div>
          <div className="flex-1">
            <div className="h-2 w-full rounded-full bg-background overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${summary.sentimentScore * 100}%` }}
                transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="rounded-lg bg-primary/5 p-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.p 
            className="text-body-md text-text-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            {summary.summary}
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid gap-md sm:grid-cols-2"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.div className="flex flex-col gap-sm" variants={staggerItem}>
            <h4 className="text-body-lg font-semibold text-text-primary">Key Points</h4>
            <div className="flex flex-col gap-xs" role="list">
              {summary.keyPoints.map((point, i) => (
                <motion.div 
                  key={i} 
                  role="listitem"
                  className="flex items-start gap-sm text-body-sm text-text-secondary"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 + i * 0.1 }}
                >
                  <span className="mt-1 text-primary">•</span>
                  <span>{point}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div className="flex flex-col gap-sm" variants={staggerItem}>
            <h4 className="text-body-lg font-semibold text-text-primary">Recommendation</h4>
            <p className="text-body-md text-text-primary">{summary.recommendation}</p>
          </motion.div>
        </motion.div>

        <div className="grid gap-md sm:grid-cols-2">
          <div className="rounded-lg border border-green-200 bg-green-50 p-md">
            <h4 className="mb-sm text-body-md font-semibold text-green-800">Pros</h4>
            <ul className="flex flex-col gap-xs">
              {summary.pros.map((pro, i) => (
                <li key={i} className="flex items-center gap-sm text-body-sm text-green-700">
                  <span className="text-green-600">✓</span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-orange-200 bg-orange-50 p-md">
            <h4 className="mb-sm text-body-md font-semibold text-orange-800">Cons</h4>
            <ul className="flex flex-col gap-xs">
              {summary.cons.map((con, i) => (
                <li key={i} className="flex items-center gap-sm text-body-sm text-orange-700">
                  <span className="text-orange-600">→</span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Card>
    </motion.div>
  );
}

