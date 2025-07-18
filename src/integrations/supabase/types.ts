export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      carts: {
        Row: {
          created_at: string
          id: string
          price: number
          quantity: number
          service_id: number | null
          service_quantity: number
          updated_at: string
          user_id: string
          userInput: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          quantity?: number
          service_id?: number | null
          service_quantity: number
          updated_at?: string
          user_id: string
          userInput?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          quantity?: number
          service_id?: number | null
          service_quantity?: number
          updated_at?: string
          user_id?: string
          userInput?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "carts_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          customer_info: Json
          estimated_delivery: string | null
          id: string
          items: Json
          order_id: string
          payment_verified: boolean | null
          status: string
          total_amount: number
          tracking_info: Json | null
          transaction_id: string | null
          updated_at: string
          user_email: string
          user_id: string
        }
        Insert: {
          created_at?: string
          customer_info: Json
          estimated_delivery?: string | null
          id?: string
          items: Json
          order_id: string
          payment_verified?: boolean | null
          status?: string
          total_amount: number
          tracking_info?: Json | null
          transaction_id?: string | null
          updated_at?: string
          user_email: string
          user_id: string
        }
        Update: {
          created_at?: string
          customer_info?: Json
          estimated_delivery?: string | null
          id?: string
          items?: Json
          order_id?: string
          payment_verified?: boolean | null
          status?: string
          total_amount?: number
          tracking_info?: Json | null
          transaction_id?: string | null
          updated_at?: string
          user_email?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          phone: string | null
          role: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          role?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      public_purchases: {
        Row: {
          created_at: string
          id: string
          location: string | null
          service_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          service_name: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          service_name?: string
        }
        Relationships: []
      }
      qna: {
        Row: {
          answer: string | null
          answered_at: string | null
          answered_by_admin: boolean | null
          created_at: string | null
          id: string
          question: string
          service_id: number
          upvotes: number | null
          user_id: string
        }
        Insert: {
          answer?: string | null
          answered_at?: string | null
          answered_by_admin?: boolean | null
          created_at?: string | null
          id?: string
          question: string
          service_id: number
          upvotes?: number | null
          user_id: string
        }
        Update: {
          answer?: string | null
          answered_at?: string | null
          answered_by_admin?: boolean | null
          created_at?: string | null
          id?: string
          question?: string
          service_id?: number
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "qna_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          downvotes: number | null
          id: string
          is_verified_purchase: boolean | null
          media_urls: Json | null
          rating: number
          service_id: number
          title: string | null
          upvotes: number | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          downvotes?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          media_urls?: Json | null
          rating: number
          service_id: number
          title?: string | null
          upvotes?: number | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          downvotes?: number | null
          id?: string
          is_verified_purchase?: boolean | null
          media_urls?: Json | null
          rating?: number
          service_id?: number
          title?: string | null
          upvotes?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      service_tiers: {
        Row: {
          created_at: string
          id: string
          price: number
          quantity: number
          service_id: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          price: number
          quantity: number
          service_id?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          price?: number
          quantity?: number
          service_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "service_tiers_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          badge: string | null
          created_at: string
          description: string
          features: string[] | null
          icon_name: string
          id: number
          is_active: boolean | null
          platform: string
          rating: number | null
          reviews: number | null
          title: string
          updated_at: string
        }
        Insert: {
          badge?: string | null
          created_at?: string
          description: string
          features?: string[] | null
          icon_name: string
          id?: number
          is_active?: boolean | null
          platform: string
          rating?: number | null
          reviews?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          badge?: string | null
          created_at?: string
          description?: string
          features?: string[] | null
          icon_name?: string
          id?: number
          is_active?: boolean | null
          platform?: string
          rating?: number | null
          reviews?: number | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: number
          role: string
          user_id: string
        }
        Insert: {
          id?: number
          role: string
          user_id: string
        }
        Update: {
          id?: number
          role?: string
          user_id?: string
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          service_id: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          service_id?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          service_id?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      qna_with_users: {
        Row: {
          answer: string | null
          answered_at: string | null
          answered_by_admin: boolean | null
          created_at: string | null
          full_name: string | null
          id: string | null
          question: string | null
          service_id: number | null
          upvotes: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "qna_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews_with_users: {
        Row: {
          comment: string | null
          created_at: string | null
          downvotes: number | null
          full_name: string | null
          id: string | null
          is_verified_purchase: boolean | null
          media_urls: Json | null
          rating: number | null
          service_id: number | null
          title: string | null
          upvotes: number | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      get_user_role: {
        Args: Record<PropertyKey, never> | { p_user_id: string }
        Returns: string
      }
      submit_review: {
        Args: {
          p_service_id: number
          p_rating: number
          p_title: string
          p_comment: string
          p_media_urls: Json
        }
        Returns: Json
      }
      update_order_status: {
        Args: {
          order_id_param: string
          new_status: string
          payment_verified_param: boolean
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
