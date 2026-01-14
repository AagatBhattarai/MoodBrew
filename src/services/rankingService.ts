/**
 * Ranking Service
 * Handles AI-powered café ranking with caching and database integration
 */

import { getAIRankedCafes, type CafeRanking } from '../lib/ai';
import { supabase } from '../lib/supabase';

interface RankingCache {
  filter?: string;
  ranking: CafeRanking;
  timestamp: number;
}

const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
const cache = new Map<string, RankingCache>();

/**
 * Get AI-ranked cafés
 */
export async function getRankedCafes(
  cafes: Array<{
    id: string;
    name: string;
    rating: number;
    reviewCount?: number;
    priceRange?: string;
    location?: string;
    distance?: string;
    popularItem?: string;
  }>,
  filter?: string
): Promise<CafeRanking> {
  const cacheKey = `${filter || 'all'}-${cafes.map((c) => c.id).join(',')}`;
  const cached = cache.get(cacheKey);

  // Return cached if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.ranking;
  }

  // Get fresh ranking
  const ranking = await getAIRankedCafes(cafes, filter);

  // Cache the result
  cache.set(cacheKey, {
    filter,
    ranking,
    timestamp: Date.now(),
  });

  // Store ranking in database
  try {
    await supabase.from('cafe_rankings').insert({
      filter_type: filter || 'all',
      cafe_count: cafes.length,
      ranking_data: ranking,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Failed to store ranking:', error);
  }

  return ranking;
}

/**
 * Clear ranking cache
 */
export function clearRankingCache() {
  cache.clear();
}

