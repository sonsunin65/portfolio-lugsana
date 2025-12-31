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
          full_name: string
          position: string | null
          bio: string | null
          teaching_philosophy: string | null
          image_url: string | null
          stats_years: string | null
          stats_students: string | null
          stats_awards: string | null
          email: string | null
          phone: string | null
          address: string | null
          facebook: string | null
          line_id: string | null
          about_short_description: string | null
          about_section_body: string | null
          works_description: string | null
          certificates_description: string | null
          activities_description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          position?: string | null
          bio?: string | null
          teaching_philosophy?: string | null
          image_url?: string | null
          stats_years?: string | null
          stats_students?: string | null
          stats_awards?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          facebook?: string | null
          line_id?: string | null
          welcome_message_1?: string | null
          welcome_message_2?: string | null
          hero_badge_text?: string | null
          about_short_description?: string | null
          about_section_body?: string | null
          works_description?: string | null
          certificates_description?: string | null
          activities_description?: string | null
          pa_description?: string | null
          pa_header_title?: string | null
          pa_header_subtitle?: string | null
          pa_badge_text?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          position?: string | null
          bio?: string | null
          teaching_philosophy?: string | null
          image_url?: string | null
          stats_years?: string | null
          stats_students?: string | null
          stats_awards?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          facebook?: string | null
          line_id?: string | null
          welcome_message_1?: string | null
          welcome_message_2?: string | null
          hero_badge_text?: string | null
          about_short_description?: string | null
          about_section_body?: string | null
          works_description?: string | null
          certificates_description?: string | null
          activities_description?: string | null
          created_at?: string
        }
      },
      stats: {
        Row: {
          id: string
          title: string
          label: string
          icon_name: string
          color_class: string
          display_order: number | null
          created_at: string
        },
        Insert: {
          id?: string
          title: string
          label: string
          icon_name: string
          color_class: string
          display_order?: number | null
          created_at?: string
        },
        Update: {
          id?: string
          title?: string
          label?: string
          icon_name?: string
          color_class?: string
          display_order?: number | null
          created_at?: string
        }
      },
      highlights: {
        Row: {
          id: string
          title: string
          description: string
          icon_name: string
          color_class: string
          bg_class: string
          display_order: number | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          icon_name: string
          color_class: string
          bg_class: string
          display_order?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          icon_name?: string
          color_class?: string
          bg_class?: string
          display_order?: number | null
          created_at?: string
        }
      }
      works: {
        Row: {
          id: string
          title: string
          category: string
          description: string
          icon_name: string
          color_class: string
          views: number
          is_featured: boolean
          display_order: number | null
          file_url: string | null
          file_type: string | null
          external_links: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          category: string
          description: string
          icon_name: string
          color_class: string
          views?: number
          is_featured?: boolean
          display_order?: number | null
          file_url?: string | null
          file_type?: string | null
          external_links?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          category?: string
          description?: string
          icon_name?: string
          color_class?: string
          views?: number
          is_featured?: boolean
          display_order?: number | null
          file_url?: string | null
          file_type?: string | null
          external_links?: Json | null
          created_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          title: string
          date_display: string
          location: string
          participants: number | null
          description: string
          image_emoji: string | null
          color_gradient_class: string | null
          display_order: number | null
          file_url: string | null
          file_type: string | null
          external_links: Json | null
          images: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          date_display: string
          location: string
          participants?: number | null
          description: string
          image_emoji?: string | null
          color_gradient_class?: string | null
          display_order?: number | null
          file_url?: string | null
          file_type?: string | null
          external_links?: Json | null
          images?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          date_display?: string
          location?: string
          participants?: number | null
          description?: string
          image_emoji?: string | null
          color_gradient_class?: string | null
          display_order?: number | null
          file_url?: string | null
          file_type?: string | null
          external_links?: Json | null
          images?: Json | null
          created_at?: string
        }
      }
      certificates: {
        Row: {
          id: string
          title: string
          issuer: string
          year: string
          type: string
          icon_name: string
          color_class: string
          bg_class: string
          display_order: number | null
          file_url: string | null
          file_type: string | null
          external_links: Json | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          issuer: string
          year: string
          type: string
          icon_name: string
          color_class: string
          bg_class: string
          display_order?: number | null
          file_url?: string | null
          file_type?: string | null
          external_links?: Json | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          issuer?: string
          year?: string
          type?: string
          icon_name?: string
          color_class?: string
          bg_class?: string
          display_order?: number | null
          file_url?: string | null
          file_type?: string | null
          external_links?: Json | null
          created_at?: string
        }
      }
      pa_categories: {
        Row: {
          id: string
          category_number: number
          title: string
          icon: string
          color: string
          created_at: string
        }
        Insert: {
          id?: string
          category_number: number
          title: string
          icon: string
          color: string
          created_at?: string
        }
        Update: {
          id?: string
          category_number?: number
          title?: string
          icon?: string
          color?: string
          created_at?: string
        }
      }
      pa_indicators: {
        Row: {
          id: string
          category_id: string
          indicator_number: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          category_id: string
          indicator_number: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          category_id?: string
          indicator_number?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      pa_works: {
        Row: {
          id: string
          indicator_id: string
          work_type: string
          title: string
          url: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          indicator_id: string
          work_type: string
          title: string
          url?: string | null
          sort_order: number
          created_at?: string
        }
        Update: {
          id?: string
          indicator_id?: string
          work_type?: string
          title?: string
          url?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      pa_indicator_images: {
        Row: {
          id: string
          indicator_id: string
          image_url: string
          caption: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          indicator_id: string
          image_url: string
          caption?: string | null
          sort_order: number
          created_at?: string
        }
        Update: {
          id?: string
          indicator_id?: string
          image_url?: string
          caption?: string | null
          sort_order?: number
          created_at?: string
        }
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
