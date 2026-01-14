import { Card } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem } from './animations';

interface CafeRank {
  cafeId: string;
  cafeName: string;
  rank: number;
  aiScore: number;
  reasoning: string;
  strengths: string[];
  improvements: string[];
}

interface AICafeRankingProps {
  cafes: CafeRank[];
  summary: string;
  isLoading?: boolean;
  onCafeClick?: (cafeId: string) => void;
}

export function AICafeRanking({
  cafes,
  summary,
  isLoading = false,
  onCafeClick,
}: AICafeRankingProps) {
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
            <h3 className="text-h3 text-text-primary">AI is ranking cafés...</h3>
          </div>
          <p className="text-body-md text-text-secondary">
            Analyzing ratings, reviews, and quality metrics
          </p>
          {/* Shimmer skeleton */}
          <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl border border-primary/10 bg-surface p-lg">
                <div className="h-6 bg-background rounded shimmer mb-3"></div>
                <div className="h-4 bg-background rounded shimmer mb-2"></div>
                <div className="h-20 bg-background rounded shimmer"></div>
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
      <Card glass glowOnHover className="border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5">
        <div className="flex flex-col gap-lg">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-xs">
              <div className="flex items-center gap-sm">
                <motion.div 
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className="text-2xl">🏆</span>
                </motion.div>
                <div>
                  <h3 className="text-h3 text-text-primary">AI-Powered Rankings</h3>
                  <motion.p 
                    className="text-body-sm text-text-secondary mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {summary}
                  </motion.p>
                </div>
              </div>
            </div>
            <Badge variant="calorie" className="h-fit" pulse>AI Enhanced</Badge>
          </div>

          <motion.div 
            className="grid gap-lg sm:grid-cols-2 lg:grid-cols-3"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {cafes.map((cafe, index) => (
              <motion.div
                key={cafe.cafeId}
                className="group relative flex flex-col gap-md rounded-2xl border border-primary/10 bg-surface p-lg shadow-sm"
                variants={staggerItem}
                whileHover={{ 
                  scale: 1.02,
                  borderColor: 'rgba(74, 44, 42, 0.3)',
                  boxShadow: '0 10px 30px -10px rgba(74, 44, 42, 0.3)',
                }}
              >
              {/* Rank Badge */}
              <motion.div 
                className="absolute -top-3 -left-3 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-body-md font-bold text-surface shadow-lg"
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
              >
                #{cafe.rank}
              </motion.div>

              {/* Header */}
              <div className="flex flex-col gap-sm pt-2">
                <div className="flex items-start justify-between">
                  <h4 className="text-body-lg font-bold text-text-primary pr-2">
                    {cafe.cafeName}
                  </h4>
                  {onCafeClick && (
                    <Button
                      variant="secondary"
                      onClick={() => onCafeClick(cafe.cafeId)}
                      className="px-sm py-1 text-body-xs shrink-0"
                    >
                      View
                    </Button>
                  )}
                </div>

                {/* AI Score */}
                <div className="flex flex-col gap-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-body-xs font-semibold text-primary">AI Score</span>
                    <span className="text-body-sm font-bold text-primary">
                      {Math.round(cafe.aiScore)}/100
                    </span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-background overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      initial={{ width: 0 }}
                      animate={{ width: `${cafe.aiScore}%` }}
                      transition={{ delay: index * 0.1 + 0.3, duration: 0.8, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              </div>

              {/* Reasoning */}
              <div className="rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 p-sm border border-primary/10">
                <p className="text-body-xs text-text-secondary leading-relaxed">
                  <span className="font-semibold text-text-primary">💡</span> {cafe.reasoning}
                </p>
              </div>

              {/* Strengths & Improvements */}
              <div className="flex flex-col gap-sm">
                {cafe.strengths && cafe.strengths.length > 0 && (
                  <div className="flex flex-col gap-xs">
                    <p className="text-body-xs font-bold uppercase tracking-wider text-primary">
                      ✨ Strengths
                    </p>
                    <ul className="flex flex-col gap-1">
                      {cafe.strengths.slice(0, 2).map((strength, i) => (
                        <li key={i} className="flex items-start gap-2 text-body-xs text-text-secondary">
                          <span className="text-primary mt-0.5">•</span>
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {cafe.improvements && cafe.improvements.length > 0 && (
                  <div className="flex flex-col gap-xs">
                    <p className="text-body-xs font-bold uppercase tracking-wider text-secondary">
                      📈 Potential
                    </p>
                    <ul className="flex flex-col gap-1">
                      {cafe.improvements.slice(0, 1).map((improvement, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-body-xs text-text-secondary"
                        >
                          <span className="text-secondary mt-0.5">•</span>
                          <span>{improvement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
}

