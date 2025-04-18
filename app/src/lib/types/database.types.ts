// Database types for Supabase
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
      jobs: {
        Row: {
          carrier_id: string | null
          created_at: string
          customer_id: string
          delivery_address: string
          delivery_lat: number | null
          delivery_lng: number | null
          description: string | null
          id: string
          items: string[]
          pickup_address: string
          pickup_lat: number | null
          pickup_lng: number | null
          price: number | null
          status: string
          title: string
          updated_at: string
        }
      }
      payments: {
        Row: {
          amount: number
          carrier_id: string
          created_at: string
          customer_id: string
          id: string
          job_id: string
          payment_method: string | null
          status: string
          transaction_id: string | null
          updated_at: string
        }
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          role: string
          updated_at: string
        }
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          job_id: string
          rating: number
          reviewee_id: string
          reviewer_id: string
        }
      }
      tracking_updates: {
        Row: {
          created_at: string
          id: string
          job_id: string
          lat: number
          lng: number
          note: string | null
          status: string | null
        }
      }
    }
    Functions: {
      accept_job: {
        Args: {
          job_id: string
        }
        Returns: unknown
      }
      get_available_jobs: {
        Args: Record<string, never>
        Returns: unknown[]
      }
      get_my_jobs: {
        Args: Record<string, never>
        Returns: unknown[]
      }
      get_profile_by_id: {
        Args: {
          profile_id: string
        }
        Returns: unknown[]
      }
      update_job_status: {
        Args: {
          job_id: string
          new_status: string
        }
        Returns: unknown
      }
    }
  }
}

// Export types for profiles and other common entities
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Job = Database['public']['Tables']['jobs']['Row']
export type Payment = Database['public']['Tables']['payments']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']
export type TrackingUpdate = Database['public']['Tables']['tracking_updates']['Row']
