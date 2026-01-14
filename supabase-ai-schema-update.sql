-- AI Features Database Schema for MoodBrew (Safe Update Version)
-- Run this SQL in your Supabase SQL Editor after the base setup

-- Create reviews table first
CREATE TABLE IF NOT EXISTS reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cafe_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user_name TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_cafe_id ON reviews(cafe_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);

-- Enable Row Level Security for reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view all reviews" ON reviews;
DROP POLICY IF EXISTS "Users can insert own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
DROP POLICY IF EXISTS "Users can delete own reviews" ON reviews;

-- Policy: Users can view all reviews
CREATE POLICY "Users can view all reviews"
  ON reviews FOR SELECT
  USING (true);

-- Policy: Users can insert their own reviews
CREATE POLICY "Users can insert own reviews"
  ON reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Create review_summaries table (stores AI-generated summaries)
CREATE TABLE IF NOT EXISTS review_summaries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cafe_id TEXT NOT NULL UNIQUE,
  summary_data JSONB NOT NULL,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for review_summaries
CREATE INDEX IF NOT EXISTS idx_review_summaries_cafe_id ON review_summaries(cafe_id);

-- Enable Row Level Security for review_summaries
ALTER TABLE review_summaries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view all review summaries" ON review_summaries;

-- Policy: Users can view all review summaries
CREATE POLICY "Users can view all review summaries"
  ON review_summaries FOR SELECT
  USING (true);

-- Create recommendation_logs table (for analytics)
CREATE TABLE IF NOT EXISTS recommendation_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  mood TEXT NOT NULL,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for recommendation_logs
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_user_id ON recommendation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_mood ON recommendation_logs(mood);
CREATE INDEX IF NOT EXISTS idx_recommendation_logs_created_at ON recommendation_logs(created_at DESC);

-- Enable Row Level Security for recommendation_logs
ALTER TABLE recommendation_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own recommendation logs" ON recommendation_logs;
DROP POLICY IF EXISTS "System can insert recommendation logs" ON recommendation_logs;

-- Policy: Users can view their own recommendation logs
CREATE POLICY "Users can view own recommendation logs"
  ON recommendation_logs FOR SELECT
  USING (auth.uid() = user_id OR user_id IS NULL);

-- Policy: System can insert recommendation logs
CREATE POLICY "System can insert recommendation logs"
  ON recommendation_logs FOR INSERT
  WITH CHECK (true);

-- Create cafe_rankings table (stores AI-generated rankings)
CREATE TABLE IF NOT EXISTS cafe_rankings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  filter_type TEXT NOT NULL,
  cafe_count INTEGER DEFAULT 0,
  ranking_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for cafe_rankings
CREATE INDEX IF NOT EXISTS idx_cafe_rankings_filter_type ON cafe_rankings(filter_type);
CREATE INDEX IF NOT EXISTS idx_cafe_rankings_created_at ON cafe_rankings(created_at DESC);

-- Enable Row Level Security for cafe_rankings
ALTER TABLE cafe_rankings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view all cafe rankings" ON cafe_rankings;
DROP POLICY IF EXISTS "System can insert cafe rankings" ON cafe_rankings;

-- Policy: Users can view all cafe rankings
CREATE POLICY "Users can view all cafe rankings"
  ON cafe_rankings FOR SELECT
  USING (true);

-- Policy: System can insert cafe rankings
CREATE POLICY "System can insert cafe rankings"
  ON cafe_rankings FOR INSERT
  WITH CHECK (true);

-- Create a function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
DROP TRIGGER IF EXISTS update_review_summaries_updated_at ON review_summaries;

-- Create triggers for updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_summaries_updated_at
  BEFORE UPDATE ON review_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
