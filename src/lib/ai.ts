/**
 * AI Service for MoodBrew
 * Handles all AI-powered features including recommendations, rankings, and summarization
 */

const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

interface AIResponse {
  content: string;
  error?: string;
}

/**
 * Call OpenAI API with a prompt
 */
async function callOpenAI(
  systemPrompt: string,
  userPrompt: string,
  temperature: number = 0.7
): Promise<AIResponse> {
  if (!OPENAI_API_KEY) {
    console.warn('OpenAI API key not found. Using fallback responses.');
    return {
      content: '',
      error: 'API key not configured',
    };
  }

  try {
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using cost-effective model
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'OpenAI API error');
    }

    const data = await response.json();
    return {
      content: data.choices[0]?.message?.content || '',
    };
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return {
      content: '',
      error: error.message || 'Failed to call AI service',
    };
  }
}

/**
 * Mood-to-Food Recommendation Engine
 */
export type MoodRecommendation = {
  products: Array<{
    name: string;
    description: string;
    reason: string;
    moodMatch: number; // 0-1 score
  }>;
  explanation: string;
};

export async function getMoodRecommendations(
  mood: string,
  availableProducts: Array<{ id: string; name: string; price: string }>
): Promise<MoodRecommendation> {
  const systemPrompt = `You are a food and beverage recommendation expert for a café app. 
Analyze the user's mood and recommend the best food and drink items that match their emotional state.
Provide specific, personalized recommendations with clear reasoning.`;

  const userPrompt = `The user is feeling: ${mood}

Available products:
${availableProducts.map((p) => `- ${p.name} (${p.price})`).join('\n')}

Please recommend 4-6 products that best match this mood. For each recommendation, provide:
1. Product name
2. Brief description
3. Why it matches the mood (specific reason)
4. Mood match score (0-1)

Also provide a brief explanation of why these recommendations suit the mood.`;

  const response = await callOpenAI(systemPrompt, userPrompt, 0.8);

  if (response.error || !response.content) {
    // Fallback recommendations based on mood
    return getFallbackMoodRecommendations(mood, availableProducts);
  }

  try {
    // Try to parse JSON response
    const parsed = JSON.parse(response.content);
    return parsed;
  } catch {
    // If not JSON, parse the text response
    return parseMoodRecommendationText(response.content, availableProducts);
  }
}

/**
 * AI-Powered Café Ranking
 */
export type CafeRanking = {
  cafes: Array<{
    cafeId: string;
    cafeName: string;
    rank: number;
    aiScore: number; // 0-100
    reasoning: string;
    strengths: string[];
    improvements: string[];
  }>;
  summary: string;
};

export async function getAIRankedCafes(
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
  const systemPrompt = `You are an expert café reviewer and ranking analyst. 
Analyze cafés based on multiple factors including ratings, popularity, value, location, and user preferences.
Provide intelligent rankings with detailed reasoning.`;

  const filterContext = filter
    ? `The user wants to filter by: ${filter}. Prioritize cafés that excel in this area.`
    : 'Rank based on overall quality and user satisfaction.';

  const userPrompt = `Rank these cafés intelligently:

${cafes
  .map(
    (c, i) =>
      `${i + 1}. ${c.name}
   - Rating: ${c.rating}/5
   - Reviews: ${c.reviewCount || 'N/A'}
   - Price: ${c.priceRange || 'N/A'}
   - Location: ${c.location || 'N/A'}
   - Distance: ${c.distance || 'N/A'}
   - Popular Item: ${c.popularItem || 'N/A'}`
  )
  .join('\n\n')}

${filterContext}

For each café, provide:
1. Rank (1 = best)
2. AI Score (0-100)
3. Reasoning (why this rank)
4. Top 3 strengths
5. Top 2 areas for improvement

Also provide an overall summary of the ranking.`;

  const response = await callOpenAI(systemPrompt, userPrompt, 0.6);

  if (response.error || !response.content) {
    return getFallbackCafeRanking(cafes);
  }

  try {
    const parsed = JSON.parse(response.content);
    return parsed;
  } catch {
    return parseCafeRankingText(response.content, cafes);
  }
}

/**
 * AI Review Summarizer
 */
export type ReviewSummary = {
  overallSentiment: 'positive' | 'neutral' | 'negative';
  sentimentScore: number; // 0-1
  keyPoints: string[];
  pros: string[];
  cons: string[];
  summary: string;
  recommendation: string;
};

export async function summarizeReviews(
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    author?: string;
    date?: string;
  }>
): Promise<ReviewSummary> {
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

  const systemPrompt = `You are an expert at analyzing customer reviews. 
Summarize reviews to extract key insights, sentiment, pros, and cons.
Be concise but comprehensive.`;

  const reviewsText = reviews
    .map(
      (r, i) =>
        `Review ${i + 1} (Rating: ${r.rating}/5):
"${r.comment}"
${r.author ? `- ${r.author}` : ''}
${r.date ? `- ${r.date}` : ''}`
    )
    .join('\n\n');

  const userPrompt = `Analyze and summarize these café reviews:

${reviewsText}

Provide:
1. Overall sentiment (positive/neutral/negative)
2. Sentiment score (0-1)
3. Top 5 key points
4. Top 3 pros
5. Top 3 cons
6. Brief summary (2-3 sentences)
7. Recommendation for potential customers`;

  const response = await callOpenAI(systemPrompt, userPrompt, 0.5);

  if (response.error || !response.content) {
    return getFallbackReviewSummary(reviews);
  }

  try {
    const parsed = JSON.parse(response.content);
    return parsed;
  } catch {
    return parseReviewSummaryText(response.content, reviews);
  }
}

// Fallback functions for when AI is unavailable
function getFallbackMoodRecommendations(
  mood: string,
  products: Array<{ id: string; name: string; price: string }>
): MoodRecommendation {
  const moodMap: Record<string, string[]> = {
    energized: ['Espresso', 'Americano', 'Cold Brew', 'Matcha Latte'],
    relaxed: ['Herbal Tea', 'Chamomile Latte', 'Decaf Coffee', 'Green Tea'],
    creative: ['Cappuccino', 'Latte', 'Mocha', 'Flat White'],
    social: ['Frappuccino', 'Iced Coffee', 'Smoothie', 'Shake'],
    cozy: ['Hot Chocolate', 'Caramel Macchiato', 'Pumpkin Spice Latte', 'Chai Latte'],
  };

  const suggestions = moodMap[mood.toLowerCase()] || ['Latte', 'Cappuccino', 'Americano'];
  const recommended = products
    .filter((p) => suggestions.some((s) => p.name.toLowerCase().includes(s.toLowerCase())))
    .slice(0, 6);
  
  // If we don't have enough matches, add more products
  if (recommended.length < 4) {
    const remaining = products
      .filter((p) => !recommended.includes(p))
      .slice(0, 6 - recommended.length);
    recommended.push(...remaining);
  }

  return {
    products: recommended.map((p, i) => ({
      name: p.name,
      description: `Perfect for when you're feeling ${mood}`,
      reason: `This beverage complements your ${mood} mood`,
      moodMatch: 0.8 - i * 0.1,
    })),
    explanation: `Based on your ${mood} mood, we recommend these beverages that align with your current state.`,
  };
}

function getFallbackCafeRanking(
  cafes: Array<{
    id: string;
    name: string;
    rating: number;
    reviewCount?: number;
    priceRange?: string;
    location?: string;
    distance?: string;
    popularItem?: string;
  }>
): CafeRanking {
  const ranked = cafes
    .map((c) => ({
      ...c,
      score: c.rating * 20 + (c.reviewCount || 0) * 0.1,
    }))
    .sort((a, b) => b.score - a.score)
    .map((c, i) => ({
      cafeId: c.id,
      cafeName: c.name,
      rank: i + 1,
      aiScore: c.score,
      reasoning: `Ranked based on rating (${c.rating}) and popularity`,
      strengths: ['Good ratings', 'Popular location', 'Quality service'],
      improvements: ['Could improve menu variety', 'Consider more promotions'],
    }));

  return {
    cafes: ranked,
    summary: `Ranked ${cafes.length} cafés based on ratings and user feedback.`,
  };
}

function getFallbackReviewSummary(
  reviews: Array<{ id: string; rating: number; comment: string }>
): ReviewSummary {
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const sentiment = avgRating >= 4 ? 'positive' : avgRating >= 3 ? 'neutral' : 'negative';

  return {
    overallSentiment: sentiment,
    sentimentScore: avgRating / 5,
    keyPoints: [
      `Average rating: ${avgRating.toFixed(1)}/5`,
      `${reviews.length} total reviews`,
      'Mixed feedback from customers',
    ],
    pros: ['Good service', 'Nice atmosphere', 'Quality products'],
    cons: ['Could improve wait times', 'Price could be better'],
    summary: `Based on ${reviews.length} reviews, this café has an average rating of ${avgRating.toFixed(1)}/5.`,
    recommendation: sentiment === 'positive' ? 'Highly recommended!' : 'Worth trying.',
  };
}

// Text parsing helpers (for when AI returns text instead of JSON)
function parseMoodRecommendationText(
  text: string,
  products: Array<{ id: string; name: string; price: string }>
): MoodRecommendation {
  // Simple parsing - in production, you'd want more robust parsing
  const lines = text.split('\n').filter((l) => l.trim());
  const recommended: MoodRecommendation['products'] = [];

  for (let i = 0; i < Math.min(4, products.length); i++) {
    recommended.push({
      name: products[i].name,
      description: `Recommended for your mood`,
      reason: 'AI-matched recommendation',
      moodMatch: 0.8 - i * 0.15,
    });
  }

  return {
    products: recommended,
    explanation: text.substring(0, 200) || 'Personalized recommendations based on your mood.',
  };
}

function parseCafeRankingText(
  text: string,
  cafes: Array<{ id: string; name: string; rating: number }>
): CafeRanking {
  const ranked = cafes
    .sort((a, b) => b.rating - a.rating)
    .map((c, i) => ({
      cafeId: c.id,
      cafeName: c.name,
      rank: i + 1,
      aiScore: c.rating * 20,
      reasoning: `Ranked #${i + 1} based on ratings`,
      strengths: ['Good ratings'],
      improvements: ['Could improve'],
    }));

  return {
    cafes: ranked,
    summary: text.substring(0, 300) || 'Ranked cafés based on quality metrics.',
  };
}

function parseReviewSummaryText(
  text: string,
  reviews: Array<{ id: string; rating: number; comment: string }>
): ReviewSummary {
  const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  const sentiment = avgRating >= 4 ? 'positive' : avgRating >= 3 ? 'neutral' : 'negative';

  return {
    overallSentiment: sentiment,
    sentimentScore: avgRating / 5,
    keyPoints: text.split('\n').slice(0, 5).filter((l) => l.trim()),
    pros: ['Positive aspects mentioned'],
    cons: ['Areas for improvement'],
    summary: text.substring(0, 200) || `Average rating: ${avgRating.toFixed(1)}/5`,
    recommendation: 'Based on reviews',
  };
}

