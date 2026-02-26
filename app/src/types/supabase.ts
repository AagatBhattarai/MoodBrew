export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string | null
          email: string | null
          avatar_url: string | null
          phone: string | null
          preferences: Json
          stats: Json
          notification_preferences: Json
          privacy_settings: Json
          role: 'user' | 'admin' | 'moderator'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          phone?: string | null
          preferences?: Json
          stats?: Json
          notification_preferences?: Json
          privacy_settings?: Json
          role?: 'user' | 'admin' | 'moderator'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string | null
          email?: string | null
          avatar_url?: string | null
          phone?: string | null
          preferences?: Json
          stats?: Json
          notification_preferences?: Json
          privacy_settings?: Json
          role?: 'user' | 'admin' | 'moderator'
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          original_price: number | null
          image: string | null
          category: string | null
          tags: string[] | null
          flavor_notes: string[] | null
          rating: number | null
          review_count: number | null
          hidden: boolean | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          original_price?: number | null
          image?: string | null
          category?: string | null
          tags?: string[] | null
          flavor_notes?: string[] | null
          rating?: number | null
          review_count?: number | null
          hidden?: boolean | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          original_price?: number | null
          image?: string | null
          category?: string | null
          tags?: string[] | null
          flavor_notes?: string[] | null
          rating?: number | null
          review_count?: number | null
          hidden?: boolean | null
          created_at?: string
          updated_at?: string
        }
      }
      cafes: {
        Row: {
          id: string
          name: string
          address: string
          description: string | null
          image: string | null
          rating: number | null
          review_count: number | null
          features: string[] | null
          lat: number | null
          lng: number | null
          status: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          address: string
          description?: string | null
          image?: string | null
          rating?: number | null
          review_count?: number | null
          features?: string[] | null
          lat?: number | null
          lng?: number | null
          status?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string
          description?: string | null
          image?: string | null
          rating?: number | null
          review_count?: number | null
          features?: string[] | null
          lat?: number | null
          lng?: number | null
          status?: string | null
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          items: Json
          total_amount: number
          status: 'pending' | 'processing' | 'completed' | 'cancelled' | null
          payment_status: string | null
          payment_method_id: string | null
          shipping_address_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          items: Json
          total_amount: number
          status?: 'pending' | 'processing' | 'completed' | 'cancelled' | null
          payment_status?: string | null
          payment_method_id?: string | null
          shipping_address_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          items?: Json
          total_amount?: number
          status?: 'pending' | 'processing' | 'completed' | 'cancelled' | null
          payment_status?: string | null
          payment_method_id?: string | null
          shipping_address_id?: string | null
          created_at?: string
        }
      }
      mood_history: {
        Row: {
          id: string
          user_id: string
          mood: string
          product_id: string | null
          drink_name: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          mood: string
          product_id?: string | null
          drink_name?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          mood?: string
          product_id?: string | null
          drink_name?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
