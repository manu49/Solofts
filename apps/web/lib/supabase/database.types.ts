export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type StoryTag =
  | 'wild_solo' | 'budget' | 'first_timer' | 'career_traveler'
  | 'road_trip' | 'backpacking' | 'luxury' | 'adventure' | 'digital_nomad'

export type GearCategory =
  | 'camera' | 'safety' | 'backpack' | 'clothing' | 'tech'
  | 'health' | 'navigation' | 'sleep' | 'footwear' | 'other'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          bio: string | null
          profession: string | null
          home_country: string | null
          countries_visited: number
          trips_count: number
          joined_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          bio?: string | null
          profession?: string | null
          home_country?: string | null
        }
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      stories: {
        Row: {
          id: string
          author_id: string
          title: string
          body: string
          destination: string
          country: string
          country_code: string | null
          days_count: number | null
          budget_usd: number | null
          pto_days: number | null
          tags: StoryTag[] | null
          cover_image: string | null
          is_published: boolean
          views: number
          likes: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['stories']['Row'], 'id' | 'views' | 'likes' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['stories']['Insert']>
      }
      safety_reports: {
        Row: {
          id: string
          author_id: string
          city: string
          country: string
          country_code: string | null
          lat: number | null
          lng: number | null
          safety_score: number
          transport_score: number | null
          accommodation_score: number | null
          nighttime_score: number | null
          notes: string | null
          visited_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['safety_reports']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['safety_reports']['Insert']>
      }
      gear_items: {
        Row: {
          id: string
          name: string
          brand: string | null
          category: GearCategory
          description: string | null
          image_url: string | null
          affiliate_url: string | null
          price_usd: number | null
          avg_rating: number
          review_count: number
          upvotes: number
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['gear_items']['Row'], 'id' | 'avg_rating' | 'review_count' | 'upvotes' | 'created_at'>
        Update: Partial<Database['public']['Tables']['gear_items']['Insert']>
      }
      gear_reviews: {
        Row: {
          id: string
          gear_id: string
          author_id: string
          rating: number
          review_text: string | null
          trip_type: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['gear_reviews']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['gear_reviews']['Insert']>
      }
      trip_plans: {
        Row: {
          id: string
          author_id: string
          title: string
          destination: string
          days_count: number
          budget_usd: number | null
          pto_days: number | null
          risk_level: 'low' | 'medium' | 'high' | null
          fitness_level: 'easy' | 'moderate' | 'challenging' | null
          itinerary: Json | null
          is_public: boolean
          ai_generated: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['trip_plans']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['trip_plans']['Insert']>
      }
      encounters: {
        Row: {
          id: string
          author_id: string
          destination: string
          country: string
          arrive_date: string
          depart_date: string
          looking_for: string | null
          is_active: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['encounters']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['encounters']['Insert']>
      }
    }
    Views: {
      city_safety_scores: {
        Row: {
          city: string
          country: string
          country_code: string | null
          lat: number | null
          lng: number | null
          avg_safety: number
          avg_transport: number | null
          avg_accommodation: number | null
          avg_nighttime: number | null
          report_count: number
          last_reported: string
        }
      }
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Story = Database['public']['Tables']['stories']['Row']
export type SafetyReport = Database['public']['Tables']['safety_reports']['Row']
export type GearItem = Database['public']['Tables']['gear_items']['Row']
export type GearReview = Database['public']['Tables']['gear_reviews']['Row']
export type TripPlan = Database['public']['Tables']['trip_plans']['Row']
export type Encounter = Database['public']['Tables']['encounters']['Row']
export type CityScore = Database['public']['Views']['city_safety_scores']['Row']
