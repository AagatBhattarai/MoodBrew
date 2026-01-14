-- Social Features Database Schema for MoodBrew
-- Adds check-ins and sharing functionality

-- Create check_ins table
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cafe_id TEXT NOT NULL,
  cafe_name TEXT NOT NULL,
  checked_in_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  location_verified BOOLEAN DEFAULT false,
  shared BOOLEAN DEFAULT false,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for check_ins
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_cafe_id ON check_ins(cafe_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_checked_in_at ON check_ins(checked_in_at DESC);

-- Enable Row Level Security for check_ins
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own check-ins" ON check_ins;
DROP POLICY IF EXISTS "Users can view all check-ins" ON check_ins;
DROP POLICY IF EXISTS "Users can insert own check-ins" ON check_ins;
DROP POLICY IF EXISTS "Users can update own check-ins" ON check_ins;
DROP POLICY IF EXISTS "Users can delete own check-ins" ON check_ins;

-- Policy: Users can view all check-ins (for social features)
CREATE POLICY "Users can view all check-ins"
  ON check_ins FOR SELECT
  USING (true);

-- Policy: Users can insert their own check-ins
CREATE POLICY "Users can insert own check-ins"
  ON check_ins FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own check-ins
CREATE POLICY "Users can update own check-ins"
  ON check_ins FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own check-ins
CREATE POLICY "Users can delete own check-ins"
  ON check_ins FOR DELETE
  USING (auth.uid() = user_id);

-- Create shares table
CREATE TABLE IF NOT EXISTS shares (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  shareable_type TEXT NOT NULL CHECK (shareable_type IN ('cafe', 'product', 'check_in', 'review')),
  shareable_id TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('twitter', 'facebook', 'whatsapp', 'link')),
  share_url TEXT,
  shared_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for shares
CREATE INDEX IF NOT EXISTS idx_shares_user_id ON shares(user_id);
CREATE INDEX IF NOT EXISTS idx_shares_shareable_type ON shares(shareable_type);
CREATE INDEX IF NOT EXISTS idx_shares_shareable_id ON shares(shareable_id);
CREATE INDEX IF NOT EXISTS idx_shares_platform ON shares(platform);
CREATE INDEX IF NOT EXISTS idx_shares_shared_at ON shares(shared_at DESC);

-- Enable Row Level Security for shares
ALTER TABLE shares ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own shares" ON shares;
DROP POLICY IF EXISTS "Users can insert own shares" ON shares;

-- Policy: Users can view their own shares
CREATE POLICY "Users can view own shares"
  ON shares FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own shares
CREATE POLICY "Users can insert own shares"
  ON shares FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create a function to get check-in count for a cafe
CREATE OR REPLACE FUNCTION get_cafe_check_in_count(p_cafe_id TEXT)
RETURNS INTEGER AS $$
BEGIN
  RETURN (SELECT COUNT(*) FROM check_ins WHERE cafe_id = p_cafe_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user's recent check-ins
CREATE OR REPLACE FUNCTION get_user_recent_check_ins(p_user_id UUID, p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  id UUID,
  cafe_id TEXT,
  cafe_name TEXT,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id,
    c.cafe_id,
    c.cafe_name,
    c.checked_in_at,
    c.notes
  FROM check_ins c
  WHERE c.user_id = p_user_id
  ORDER BY c.checked_in_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
