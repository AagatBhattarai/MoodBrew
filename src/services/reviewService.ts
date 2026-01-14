/**
 * Review Service
 * Handles review summarization and review data management
 */

import { summarizeReviews, type ReviewSummary } from '../lib/ai';
import { supabase } from '../lib/supabase';

interface ReviewSummaryCache {
  reviewIds: string[];
  summary: ReviewSummary;
  timestamp: number;
}

const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes
const cache = new Map<string, ReviewSummaryCache>();

/**
 * Get reviews for a café
 */
export async function getCafeReviews(cafeId: string) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('cafe_id', cafeId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

/**
 * Get AI summary of reviews for a café
 */
export async function getReviewSummary(cafeId: string): Promise<ReviewSummary> {
  // Get reviews
  const reviews = await getCafeReviews(cafeId);

  if (reviews.length === 0) {
    return {
      overallSentiment: 'neutral',
      sentimentScore: 0.5,
      keyPoints: [],
      pros: [],
      cons: [],
      summary: 'No reviews available yet.',
      recommendation: 'Be the first to review!',
    };
  }

  const cacheKey = `${cafeId}-${reviews.map((r) => r.id).join(',')}`;
  const cached = cache.get(cacheKey);

  // Return cached if still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.summary;
  }

  // Format reviews for AI
  const formattedReviews = reviews.map((r) => ({
    id: r.id,
    rating: r.rating,
    comment: r.comment || '',
    author: r.user_name || 'Anonymous',
    date: r.created_at ? new Date(r.created_at).toLocaleDateString() : undefined,
  }));

  // Get AI summary
  const summary = await summarizeReviews(formattedReviews);

  // Cache the result
  cache.set(cacheKey, {
    reviewIds: reviews.map((r) => r.id),
    summary,
    timestamp: Date.now(),
  });

  // Store summary in database
  try {
    await supabase.from('review_summaries').upsert({
      cafe_id: cafeId,
      summary_data: summary,
      review_count: reviews.length,
      updated_at: new Date().toISOString(),
    });
  } catch (error) {
    console.warn('Failed to store review summary:', error);
  }

  return summary;
}

/**
 * Add a new review
 */
export async function addReview(
  cafeId: string,
  rating: number,
  comment: string,
  userId: string
) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        cafe_id: cafeId,
        user_id: userId,
        rating,
        comment,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Clear cache for this café
    const keysToDelete: string[] = [];
    cache.forEach((value, key) => {
      if (key.startsWith(cafeId)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => cache.delete(key));

    return data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
}

/**
 * Clear review summary cache
 */
export function clearReviewCache(cafeId?: string) {
  if (cafeId) {
    const keysToDelete: string[] = [];
    cache.forEach((value, key) => {
      if (key.startsWith(cafeId)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => cache.delete(key));
  } else {
    cache.clear();
  }
}

