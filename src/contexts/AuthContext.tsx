import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

// Infer Session and User types from Supabase auth response
type Session = Awaited<ReturnType<typeof supabase.auth.getSession>>['data']['session'];
type User = NonNullable<Session>['user'];

interface UserProfile {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        setLoading(false);
        return;
      }

      if (data) {
        // Only update profile if we have valid data (don't overwrite with empty name)
        setProfile(prev => {
          const fetchedName = data.name?.trim() || '';
          
          // If fetched name is valid, use it
          if (fetchedName !== '') {
            return {
              id: data.id,
              name: fetchedName,
              email: data.email || user?.email || '',
            };
          }
          
          // If fetched name is empty but we have a previous profile with a name, keep it
          if (prev && prev.id === userId && prev.name && prev.name.trim() !== '') {
            return prev; // Keep existing profile
          }
          
          // Otherwise, set the fetched profile (even if name is empty)
          return {
            id: data.id,
            name: fetchedName,
            email: data.email || user?.email || '',
          };
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      if (data.user) {
        // Set profile immediately with the name (optimistic update)
        const newProfile = {
          id: data.user.id,
          name: name.trim(),
          email: email,
        };
        setProfile(newProfile);

        // Wait for the database trigger to create the profile (if it exists)
        await new Promise(resolve => setTimeout(resolve, 500));

        // Strategy: Try to insert first, if it fails (profile exists), then update
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile]);

        if (insertError) {
          // Profile already exists (from trigger), so update it
          console.log('Profile exists, updating name:', insertError.message);
          
          const { error: updateError } = await supabase
            .from('profiles')
            .update({
              name: name.trim(),
              email: email,
            })
            .eq('id', data.user.id);

          if (updateError) {
            console.error('Failed to update profile:', updateError);
            console.error('Error details:', JSON.stringify(updateError, null, 2));
            
            // Retry update after a short delay
            await new Promise(resolve => setTimeout(resolve, 500));
            const { error: retryError } = await supabase
              .from('profiles')
              .update({ name: name.trim() })
              .eq('id', data.user.id);
            
            if (retryError) {
              console.error('Retry update also failed:', retryError);
            }
          } else {
            console.log('Profile updated successfully');
          }
        } else {
          console.log('Profile inserted successfully');
        }

        // Verify and sync the profile state
        const { data: savedProfile } = await supabase
          .from('profiles')
          .select('name, email')
          .eq('id', data.user.id)
          .single();
        
        if (savedProfile) {
          if (savedProfile.name && savedProfile.name.trim() !== '') {
            setProfile({
              id: data.user.id,
              name: savedProfile.name.trim(),
              email: savedProfile.email || email,
            });
          } else {
            console.warn('Profile name is still empty after save attempt');
          }
        }
      }

      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        loading,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

