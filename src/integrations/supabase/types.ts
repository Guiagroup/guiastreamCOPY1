export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      personal_records: {
        Row: {
          created_at: string
          date_achieved: string
          distance: number
          id: string
          race_location: string | null
          time: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          date_achieved: string
          distance: number
          id?: string
          race_location?: string | null
          time: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          date_achieved?: string
          distance?: number
          id?: string
          race_location?: string | null
          time?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          billing_start_date: string | null
          bio: string | null
          cancellation_requested: boolean | null
          categories_created: number | null
          categories_reset_date: string | null
          created_at: string
          id: string
          location: string | null
          monthly_category_limit: number | null
          monthly_upload_limit: number | null
          payment_method: Json | null
          plan_type: string | null
          subscription_end_date: string | null
          subscription_status: string | null
          trial_end_date: string | null
          trial_status: string | null
          updated_at: string
          uploads_reset_date: string | null
          uploads_used: number | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          billing_start_date?: string | null
          bio?: string | null
          cancellation_requested?: boolean | null
          categories_created?: number | null
          categories_reset_date?: string | null
          created_at?: string
          id: string
          location?: string | null
          monthly_category_limit?: number | null
          monthly_upload_limit?: number | null
          payment_method?: Json | null
          plan_type?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          trial_end_date?: string | null
          trial_status?: string | null
          updated_at?: string
          uploads_reset_date?: string | null
          uploads_used?: number | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          billing_start_date?: string | null
          bio?: string | null
          cancellation_requested?: boolean | null
          categories_created?: number | null
          categories_reset_date?: string | null
          created_at?: string
          id?: string
          location?: string | null
          monthly_category_limit?: number | null
          monthly_upload_limit?: number | null
          payment_method?: Json | null
          plan_type?: string | null
          subscription_end_date?: string | null
          subscription_status?: string | null
          trial_end_date?: string | null
          trial_status?: string | null
          updated_at?: string
          uploads_reset_date?: string | null
          uploads_used?: number | null
          username?: string | null
        }
        Relationships: []
      }
      videos: {
        Row: {
          category: string
          description: string | null
          id: string
          is_favorite: boolean | null
          last_played_position: number | null
          thumbnail_url: string | null
          title: string
          upload_date: string | null
          user_id: string
          video_url: string
        }
        Insert: {
          category: string
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          last_played_position?: number | null
          thumbnail_url?: string | null
          title: string
          upload_date?: string | null
          user_id: string
          video_url: string
        }
        Update: {
          category?: string
          description?: string | null
          id?: string
          is_favorite?: boolean | null
          last_played_position?: number | null
          thumbnail_url?: string | null
          title?: string
          upload_date?: string | null
          user_id?: string
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      reset_monthly_limits: {
        Args: Record<PropertyKey, never>
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
