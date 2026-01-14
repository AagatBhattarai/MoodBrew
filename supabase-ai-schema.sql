-- AI Features Database Schema for MoodBrew
-- Run this SQL in your Supabase SQL Editor after the base setup

-- Create reviews table
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

-- Create triggers for updated_at
CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_review_summaries_updated_at
  BEFORE UPDATE ON review_summaries
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample reviews for testing (optional)
-- You can remove this section if you don't want sample data
INSERT INTO reviews (cafe_id, user_id, user_name, rating, comment) VALUES
  ('cafe-1', (SELECT id FROM auth.users LIMIT 1), 'Coffee Lover', 5, 'Amazing coffee and great atmosphere! The baristas are very friendly.'),
  ('cafe-1', (SELECT id FROM auth.users LIMIT 1), 'Java Enthusiast', 4, 'Good quality coffee, but a bit pricey. The ambiance is nice though.'),
  ('cafe-1', (SELECT id FROM auth.users LIMIT 1), 'Cafe Explorer', 5, 'Best latte in town! Highly recommend the caramel macchiato.'),
  ('cafe-2', (SELECT id FROM auth.users LIMIT 1), 'Coffee Fan', 4, 'Nice place to work. Good WiFi and comfortable seating.'),
  ('cafe-2', (SELECT id FROM auth.users LIMIT 1), 'Regular Customer', 3, 'Decent coffee but service could be faster during peak hours.')
ON CONFLICT DO NOTHING;

