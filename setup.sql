-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Tables

-- Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    position TEXT,
    bio TEXT,
    about_short_description TEXT,
    about_section_body TEXT,
    teaching_philosophy TEXT,
    image_url TEXT,
    stats_years TEXT,
    stats_students TEXT,
    stats_awards TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    facebook TEXT,
    facebook_url TEXT,
    line_id TEXT,
    line_url TEXT,
    welcome_message_1 TEXT DEFAULT 'ยินดีต้อนรับสู่ Portfolio ของครู',
    welcome_message_2 TEXT DEFAULT 'สวัสดีครับ ผม',
    hero_badge_text TEXT DEFAULT 'ครูดีเด่น',
    works_description TEXT,
    certificates_description TEXT,
    activities_description TEXT,
    pa_description TEXT,
    pa_header_title TEXT,
    pa_header_subtitle TEXT,
    pa_badge_text TEXT,
    footer_text TEXT,
    google_map_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Stats Table
CREATE TABLE IF NOT EXISTS public.stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    label TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color_class TEXT NOT NULL,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Highlights Table
CREATE TABLE IF NOT EXISTS public.highlights (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color_class TEXT NOT NULL,
    bg_class TEXT NOT NULL,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Works Table
CREATE TABLE IF NOT EXISTS public.works (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color_class TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER,
    file_url TEXT,
    file_type TEXT,
    external_links JSONB DEFAULT '[]'::jsonb,
    images TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Activities Table
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    date_display TEXT NOT NULL,
    location TEXT NOT NULL,
    participants INTEGER,
    description TEXT NOT NULL,
    image_emoji TEXT,
    color_gradient_class TEXT,
    display_order INTEGER,
    file_url TEXT,
    file_type TEXT,
    external_links JSONB DEFAULT '[]'::jsonb,
    images TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Certificates Table
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    year TEXT NOT NULL,
    type TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color_class TEXT NOT NULL,
    bg_class TEXT NOT NULL,
    display_order INTEGER,
    file_url TEXT,
    file_type TEXT,
    external_links JSONB DEFAULT '[]'::jsonb,
    images TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PA Categories Table
CREATE TABLE IF NOT EXISTS public.pa_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PA Indicators Table
CREATE TABLE IF NOT EXISTS public.pa_indicators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES public.pa_categories(id) ON DELETE CASCADE,
    indicator_number TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PA Works Table
CREATE TABLE IF NOT EXISTS public.pa_works (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    indicator_id UUID REFERENCES public.pa_indicators(id) ON DELETE CASCADE,
    work_type TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PA Indicator Images Table
CREATE TABLE IF NOT EXISTS public.pa_indicator_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    indicator_id UUID REFERENCES public.pa_indicators(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Row Level Security (RLS)

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE works ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE pa_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE pa_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE pa_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE pa_indicator_images ENABLE ROW LEVEL SECURITY;

-- Public Access Policies (Everyone can read)
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public stats are viewable by everyone" ON stats FOR SELECT USING (true);
CREATE POLICY "Public highlights are viewable by everyone" ON highlights FOR SELECT USING (true);
CREATE POLICY "Public works are viewable by everyone" ON works FOR SELECT USING (true);
CREATE POLICY "Public activities are viewable by everyone" ON activities FOR SELECT USING (true);
CREATE POLICY "Public certificates are viewable by everyone" ON certificates FOR SELECT USING (true);
CREATE POLICY "Public pa_categories are viewable by everyone" ON pa_categories FOR SELECT USING (true);
CREATE POLICY "Public pa_indicators are viewable by everyone" ON pa_indicators FOR SELECT USING (true);
CREATE POLICY "Public pa_works are viewable by everyone" ON pa_works FOR SELECT USING (true);
CREATE POLICY "Public pa_indicator_images are viewable by everyone" ON pa_indicator_images FOR SELECT USING (true);

-- Authenticated Access Policies (Only logged in users can modify)
CREATE POLICY "Users can insert profiles" ON profiles FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update profiles" ON profiles FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can delete profiles" ON profiles FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can modify stats" ON stats FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can modify highlights" ON highlights FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can modify works" ON works FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can modify activities" ON activities FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can modify certificates" ON certificates FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can modify pa_categories" ON pa_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can modify pa_indicators" ON pa_indicators FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can modify pa_works" ON pa_works FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Users can modify pa_indicator_images" ON pa_indicator_images FOR ALL USING (auth.role() = 'authenticated');

-- 3. Storage Buckets

-- Helper function to creating buckets safely
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('profile', 'profile', true),
  ('works', 'works', true),
  ('activities', 'activities', true),
  ('certificates', 'certificates', true),
  ('pa-images', 'pa-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies (Public Read, Authenticated Write)
CREATE POLICY "Public Access Profile" ON storage.objects FOR SELECT USING (bucket_id = 'profile');
CREATE POLICY "Auth Upload Profile" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Profile" ON storage.objects FOR DELETE USING (bucket_id = 'profile' AND auth.role() = 'authenticated');

CREATE POLICY "Public Access Works" ON storage.objects FOR SELECT USING (bucket_id = 'works');
CREATE POLICY "Auth Upload Works" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'works' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Works" ON storage.objects FOR DELETE USING (bucket_id = 'works' AND auth.role() = 'authenticated');

CREATE POLICY "Public Access Activities" ON storage.objects FOR SELECT USING (bucket_id = 'activities');
CREATE POLICY "Auth Upload Activities" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'activities' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Activities" ON storage.objects FOR DELETE USING (bucket_id = 'activities' AND auth.role() = 'authenticated');

CREATE POLICY "Public Access Certificates" ON storage.objects FOR SELECT USING (bucket_id = 'certificates');
CREATE POLICY "Auth Upload Certificates" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certificates' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete Certificates" ON storage.objects FOR DELETE USING (bucket_id = 'certificates' AND auth.role() = 'authenticated');

CREATE POLICY "Public Access PA" ON storage.objects FOR SELECT USING (bucket_id = 'pa-images');
CREATE POLICY "Auth Upload PA" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'pa-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete PA" ON storage.objects FOR DELETE USING (bucket_id = 'pa-images' AND auth.role() = 'authenticated');

-- 4. Initial Trigger for Profile Creation (Optional but recommended)
-- Unlike standard Supabase auth triggers, your app logic seems to manually insert/update profiles or relies on the first user.
-- We will leave it flexible but you might want to auto-create a profile row for new users if you switch to multi-user later.
-- For now, the AdminProfile component handles upsert.
