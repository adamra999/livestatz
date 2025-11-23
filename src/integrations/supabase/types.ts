export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      collaborations: {
        Row: {
          created_at: string
          deal_value: number | null
          description: string | null
          end_date: string | null
          id: string
          partner_email: string | null
          partner_name: string
          partnership_type: string
          start_date: string | null
          status: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          deal_value?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          partner_email?: string | null
          partner_name: string
          partnership_type: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          deal_value?: number | null
          description?: string | null
          end_date?: string | null
          id?: string
          partner_email?: string | null
          partner_name?: string
          partnership_type?: string
          start_date?: string | null
          status?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      Events: {
        Row: {
          acceptTips: boolean | null
          accessDescription: string | null
          attendeeBenefits: Json | null
          calendarOption: Database["public"]["Enums"]["calendar_option"] | null
          coverImage: string | null
          createdAt: string
          dateTime: string
          description: string | null
          duration: string | null
          hasMaxAttendees: boolean | null
          id: string
          includePerks: boolean | null
          includeReplay: boolean | null
          influencerId: string | null
          inviteEmails: Json | null
          isPaid: boolean | null
          isPublic: boolean | null
          link: string
          maxAttendees: number | null
          offerWithSubscription: boolean | null
          paymentHandle: string | null
          paymentMethod: string | null
          perkDescription: string | null
          platform: string
          price: string | null
          reminder1h: boolean | null
          reminder24h: boolean | null
          reminderLive: boolean | null
          requireEmail: boolean | null
          selectedFanGroups: Json | null
          selectedPlatforms: Json | null
          tags: Json | null
          targetAudience: number | null
          title: string
          updatedAt: string
          url: string
          visibility: Database["public"]["Enums"]["event_visibility"] | null
        }
        Insert: {
          acceptTips?: boolean | null
          accessDescription?: string | null
          attendeeBenefits?: Json | null
          calendarOption?: Database["public"]["Enums"]["calendar_option"] | null
          coverImage?: string | null
          createdAt: string
          dateTime: string
          description?: string | null
          duration?: string | null
          hasMaxAttendees?: boolean | null
          id: string
          includePerks?: boolean | null
          includeReplay?: boolean | null
          influencerId?: string | null
          inviteEmails?: Json | null
          isPaid?: boolean | null
          isPublic?: boolean | null
          link: string
          maxAttendees?: number | null
          offerWithSubscription?: boolean | null
          paymentHandle?: string | null
          paymentMethod?: string | null
          perkDescription?: string | null
          platform: string
          price?: string | null
          reminder1h?: boolean | null
          reminder24h?: boolean | null
          reminderLive?: boolean | null
          requireEmail?: boolean | null
          selectedFanGroups?: Json | null
          selectedPlatforms?: Json | null
          tags?: Json | null
          targetAudience?: number | null
          title: string
          updatedAt: string
          url: string
          visibility?: Database["public"]["Enums"]["event_visibility"] | null
        }
        Update: {
          acceptTips?: boolean | null
          accessDescription?: string | null
          attendeeBenefits?: Json | null
          calendarOption?: Database["public"]["Enums"]["calendar_option"] | null
          coverImage?: string | null
          createdAt?: string
          dateTime?: string
          description?: string | null
          duration?: string | null
          hasMaxAttendees?: boolean | null
          id?: string
          includePerks?: boolean | null
          includeReplay?: boolean | null
          influencerId?: string | null
          inviteEmails?: Json | null
          isPaid?: boolean | null
          isPublic?: boolean | null
          link?: string
          maxAttendees?: number | null
          offerWithSubscription?: boolean | null
          paymentHandle?: string | null
          paymentMethod?: string | null
          perkDescription?: string | null
          platform?: string
          price?: string | null
          reminder1h?: boolean | null
          reminder24h?: boolean | null
          reminderLive?: boolean | null
          requireEmail?: boolean | null
          selectedFanGroups?: Json | null
          selectedPlatforms?: Json | null
          tags?: Json | null
          targetAudience?: number | null
          title?: string
          updatedAt?: string
          url?: string
          visibility?: Database["public"]["Enums"]["event_visibility"] | null
        }
        Relationships: [
          {
            foreignKeyName: "events_influencerid_fkey"
            columns: ["influencerId"]
            isOneToOne: false
            referencedRelation: "Influencers"
            referencedColumns: ["id"]
          },
        ]
      }
      fan_comments: {
        Row: {
          commented_at: string | null
          content: string
          created_at: string
          fan_id: string
          id: string
          platform: string | null
          sentiment: string | null
        }
        Insert: {
          commented_at?: string | null
          content: string
          created_at?: string
          fan_id: string
          id?: string
          platform?: string | null
          sentiment?: string | null
        }
        Update: {
          commented_at?: string | null
          content?: string
          created_at?: string
          fan_id?: string
          id?: string
          platform?: string | null
          sentiment?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fan_comments_fan_id_fkey"
            columns: ["fan_id"]
            isOneToOne: false
            referencedRelation: "fans"
            referencedColumns: ["id"]
          },
        ]
      }
      fan_events: {
        Row: {
          attendance_status: string | null
          attended_at: string | null
          created_at: string
          event_id: string
          event_name: string
          fan_id: string
          id: string
          ticket_price: number | null
        }
        Insert: {
          attendance_status?: string | null
          attended_at?: string | null
          created_at?: string
          event_id: string
          event_name: string
          fan_id: string
          id?: string
          ticket_price?: number | null
        }
        Update: {
          attendance_status?: string | null
          attended_at?: string | null
          created_at?: string
          event_id?: string
          event_name?: string
          fan_id?: string
          id?: string
          ticket_price?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fan_events_fan_id_fkey"
            columns: ["fan_id"]
            isOneToOne: false
            referencedRelation: "fans"
            referencedColumns: ["id"]
          },
        ]
      }
      fan_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          fan_id: string
          id: string
          transaction_date: string | null
          transaction_type: string
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          fan_id: string
          id?: string
          transaction_date?: string | null
          transaction_type: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          fan_id?: string
          id?: string
          transaction_date?: string | null
          transaction_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "fan_transactions_fan_id_fkey"
            columns: ["fan_id"]
            isOneToOne: false
            referencedRelation: "fans"
            referencedColumns: ["id"]
          },
        ]
      }
      fans: {
        Row: {
          avatar_url: string | null
          comments_count: number | null
          created_at: string
          email: string
          events_attended: number | null
          first_interaction_date: string | null
          id: string
          last_interaction_date: string | null
          location: string | null
          name: string
          phone: string | null
          segment: string | null
          total_spent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          comments_count?: number | null
          created_at?: string
          email: string
          events_attended?: number | null
          first_interaction_date?: string | null
          id?: string
          last_interaction_date?: string | null
          location?: string | null
          name: string
          phone?: string | null
          segment?: string | null
          total_spent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          comments_count?: number | null
          created_at?: string
          email?: string
          events_attended?: number | null
          first_interaction_date?: string | null
          id?: string
          last_interaction_date?: string | null
          location?: string | null
          name?: string
          phone?: string | null
          segment?: string | null
          total_spent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      Influencers: {
        Row: {
          createdAt: string
          email: string
          id: string
          name: string
          updatedAt: string
        }
        Insert: {
          createdAt: string
          email: string
          id: string
          name: string
          updatedAt: string
        }
        Update: {
          createdAt?: string
          email?: string
          id?: string
          name?: string
          updatedAt?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          createdAt: string
          eventId: string
          id: string
          payload: Json | null
          sentAt: string | null
          type: string | null
          updatedAt: string
        }
        Insert: {
          createdAt: string
          eventId: string
          id: string
          payload?: Json | null
          sentAt?: string | null
          type?: string | null
          updatedAt: string
        }
        Update: {
          createdAt?: string
          eventId?: string
          id?: string
          payload?: Json | null
          sentAt?: string | null
          type?: string | null
          updatedAt?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_eventId_fkey"
            columns: ["eventId"]
            isOneToOne: false
            referencedRelation: "Events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          metadata: Json | null
          phone: string | null
          role: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          metadata?: Json | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          metadata?: Json | null
          phone?: string | null
          role?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      rsvps: {
        Row: {
          added_to_calendar: boolean | null
          created_at: string
          event_id: string
          fan_id: string
          id: string
          reminder_sent_10: boolean | null
          reminder_sent_30: boolean | null
          status: string
          updated_at: string
        }
        Insert: {
          added_to_calendar?: boolean | null
          created_at?: string
          event_id: string
          fan_id: string
          id?: string
          reminder_sent_10?: boolean | null
          reminder_sent_30?: boolean | null
          status?: string
          updated_at?: string
        }
        Update: {
          added_to_calendar?: boolean | null
          created_at?: string
          event_id?: string
          fan_id?: string
          id?: string
          reminder_sent_10?: boolean | null
          reminder_sent_30?: boolean | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rsvps_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "Events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rsvps_fan_id_fkey"
            columns: ["fan_id"]
            isOneToOne: false
            referencedRelation: "fans"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar: string | null
          createdAt: string
          email: string
          id: string
          name: string | null
          passwordHash: string | null
          phone: string | null
          role: Database["public"]["Enums"]["enum_users_role"] | null
          socialId: string | null
          updatedAt: string
        }
        Insert: {
          avatar?: string | null
          createdAt: string
          email: string
          id: string
          name?: string | null
          passwordHash?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["enum_users_role"] | null
          socialId?: string | null
          updatedAt: string
        }
        Update: {
          avatar?: string | null
          createdAt?: string
          email?: string
          id?: string
          name?: string | null
          passwordHash?: string | null
          phone?: string | null
          role?: Database["public"]["Enums"]["enum_users_role"] | null
          socialId?: string | null
          updatedAt?: string
        }
        Relationships: []
      }
      workflow_actions: {
        Row: {
          action_data: Json | null
          action_type: string
          created_at: string
          delay_hours: number | null
          id: string
          order_index: number
          workflow_id: string
        }
        Insert: {
          action_data?: Json | null
          action_type: string
          created_at?: string
          delay_hours?: number | null
          id?: string
          order_index: number
          workflow_id: string
        }
        Update: {
          action_data?: Json | null
          action_type?: string
          created_at?: string
          delay_hours?: number | null
          id?: string
          order_index?: number
          workflow_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflow_actions_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          target_segment: string | null
          trigger_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          target_segment?: string | null
          trigger_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          target_segment?: string | null
          trigger_type?: string
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
      is_event_owner: { Args: { event_uuid: string }; Returns: boolean }
    }
    Enums: {
      calendar_option: "auto" | "ask" | "none"
      enum_users_role: "fan" | "influencer" | "admin"
      event_visibility: "public" | "followers" | "private"
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
    Enums: {
      calendar_option: ["auto", "ask", "none"],
      enum_users_role: ["fan", "influencer", "admin"],
      event_visibility: ["public", "followers", "private"],
    },
  },
} as const
