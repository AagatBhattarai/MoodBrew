-- Orders Database Schema for MoodBrew
-- Adds order tracking functionality

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cafe_id TEXT NOT NULL,
  cafe_name TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount DECIMAL(10, 2),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  order_type TEXT NOT NULL DEFAULT 'pickup' CHECK (order_type IN ('pickup', 'delivery')),
  delivery_address TEXT,
  estimated_time INTEGER, -- in minutes
  actual_completion_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_cafe_id ON orders(cafe_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Enable Row Level Security for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can insert own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;

-- Policy: Users can view their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own orders
CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own orders (for cancellation)
CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE
  USING (auth.uid() = user_id);

-- Create order_status_history table for tracking status changes
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL,
  message TEXT,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for order_status_history
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_changed_at ON order_status_history(changed_at DESC);

-- Enable Row Level Security for order_status_history
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own order status history" ON order_status_history;

-- Policy: Users can view status history for their own orders
CREATE POLICY "Users can view own order status history"
  ON order_status_history FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_status_history.order_id 
      AND orders.user_id = auth.uid()
    )
  );

-- Create a function to update order status and log history
CREATE OR REPLACE FUNCTION update_order_status(
  p_order_id UUID,
  p_new_status TEXT,
  p_message TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Update order status
  UPDATE orders 
  SET status = p_new_status, updated_at = NOW()
  WHERE id = p_order_id;
  
  -- Log status change
  INSERT INTO order_status_history (order_id, status, message)
  VALUES (p_order_id, p_new_status, p_message);
  
  -- If completed, set actual completion time
  IF p_new_status = 'completed' THEN
    UPDATE orders 
    SET actual_completion_time = NOW()
    WHERE id = p_order_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to update updated_at timestamp
DROP TRIGGER IF EXISTS update_orders_updated_at ON orders;
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create a function to get active orders for a user
CREATE OR REPLACE FUNCTION get_active_orders(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  cafe_name TEXT,
  items JSONB,
  total_amount DECIMAL(10, 2),
  status TEXT,
  order_type TEXT,
  estimated_time INTEGER,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.cafe_name,
    o.items,
    o.total_amount,
    o.status,
    o.order_type,
    o.estimated_time,
    o.created_at
  FROM orders o
  WHERE o.user_id = p_user_id
    AND o.status NOT IN ('completed', 'cancelled')
  ORDER BY o.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get order history for a user
CREATE OR REPLACE FUNCTION get_order_history(p_user_id UUID, p_limit INTEGER DEFAULT 20)
RETURNS TABLE (
  id UUID,
  cafe_name TEXT,
  items JSONB,
  total_amount DECIMAL(10, 2),
  status TEXT,
  order_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  actual_completion_time TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    o.id,
    o.cafe_name,
    o.items,
    o.total_amount,
    o.status,
    o.order_type,
    o.created_at,
    o.actual_completion_time
  FROM orders o
  WHERE o.user_id = p_user_id
  ORDER BY o.created_at DESC
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
