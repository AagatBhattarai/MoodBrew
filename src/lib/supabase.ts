import { createClient } from '@supabase/supabase-js';

// These should be set as environment variables in production
// For now, you'll need to replace these with your Supabase project credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase credentials not found. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  console.warn('📖 See SUPABASE_SETUP.md for instructions');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

