import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import type {
  Mood,
  CoffeeProduct,
  Cafe,
  Order,
  UserProfile,
  WeatherData,
  AIRecommendation,
  DailyChallenge,
  LeaderboardEntry,
  ViewState,
  MoodHistoryEntry
} from '@/types';

interface AppState {
  // Navigation
  currentView: ViewState;
  selectedProduct: CoffeeProduct | null;
  selectedCafe: Cafe | null;
  setView: (view: ViewState) => void;
  setSelectedProduct: (product: CoffeeProduct | null) => void;
  setSelectedCafe: (cafe: Cafe | null) => void;

  // Mood
  currentMood: Mood | null;
  moodHistory: MoodHistoryEntry[];
  setMood: (mood: Mood | null) => void;
  addMoodHistory: (entry: MoodHistoryEntry) => void;

  // User
  user: UserProfile | null;
  isAuthenticated: boolean;
  setUser: (user: UserProfile | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserStats: (updates: Partial<UserProfile['stats']>) => void;

  // Weather
  weather: WeatherData | null;
  setWeather: (weather: WeatherData | null) => void;

  // Cart
  cart: Order | null;
  addToCart: (item: Order['items'][0]) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;

  // Order history (for admin dashboard + user progress)
  orderHistory: (Order & { customerName?: string })[];
  addOrderToHistory: (order: Order, customerName?: string) => void;

  // Recommendations
  recommendations: AIRecommendation[];
  setRecommendations: (recs: AIRecommendation[]) => void;

  // Challenges
  dailyChallenges: DailyChallenge[];
  setDailyChallenges: (challenges: DailyChallenge[]) => void;
  completeChallenge: (challengeId: string) => void;
  updateChallengeProgress: (challengeId: string, progress: number) => void;

  // Leaderboard
  leaderboard: LeaderboardEntry[];
  setLeaderboard: (entries: LeaderboardEntry[]) => void;

  // Flavor Wheel (Max 3 selections)
  selectedFlavors: string[];
  toggleFlavor: (flavorId: string) => void;
  clearFlavors: () => void;
  canAddMoreFlavors: () => boolean;

  // UI
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  toast: { message: string; type: 'success' | 'error' | 'info'; visible: boolean } | null;
  hideToast: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Navigation
      currentView: 'home',
      selectedProduct: null,
      selectedCafe: null,
      setView: (view) => set({ currentView: view }),
      setSelectedProduct: (product) => set({ selectedProduct: product }),
      setSelectedCafe: (cafe) => set({ selectedCafe: cafe }),

      // Mood
      currentMood: null,
      moodHistory: [],
      setMood: (mood) => set({ currentMood: mood }),
      addMoodHistory: (entry) => {
        const { moodHistory } = get();
        set({ moodHistory: [entry, ...moodHistory].slice(0, 30) });
      },

      // User
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: async (email, password) => {
        // DEVELOPMENT BYPASS: Hardcoded admin login to bypass Supabase rate limits
        if (email === 'admin@moodbrew.com' && password === 'admin123') {
          const adminUser: UserProfile = {
            id: 'dev-admin-id',
            role: 'admin',
            name: 'Admin User',
            email: 'admin@moodbrew.com',
            avatar: 'https://ui-avatars.com/api/?name=Admin&background=random',
            preferences: { favoriteMoods: [], dietaryRestrictions: [], defaultMilk: 'regular', defaultSweetness: 3 },
            stats: { totalOrders: 0, totalSpent: 0, currentStreak: 0, longestStreak: 0, level: 1, points: 0, achievements: [], co2Saved: 0, farmersSupported: 0 },
            moodHistory: [],
            paymentMethods: [],
            addresses: [],
          };
          set({ user: adminUser, isAuthenticated: true });
          get().showToast('Logged in as Admin (Dev Mode)', 'success');
          return true;
        }

        if (!supabase) {
          get().showToast('Supabase is not configured. Use admin@moodbrew.com / admin123 for dev login.', 'error');
          return false;
        }
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            // Fetch profile
            const { data: profile, error: profileError } = await (supabase.from('profiles') as any)
              .select('*')
              .eq('id', data.user.id)
              .single();

            if (profileError) throw profileError;

            // Fetch related data (simplified for now)
            const { data: paymentMethods } = await supabase.from('payment_methods').select('*').eq('user_id', data.user.id);
            const { data: addresses } = await supabase.from('addresses').select('*').eq('user_id', data.user.id);

            const userProfile: UserProfile = {
              id: profile.id,
              role: profile.role || (email.includes('admin') ? 'admin' : 'user'),
              name: profile.name || email.split('@')[0],
              email: profile.email || email,
              avatar: profile.avatar_url,
              phone: profile.phone,
              preferences: profile.preferences || {
                favoriteMoods: [],
                dietaryRestrictions: [],
                defaultMilk: 'regular',
                defaultSweetness: 3,
              },
              stats: profile.stats || {
                totalOrders: 0,
                totalSpent: 0,
                currentStreak: 0,
                longestStreak: 0,
                level: 1,
                points: 0,
                achievements: [],
                co2Saved: 0,
                farmersSupported: 0,
              },
              moodHistory: [], // Requires separate fetch or join
              paymentMethods: (paymentMethods as any[]) || [],
              addresses: (addresses as any[]) || [],
              notificationPreferences: profile.notification_preferences,
              privacySettings: profile.privacy_settings
            };

            set({ user: userProfile, isAuthenticated: true });
            return true;
          }
        } catch (error: any) {
          console.error('Login error:', error.message);
          get().showToast(error.message, 'error');
          return false;
        }
        return false;
      },
      signup: async (name, email, password) => {
        if (!supabase) {
          get().showToast('Supabase is not configured.', 'error');
          return false;
        }
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name,
                avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
              },
            },
          });

          if (error) throw error;

          if (data.user) {
            // Profile creation handled by trigger, but we might want to wait or just proceed
            // For immediate feedback, we can construct the user object locally or login
            // Supabase auto-login after signup depends on email confirmation settings
            // Assuming email confirmation is OFF for dev or handles session:

            if (data.session) {
              // Auto logged in
              const userProfile: UserProfile = {
                id: data.user.id,
                name,
                role: 'user',
                email,
                avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
                preferences: { favoriteMoods: [], dietaryRestrictions: [], defaultMilk: 'regular', defaultSweetness: 3 },
                stats: { totalOrders: 0, totalSpent: 0, currentStreak: 0, longestStreak: 0, level: 1, points: 0, achievements: [], co2Saved: 0, farmersSupported: 0 },
                moodHistory: [],
              };
              set({ user: userProfile, isAuthenticated: true });
              return true;
            } else {
              get().showToast('Please check your email to confirm signup', 'info');
              return true;
            }
          }
        } catch (error: any) {
          console.error('Signup error:', error.message);
          get().showToast(error.message, 'error');
          return false;
        }
        return false;
      },
      logout: async () => {
        if (supabase) await supabase.auth.signOut();
        set({ user: null, isAuthenticated: false, currentView: 'login' });
      },
      updateUserStats: async (updates) => {
        const { user } = get();
        if (user) {
          const newStats = { ...user.stats, ...updates };

          // Optimistic update
          set({
            user: {
              ...user,
              stats: newStats,
            },
          });

          // Sync with Supabase (optional)
          if (supabase) {
            try {
              const { error: _err } = await (supabase.from('profiles') as any)
                .update({ stats: newStats })
                .eq('id', user.id);

              if (_err) throw _err;
            } catch (error) {
              console.error('Failed to sync stats:', error);
            }
          }
        }
      },

      // Weather
      weather: null,
      setWeather: (weather) => set({ weather }),

      // Cart
      cart: null,
      addToCart: (item) => {
        const { cart } = get();
        if (!cart) {
          set({
            cart: {
              id: `order-${Date.now()}`,
              items: [item],
              type: 'pickup',
              status: 'pending',
              total: item.price * item.quantity,
              createdAt: new Date().toISOString(),
            },
          });
        } else {
          const existingIndex = cart.items.findIndex(
            (i) => i.productId === item.productId && i.size === item.size
          );
          if (existingIndex >= 0) {
            const newItems = [...cart.items];
            newItems[existingIndex].quantity += item.quantity;
            set({
              cart: {
                ...cart,
                items: newItems,
                total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
              },
            });
          } else {
            const newItems = [...cart.items, item];
            set({
              cart: {
                ...cart,
                items: newItems,
                total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
              },
            });
          }
        }
      },
      removeFromCart: (index) => {
        const { cart } = get();
        if (cart) {
          const newItems = cart.items.filter((_, i) => i !== index);
          set({
            cart: newItems.length > 0 ? {
              ...cart,
              items: newItems,
              total: newItems.reduce((sum, i) => sum + i.price * i.quantity, 0),
            } : null,
          });
        }
      },
      clearCart: () => set({ cart: null }),

      orderHistory: [],
      addOrderToHistory: (order, customerName) => {
        const { orderHistory } = get();
        set({
          orderHistory: [{ ...order, customerName }, ...orderHistory].slice(0, 200),
        });
      },

      // Recommendations
      recommendations: [],
      setRecommendations: (recs) => set({ recommendations: recs }),

      // Challenges
      dailyChallenges: [],
      setDailyChallenges: (challenges) => set({ dailyChallenges: challenges }),
      completeChallenge: (challengeId) => {
        const { dailyChallenges, user } = get();
        const challenge = dailyChallenges.find((c) => c.id === challengeId);
        if (challenge && !challenge.completed) {
          const updatedChallenges = dailyChallenges.map((c) =>
            c.id === challengeId ? { ...c, completed: true, progress: c.maxProgress } : c
          );
          set({
            dailyChallenges: updatedChallenges,
            user: user ? {
              ...user,
              stats: {
                ...user.stats,
                points: user.stats.points + challenge.reward,
              },
            } : null,
          });
        }
      },
      updateChallengeProgress: (challengeId, progress) => {
        const { dailyChallenges } = get();
        const updatedChallenges = dailyChallenges.map((c) =>
          c.id === challengeId ? { ...c, progress: Math.min(progress, c.maxProgress) } : c
        );
        set({ dailyChallenges: updatedChallenges });
      },

      // Leaderboard
      leaderboard: [],
      setLeaderboard: (entries) => set({ leaderboard: entries }),

      // Flavor Wheel (Max 3 selections)
      selectedFlavors: [],
      toggleFlavor: (flavorId) => {
        const { selectedFlavors } = get();
        if (selectedFlavors.includes(flavorId)) {
          // Remove if already selected
          set({ selectedFlavors: selectedFlavors.filter(id => id !== flavorId) });
        } else if (selectedFlavors.length < 3) {
          // Add if under limit
          set({ selectedFlavors: [...selectedFlavors, flavorId] });
        }
      },
      clearFlavors: () => set({ selectedFlavors: [] }),
      canAddMoreFlavors: () => get().selectedFlavors.length < 3,

      // UI
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),
      toast: null,
      showToast: (message, type = 'info') => {
        set({ toast: { message, type, visible: true } });
        setTimeout(() => set({ toast: null }), 3000);
      },
      hideToast: () => set({ toast: null }),
    }),
    {
      name: 'moodbrew-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        currentMood: state.currentMood,
        moodHistory: state.moodHistory,
        orderHistory: state.orderHistory,
      }),
    }
  )
);
