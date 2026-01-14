-- Gamification Database Schema for MoodBrew
-- Adds achievements, badges, streaks, and user stats

-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  requirement_type TEXT NOT NULL CHECK (requirement_type IN ('orders_count', 'check_ins_count', 'streak_days', 'reviews_count', 'shares_count', 'special')),
  requirement_value INTEGER NOT NULL,
  rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  points INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for achievements
CREATE INDEX IF NOT EXISTS idx_achievements_requirement_type ON achievements(requirement_type);
CREATE INDEX IF NOT EXISTS idx_achievements_rarity ON achievements(rarity);

-- Insert default achievements
INSERT INTO achievements (name, description, icon, requirement_type, requirement_value, rarity, points) VALUES
  ('First Sip', 'Place your first order', '☕', 'orders_count', 1, 'common', 10),
  ('Coffee Enthusiast', 'Place 10 orders', '🎯', 'orders_count', 10, 'common', 50),
  ('Coffee Addict', 'Place 50 orders', '🏆', 'orders_count', 50, 'rare', 200),
  ('Coffee Master', 'Place 100 orders', '👑', 'orders_count', 100, 'epic', 500),
  
  ('Explorer', 'Check in at your first cafe', '🗺️', 'check_ins_count', 1, 'common', 10),
  ('Cafe Hopper', 'Check in at 10 different cafes', '🚶', 'check_ins_count', 10, 'rare', 100),
  ('Cafe Connoisseur', 'Check in at 25 cafes', '🌟', 'check_ins_count', 25, 'epic', 250),
  
  ('On Fire', 'Maintain a 3-day streak', '🔥', 'streak_days', 3, 'common', 30),
  ('Dedicated', 'Maintain a 7-day streak', '⚡', 'streak_days', 7, 'rare', 100),
  ('Unstoppable', 'Maintain a 30-day streak', '💫', 'streak_days', 30, 'epic', 500),
  ('Legend', 'Maintain a 100-day streak', '🌠', 'streak_days', 100, 'legendary', 2000),
  
  ('Reviewer', 'Write your first review', '✍️', 'reviews_count', 1, 'common', 15),
  ('Critic', 'Write 20 reviews', '📝', 'reviews_count', 20, 'rare', 150),
  
  ('Social Butterfly', 'Share 10 times', '🦋', 'shares_count', 10, 'rare', 100),
  
  ('Early Bird', 'Order before 8 AM', '🐦', 'special', 1, 'rare', 50),
  ('Night Owl', 'Order after 10 PM', '🦉', 'special', 1, 'rare', 50)
ON CONFLICT (name) DO NOTHING;

-- Create user_badges table (tracks unlocked achievements)
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(user_id, achievement_id)
);

-- Create indexes for user_badges
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_achievement_id ON user_badges(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_unlocked_at ON user_badges(unlocked_at DESC);

-- Enable Row Level Security for user_badges
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own badges" ON user_badges;
DROP POLICY IF EXISTS "System can insert badges" ON user_badges;

-- Policy: Users can view their own badges
CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: System can insert badges
CREATE POLICY "System can insert badges"
  ON user_badges FOR INSERT
  WITH CHECK (true);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  total_orders INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  total_check_ins INTEGER DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for user_stats
CREATE INDEX IF NOT EXISTS idx_user_stats_level ON user_stats(level DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_xp ON user_stats(xp DESC);
CREATE INDEX IF NOT EXISTS idx_user_stats_total_points ON user_stats(total_points DESC);

-- Enable Row Level Security for user_stats
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can view all stats for leaderboard" ON user_stats;
DROP POLICY IF EXISTS "Users can insert own stats" ON user_stats;
DROP POLICY IF EXISTS "Users can update own stats" ON user_stats;

-- Policy: Users can view their own stats
CREATE POLICY "Users can view own stats"
  ON user_stats FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can view all stats for leaderboard
CREATE POLICY "Users can view all stats for leaderboard"
  ON user_stats FOR SELECT
  USING (true);

-- Policy: Users can insert their own stats
CREATE POLICY "Users can insert own stats"
  ON user_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: System can update stats
CREATE POLICY "Users can update own stats"
  ON user_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- Create a trigger to update user_stats updated_at
DROP TRIGGER IF EXISTS update_user_stats_updated_at ON user_stats;
CREATE TRIGGER update_user_stats_updated_at
  BEFORE UPDATE ON user_stats
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to initialize user stats
CREATE OR REPLACE FUNCTION initialize_user_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_stats (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to initialize stats for new users
DROP TRIGGER IF EXISTS on_user_created_init_stats ON auth.users;
CREATE TRIGGER on_user_created_init_stats
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION initialize_user_stats();

-- Create a function to update streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  v_last_activity_date DATE;
  v_current_streak INTEGER;
  v_longest_streak INTEGER;
BEGIN
  SELECT last_activity_date, current_streak, longest_streak
  INTO v_last_activity_date, v_current_streak, v_longest_streak
  FROM user_stats
  WHERE user_id = p_user_id;
  
  -- If no activity today
  IF v_last_activity_date IS NULL OR v_last_activity_date != CURRENT_DATE THEN
    -- Check if streak continues (yesterday's activity)
    IF v_last_activity_date = CURRENT_DATE - INTERVAL '1 day' THEN
      v_current_streak := v_current_streak + 1;
    ELSE
      -- Streak broken, start new
      v_current_streak := 1;
    END IF;
    
    -- Update longest streak if current is higher
    IF v_current_streak > v_longest_streak THEN
      v_longest_streak := v_current_streak;
    END IF;
    
    -- Update user stats
    UPDATE user_stats
    SET 
      current_streak = v_current_streak,
      longest_streak = v_longest_streak,
      last_activity_date = CURRENT_DATE,
      updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check and unlock achievements
CREATE OR REPLACE FUNCTION check_and_unlock_achievements(p_user_id UUID)
RETURNS SETOF achievements AS $$
DECLARE
  v_stats RECORD;
  v_achievement RECORD;
  v_unlocked BOOLEAN;
BEGIN
  -- Get user stats
  SELECT * INTO v_stats FROM user_stats WHERE user_id = p_user_id;
  
  -- Check each achievement
  FOR v_achievement IN SELECT * FROM achievements LOOP
    -- Check if already unlocked
    SELECT EXISTS(
      SELECT 1 FROM user_badges 
      WHERE user_id = p_user_id AND achievement_id = v_achievement.id
    ) INTO v_unlocked;
    
    IF NOT v_unlocked THEN
      -- Check if requirements met
      IF (v_achievement.requirement_type = 'orders_count' AND v_stats.total_orders >= v_achievement.requirement_value) OR
         (v_achievement.requirement_type = 'check_ins_count' AND v_stats.total_check_ins >= v_achievement.requirement_value) OR
         (v_achievement.requirement_type = 'streak_days' AND v_stats.current_streak >= v_achievement.requirement_value) OR
         (v_achievement.requirement_type = 'reviews_count' AND v_stats.total_reviews >= v_achievement.requirement_value) OR
         (v_achievement.requirement_type = 'shares_count' AND v_stats.total_shares >= v_achievement.requirement_value) THEN
        
        -- Unlock achievement
        INSERT INTO user_badges (user_id, achievement_id)
        VALUES (p_user_id, v_achievement.id)
        ON CONFLICT DO NOTHING;
        
        -- Award points
        UPDATE user_stats
        SET 
          total_points = total_points + v_achievement.points,
          xp = xp + v_achievement.points,
          updated_at = NOW()
        WHERE user_id = p_user_id;
        
        -- Return unlocked achievement
        RETURN NEXT v_achievement;
      END IF;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(p_limit INTEGER DEFAULT 10)
RETURNS TABLE (
  user_id UUID,
  level INTEGER,
  xp INTEGER,
  total_points INTEGER,
  total_orders INTEGER,
  current_streak INTEGER,
  rank BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.user_id,
    us.level,
    us.xp,
    us.total_points,
    us.total_orders,
    us.current_streak,
    ROW_NUMBER() OVER (ORDER BY us.total_points DESC, us.xp DESC) as rank
  FROM user_stats us
  ORDER BY us.total_points DESC, us.xp DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user's unlocked badges
CREATE OR REPLACE FUNCTION get_user_badges(p_user_id UUID)
RETURNS TABLE (
  achievement_name TEXT,
  achievement_description TEXT,
  achievement_icon TEXT,
  rarity TEXT,
  points INTEGER,
  unlocked_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.name,
    a.description,
    a.icon,
    a.rarity,
    a.points,
    ub.unlocked_at
  FROM user_badges ub
  JOIN achievements a ON a.id = ub.achievement_id
  WHERE ub.user_id = p_user_id
  ORDER BY ub.unlocked_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
