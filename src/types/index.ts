import { Database } from "@/integrations/supabase/types";

// Extending the Row type because the generated types seem to be missing some columns in Row but present in Insert
export type Profile = Database["public"]["Tables"]["profiles"]["Row"] & {
    welcome_message_1?: string | null;
    welcome_message_2?: string | null;
    hero_badge_text?: string | null;
    about_short_description?: string | null;
    about_section_body?: string | null;
    works_description?: string | null;
    certificates_description?: string | null;
    activities_description?: string | null;
    pa_description?: string | null;
    pa_header_title?: string | null;
    pa_header_subtitle?: string | null;
    pa_badge_text?: string | null;
    facebook_url?: string | null;
    line_url?: string | null;
    google_map_url?: string | null;
    footer_text?: string | null;
    contact_description?: string | null;
};
export type Work = Database["public"]["Tables"]["works"]["Row"];
export type Stat = Database["public"]["Tables"]["stats"]["Row"];
export type Certificate = Database["public"]["Tables"]["certificates"]["Row"];
export type Activity = Database["public"]["Tables"]["activities"]["Row"];
export type Highlight = Database["public"]["Tables"]["highlights"]["Row"];
export type PACategory = Database["public"]["Tables"]["pa_categories"]["Row"];
export type PAIndicator = Database["public"]["Tables"]["pa_indicators"]["Row"];
export type PAWork = Database["public"]["Tables"]["pa_works"]["Row"];
export type PAImage = Database["public"]["Tables"]["pa_indicator_images"]["Row"];
export type Message = {
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: string;
    is_read?: boolean;
};
