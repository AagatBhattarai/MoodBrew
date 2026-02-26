export type Mood = 
  | 'energized' 
  | 'cozy' 
  | 'focused' 
  | 'adventurous' 
  | 'relaxed' 
  | 'romantic' 
  | 'melancholy' 
  | 'celebratory'
  | 'healthy';

export interface MoodConfig {
  id: Mood;
  label: string;
  emoji: string;
  color: string;
  gradient: string;
  description: string;
}

export interface FlavorProfile {
  id: string;
  name: string;
  icon: string;
  notes: string[];
  color: string;
  description: string;
}

export interface CoffeeProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  tags: string[];
  flavorNotes: string[];
  flavorProfileIds?: string[];
  intensity: number;
  caffeineLevel: number;
  sweetness: number;
  acidity: number;
  body: number;
  bestFor: Mood[];
  temperature: 'hot' | 'iced' | 'both' | 'cold' | 'room';
  prepTime: number;
  calories: number;
  isSignature?: boolean;
  isNew?: boolean;
  isNepaliOrigin?: boolean;
  origin?: string;
  altitude?: string;
  cafeId?: string;
  rating: number;
  reviewCount: number;
  weeklyOrders?: number;
}

export interface Cafe {
  id: string;
  name: string;
  description: string;
  image: string;
  gallery: string[];
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  rating: number;
  reviewCount: number;
  openingHours: {
    [key: string]: string;
  };
  phone: string;
  features: string[];
  signatureDrinks: string[];
  vibe: string;
  isPopular?: boolean;
  isNew?: boolean;
  pros: string[];
  cons: string[];
  weeklyOrders?: number;
  rankingPosition?: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  size: 'small' | 'medium' | 'large';
  milk: string;
  sweetness: number;
  addOns: string[];
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  items: OrderItem[];
  cafeId?: string;
  cafeName?: string;
  type: 'pickup' | 'delivery';
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  createdAt: string;
  estimatedReadyTime?: string;
}


export interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'cash';
  last4?: string;
  brand?: string;
  expiry?: string;
  isDefault: boolean;
  name: string;
}

export interface Address {
  id: string;
  name: string;
  address: string;
  city: string;
  zip: string;
  type: 'home' | 'work' | 'other';
  isDefault: boolean;
  location?: { lat: number; lng: number };
}

export interface NotificationPreferences {
  offers: boolean;
  orders: boolean;
  news: boolean;
  moodAlerts: boolean;
  nearbyCafes: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'friends' | 'private';
  activityStatus: boolean;
  dataSharing: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'moderator';
  avatar?: string;
  avatar_url?: string;
  phone?: string;
  created_at?: string;
  preferences: {
    favoriteMoods: Mood[];
    dietaryRestrictions: string[];
    defaultMilk: string;
    defaultSweetness: number;
  };
  stats: UserStats;
  moodHistory?: MoodHistoryEntry[];
  paymentMethods?: PaymentMethod[];
  addresses?: Address[];
  notificationPreferences?: NotificationPreferences;
  privacySettings?: PrivacySettings;
}

export interface UserStats {
  totalOrders: number;
  totalSpent: number;
  currentStreak: number;
  longestStreak: number;
  favoriteDrink?: string;
  favoriteCafe?: string;
  level: number;
  points: number;
  achievements: Achievement[];
  co2Saved?: number;
  farmersSupported?: number;
}

export interface MoodHistoryEntry {
  date: string;
  mood: Mood;
  drinkId: string;
  drinkName: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface WeatherData {
  temperature: number;
  condition: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  isDay: boolean;
}

export interface AIRecommendation {
  product: CoffeeProduct;
  reason: string;
  confidence: number;
  pairing?: string;
  cafeName?: string;
  cafeRating?: number;
  trendingPosition?: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  reward: number;
  progress: number;
  maxProgress: number;
  completed: boolean;
  expiresAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar?: string;
  points: number;
  favoriteDrink: string;
  isCurrentUser?: boolean;
}

export interface NepaliHistoryEvent {
  year: string;
  title: string;
  description: string;
  image: string;
}

export interface NepaliFact {
  id: number;
  title: string;
  description: string;
  stat: string;
  statLabel: string;
  image: string;
}

export type ViewState = 
  | 'home' 
  | 'products' 
  | 'product-detail' 
  | 'cafes' 
  | 'cafe-detail' 
  | 'orders' 
  | 'rankings' 
  | 'profile' 
  | 'edit-profile'
  | 'payment-methods'
  | 'saved-addresses'
  | 'notifications'
  | 'privacy-security'
  | 'settings'
  | 'login' 
  | 'signup'
  | 'admin-dashboard';
