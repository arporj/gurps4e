export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          display_name: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      characters: {
        Row: {
          id: string
          owner_id: string
          name: string
          gcs_data: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name?: string
          gcs_data?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          gcs_data?: Json
          created_at?: string
          updated_at?: string
        }
      }
      groups: {
        Row: {
          id: string
          name: string
          description: string | null
          created_by: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_by: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_by?: string
          created_at?: string
        }
      }
      group_members: {
        Row: {
          id: string
          group_id: string
          user_id: string
          role: 'gm' | 'player'
          status: 'invited' | 'active'
          invited_by: string | null
          joined_at: string | null
        }
        Insert: {
          id?: string
          group_id: string
          user_id: string
          role?: 'gm' | 'player'
          status?: 'invited' | 'active'
          invited_by?: string | null
          joined_at?: string | null
        }
        Update: {
          id?: string
          group_id?: string
          user_id?: string
          role?: 'gm' | 'player'
          status?: 'invited' | 'active'
          invited_by?: string | null
          joined_at?: string | null
        }
      }
      group_invites: {
        Row: {
          id: string
          group_id: string
          invited_email: string
          invited_by: string
          token: string
          status: 'pending' | 'accepted' | 'expired'
          created_at: string
        }
        Insert: {
          id?: string
          group_id: string
          invited_email: string
          invited_by: string
          token?: string
          status?: 'pending' | 'accepted' | 'expired'
          created_at?: string
        }
        Update: {
          id?: string
          group_id?: string
          invited_email?: string
          invited_by?: string
          token?: string
          status?: 'pending' | 'accepted' | 'expired'
          created_at?: string
        }
      }
      group_characters: {
        Row: {
          id: string
          group_id: string
          character_id: string
          owner_id: string
          working_data: Json | null
          status: 'pending' | 'accepted' | 'rejected'
          rejection_reason: string | null
          submitted_at: string
          reviewed_at: string | null
          reviewed_by: string | null
        }
        Insert: {
          id?: string
          group_id: string
          character_id: string
          owner_id: string
          working_data?: Json | null
          status?: 'pending' | 'accepted' | 'rejected'
          rejection_reason?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
        Update: {
          id?: string
          group_id?: string
          character_id?: string
          owner_id?: string
          working_data?: Json | null
          status?: 'pending' | 'accepted' | 'rejected'
          rejection_reason?: string | null
          submitted_at?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
        }
      }
      character_edits: {
        Row: {
          id: string
          group_character_id: string
          editor_id: string
          editor_role: 'gm' | 'player'
          previous_data: Json
          new_data: Json
          reversion_proposed: boolean
          reversion_status: 'pending' | 'approved' | 'rejected' | null
          created_at: string
        }
        Insert: {
          id?: string
          group_character_id: string
          editor_id: string
          editor_role: 'gm' | 'player'
          previous_data: Json
          new_data: Json
          reversion_proposed?: boolean
          reversion_status?: 'pending' | 'approved' | 'rejected' | null
          created_at?: string
        }
        Update: {
          id?: string
          group_character_id?: string
          editor_id?: string
          editor_role?: 'gm' | 'player'
          previous_data?: Json
          new_data?: Json
          reversion_proposed?: boolean
          reversion_status?: 'pending' | 'approved' | 'rejected' | null
          created_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}
