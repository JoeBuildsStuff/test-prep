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
    PostgrestVersion: "12.2.1 (d3f7cba)"
  }
  test_prep: {
    Tables: {
      question_tags: {
        Row: {
          created_at: string | null
          question_id: string
          tag_id: number
        }
        Insert: {
          created_at?: string | null
          question_id: string
          tag_id: number
        }
        Update: {
          created_at?: string | null
          question_id?: string
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "question_tags_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "question_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          correctanswer: string | null
          created_at: string | null
          explanation: string | null
          id: string
          markdown_explanation: string | null
          options: Json | null
          question: string | null
          section_id: number | null
          subsection_id: number | null
          title_long: string | null
          title_short: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          correctanswer?: string | null
          created_at?: string | null
          explanation?: string | null
          id: string
          markdown_explanation?: string | null
          options?: Json | null
          question?: string | null
          section_id?: number | null
          subsection_id?: number | null
          title_long?: string | null
          title_short?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          correctanswer?: string | null
          created_at?: string | null
          explanation?: string | null
          id?: string
          markdown_explanation?: string | null
          options?: Json | null
          question?: string | null
          section_id?: number | null
          subsection_id?: number | null
          title_long?: string | null
          title_short?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_subsection_id_fkey"
            columns: ["subsection_id"]
            isOneToOne: false
            referencedRelation: "subsections"
            referencedColumns: ["id"]
          },
        ]
      }
      sections: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id: number
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      subsections: {
        Row: {
          count: string | null
          created_at: string | null
          description: string | null
          id: number
          name: string | null
          section_id: number | null
          updated_at: string | null
        }
        Insert: {
          count?: string | null
          created_at?: string | null
          description?: string | null
          id: number
          name?: string | null
          section_id?: number | null
          updated_at?: string | null
        }
        Update: {
          count?: string | null
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string | null
          section_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "subsections_section_id_fkey"
            columns: ["section_id"]
            isOneToOne: false
            referencedRelation: "sections"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          count: string | null
          created_at: string | null
          id: number
          name: string | null
          type: string | null
          updated_at: string | null
        }
        Insert: {
          count?: string | null
          created_at?: string | null
          id: number
          name?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          count?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      test_questions: {
        Row: {
          created_at: string | null
          id: string
          order: number | null
          question_id: string | null
          test_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          order?: number | null
          question_id?: string | null
          test_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order?: number | null
          question_id?: string | null
          test_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "test_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "test_questions_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      tests: {
        Row: {
          attempt_num: number | null
          completed_at: string | null
          created_at: string | null
          id: string
          score: number | null
          user_id: string
        }
        Insert: {
          attempt_num?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          score?: number | null
          user_id: string
        }
        Update: {
          attempt_num?: number | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          score?: number | null
          user_id?: string
        }
        Relationships: []
      }
      user_favorites: {
        Row: {
          created_at: string | null
          id: string
          question_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          question_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          question_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_favorites_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      user_responses: {
        Row: {
          attempt_number: number | null
          created_at: string | null
          id: string
          is_correct: boolean | null
          question_id: string | null
          selected_answers: Json | null
          test_id: string | null
          user_id: string | null
        }
        Insert: {
          attempt_number?: number | null
          created_at?: string | null
          id: string
          is_correct?: boolean | null
          question_id?: string | null
          selected_answers?: Json | null
          test_id?: string | null
          user_id?: string | null
        }
        Update: {
          attempt_number?: number | null
          created_at?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string | null
          selected_answers?: Json | null
          test_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_responses_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_responses_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
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
  test_prep: {
    Enums: {},
  },
} as const