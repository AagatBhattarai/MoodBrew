# AI Features Setup Guide for MoodBrew

This guide will help you set up and configure the AI-powered features in MoodBrew.

## Overview

MoodBrew now includes three comprehensive AI features:

1. **Mood-to-Food Recommendation Engine** - AI-powered product recommendations based on user mood
2. **AI-Powered Café Ranking** - Intelligent café rankings using multiple factors
3. **AI Review Summarizer** - Automated review analysis and summarization

## Prerequisites

- Supabase project set up (see `SUPABASE_SETUP.md`)
- OpenAI API key (or compatible API)

## Step 1: Set Up OpenAI API

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Navigate to **API Keys** section
4. Create a new API key
5. Copy the API key

## Step 2: Configure Environment Variables

1. In the `moodbrew` directory, create or update your `.env` file:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

2. Restart your development server after adding the API key:

```bash
npm run dev
```

## Step 3: Set Up Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste the contents of `supabase-ai-schema.sql`
4. Click "Run" to execute the SQL

This will create:
- `reviews` table - Stores user reviews for cafés
- `review_summaries` table - Caches AI-generated review summaries
- `recommendation_logs` table - Analytics for mood recommendations
- `cafe_rankings` table - Stores AI-generated café rankings
- Row Level Security (RLS) policies for all tables

## Step 4: Test the Features

### Mood-to-Food Recommendations

1. Navigate to the Home screen
2. Select a mood (Energized, Relaxed, Creative, Social, or Cozy)
3. The AI recommendation card will appear below the mood selector
4. Recommendations update automatically when you change moods

### AI-Powered Café Ranking

1. Navigate to the Weekly Ranking screen
2. Select different filters (Termurah, Terfavorit, etc.)
3. The AI ranking card will appear above the traditional ranking
4. Each café shows:
   - AI Score (0-100)
   - Reasoning for the rank
   - Strengths and areas for improvement

### AI Review Summarizer

1. Navigate to a Café Detail screen
2. Scroll down to see the AI Review Summary card
3. The summary includes:
   - Overall sentiment (positive/neutral/negative)
   - Key points from reviews
   - Pros and cons
   - Recommendation

## Features Details

### Mood-to-Food Recommendation Engine

- **Location**: Home screen, below mood selector
- **How it works**: 
  - Analyzes selected mood
  - Considers available products
  - Provides 3-4 personalized recommendations
  - Shows mood match percentage
  - Explains why each product matches the mood
- **Caching**: Recommendations are cached for 5 minutes
- **Fallback**: Works without API key using rule-based recommendations

### AI-Powered Café Ranking

- **Location**: Weekly Ranking screen
- **How it works**:
  - Analyzes multiple factors (ratings, reviews, price, location, distance)
  - Considers active filter preference
  - Provides intelligent ranking with detailed reasoning
  - Shows AI score (0-100) for each café
  - Lists strengths and improvement areas
- **Caching**: Rankings are cached for 10 minutes
- **Fallback**: Works without API key using rating-based ranking

### AI Review Summarizer

- **Location**: Café Detail screen
- **How it works**:
  - Analyzes all reviews for a café
  - Extracts sentiment (positive/neutral/negative)
  - Identifies key points, pros, and cons
  - Generates concise summary
  - Provides recommendation
- **Caching**: Summaries are cached for 15 minutes
- **Fallback**: Works without API key using basic statistics

## API Costs

The implementation uses `gpt-4o-mini` which is cost-effective:
- ~$0.15 per 1M input tokens
- ~$0.60 per 1M output tokens

Typical costs per feature:
- Mood recommendations: ~$0.001-0.002 per request
- Café ranking: ~$0.002-0.003 per request
- Review summary: ~$0.001-0.002 per request

## Troubleshooting

### "OpenAI API key not found" warning

- Make sure `VITE_OPENAI_API_KEY` is set in your `.env` file
- Restart the development server
- Check that the variable name is exactly `VITE_OPENAI_API_KEY`

### AI features not working

1. Check browser console for errors
2. Verify OpenAI API key is valid
3. Check API usage limits in OpenAI dashboard
4. Ensure database schema is set up correctly

### Slow AI responses

- Responses typically take 2-5 seconds
- Check your internet connection
- Verify OpenAI API status
- Consider using a faster model (though more expensive)

### Fallback mode

If the API key is not configured, the app will use fallback logic:
- Mood recommendations: Rule-based matching
- Café ranking: Rating-based sorting
- Review summary: Basic statistics

## Customization

### Adjusting AI Prompts

Edit `src/lib/ai.ts` to customize:
- System prompts for each feature
- Temperature settings (creativity level)
- Max tokens (response length)

### Changing Cache Duration

Edit the cache duration in:
- `src/services/recommendationService.ts` (5 minutes)
- `src/services/rankingService.ts` (10 minutes)
- `src/services/reviewService.ts` (15 minutes)

### Using Different AI Models

In `src/lib/ai.ts`, change the `model` parameter in `callOpenAI`:
- `gpt-4o-mini` (current, cost-effective)
- `gpt-4o` (more capable, more expensive)
- `gpt-3.5-turbo` (older, cheaper)

## Security Notes

- Never commit API keys to version control
- Use environment variables for all secrets
- API keys are only used client-side (consider moving to backend in production)
- Row Level Security (RLS) is enabled on all database tables

## Next Steps

1. Add more review data to test summarization
2. Customize AI prompts for your specific use case
3. Add analytics to track AI feature usage
4. Consider moving AI calls to a backend API for better security
5. Add user feedback mechanisms for AI recommendations

## Support

For issues or questions:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure database schema is properly set up
4. Check OpenAI API status and usage limits

