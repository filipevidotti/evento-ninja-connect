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
      applications: {
        Row: {
          applied_at: string
          function_id: string | null
          id: string
          status: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          applied_at?: string
          function_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          applied_at?: string
          function_id?: string | null
          id?: string
          status?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_function_id_fkey"
            columns: ["function_id"]
            isOneToOne: false
            referencedRelation: "functions"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          created_at: string
          data: string
          descricao: string | null
          id: string
          local: string
          name: string
          produtor_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          data: string
          descricao?: string | null
          id?: string
          local: string
          name: string
          produtor_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: string
          descricao?: string | null
          id?: string
          local?: string
          name?: string
          produtor_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      functions: {
        Row: {
          cargo: string
          created_at: string
          evento_id: string | null
          id: string
          quantidade: number
          requirements: string | null
          valor: number
        }
        Insert: {
          cargo: string
          created_at?: string
          evento_id?: string | null
          id?: string
          quantidade: number
          requirements?: string | null
          valor: number
        }
        Update: {
          cargo?: string
          created_at?: string
          evento_id?: string | null
          id?: string
          quantidade?: number
          requirements?: string | null
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "functions_evento_id_fkey"
            columns: ["evento_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comentario: string | null
          created_at: string
          event_id: string | null
          id: string
          nota: number
          reviewed_id: string | null
          reviewer_id: string | null
          tipo: string
        }
        Insert: {
          comentario?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          nota: number
          reviewed_id?: string | null
          reviewer_id?: string | null
          tipo: string
        }
        Update: {
          comentario?: string | null
          created_at?: string
          event_id?: string | null
          id?: string
          nota?: number
          reviewed_id?: string | null
          reviewer_id?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      subscribers: {
        Row: {
          created_at: string
          email: string
          id: string
          stripe_customer_id: string | null
          subscribed: boolean
          subscription_end: string | null
          subscription_tier: string | null
          updated_at: string
          user_id: string | null
          user_type: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
          user_type: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          stripe_customer_id?: string | null
          subscribed?: boolean
          subscription_end?: string | null
          subscription_tier?: string | null
          updated_at?: string
          user_id?: string | null
          user_type?: string
        }
        Relationships: []
      }
      subscription_limits: {
        Row: {
          applications_made: number | null
          created_at: string
          events_created: number | null
          id: string
          monthly_limit_applications: number | null
          monthly_limit_events: number | null
          reset_date: string | null
          subscription_tier: string
          updated_at: string
          user_id: string | null
          user_type: string
        }
        Insert: {
          applications_made?: number | null
          created_at?: string
          events_created?: number | null
          id?: string
          monthly_limit_applications?: number | null
          monthly_limit_events?: number | null
          reset_date?: string | null
          subscription_tier?: string
          updated_at?: string
          user_id?: string | null
          user_type: string
        }
        Update: {
          applications_made?: number | null
          created_at?: string
          events_created?: number | null
          id?: string
          monthly_limit_applications?: number | null
          monthly_limit_events?: number | null
          reset_date?: string | null
          subscription_tier?: string
          updated_at?: string
          user_id?: string | null
          user_type?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          courses: string[] | null
          created_at: string
          description: string | null
          id: string
          name: string | null
          other_knowledge: string | null
          phone: string | null
          rating: number | null
          skills: string[] | null
          total_reviews: number | null
          updated_at: string
          user_type: string
          verificado: boolean | null
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          courses?: string[] | null
          created_at?: string
          description?: string | null
          id: string
          name?: string | null
          other_knowledge?: string | null
          phone?: string | null
          rating?: number | null
          skills?: string[] | null
          total_reviews?: number | null
          updated_at?: string
          user_type: string
          verificado?: boolean | null
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          courses?: string[] | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string | null
          other_knowledge?: string | null
          phone?: string | null
          rating?: number | null
          skills?: string[] | null
          total_reviews?: number | null
          updated_at?: string
          user_type?: string
          verificado?: boolean | null
        }
        Relationships: []
      }
      verifications: {
        Row: {
          admin_id: string | null
          created_at: string
          data_verificacao: string | null
          foto_documento_url: string | null
          id: string
          motivo_rejeicao: string | null
          numero_documento: string
          selfie_url: string | null
          status: string
          tipo_documento: string
          updated_at: string
          user_id: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string
          data_verificacao?: string | null
          foto_documento_url?: string | null
          id?: string
          motivo_rejeicao?: string | null
          numero_documento: string
          selfie_url?: string | null
          status?: string
          tipo_documento: string
          updated_at?: string
          user_id: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string
          data_verificacao?: string | null
          foto_documento_url?: string | null
          id?: string
          motivo_rejeicao?: string | null
          numero_documento?: string
          selfie_url?: string | null
          status?: string
          tipo_documento?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
