/**
 * Recommendation Service
 * Handles mood-based product recommendations with caching
 */

import { getMoodRecommendations, type MoodRecommendation } from '../lib/ai';
import { supabase } from '../lib/supabase';

interface RecommendationCache {
  mood: string;
  recommendations: MoodRecommendation;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const cache = new Map<string, RecommendationCache>();

/**
 * Get recommendations for a mood with caching
 */
export async function getRecommendationsForMood(
  mood: string,
  availableProducts: Array<{ id: string; name: string; price: string }>
): Promise<MoodRecommendation> {
  const cacheKey = `${mood}-${availableProducts.map((p) => p.id).join(',')}`;
  const cached = cache.get(cacheKey);

  // Return cached if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.recommendations;
  }

  // Get fresh recommendations
  const recommendations = await getMoodRecommendations(mood, availableProducts);

  // Cache the result
  cache.set(cacheKey, {
    mood,
    recommendations,
    timestamp: Date.now(),
  });

  // Store in database for analytics
  try {
    await supabase.from('recommendation_logs').insert({
      mood,
      product_count: availableProducts.length,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    // Silently fail - analytics are not critical
    console.warn('Failed to log recommendation:', error);
  }

  return recommendations;
}

/**
 * Clear recommendation cache
 */
export function clearRecommendationCache() {
  cache.clear();
}

