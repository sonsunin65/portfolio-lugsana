-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Tables
-- Users/Profiles should be created by the application/auth flow, but we define the table here.
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
    footer_text TEXT,
    contact_description TEXT DEFAULT 'มีคำถามหรืออยากพูดคุย? ติดต่อครูได้เลยครับ ยินดีให้คำปรึกษาและตอบคำถามทุกข้อ',
    google_map_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.stats (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    label TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color_class TEXT NOT NULL,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

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

CREATE TABLE IF NOT EXISTS public.pa_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pa_indicators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES public.pa_categories(id) ON DELETE CASCADE,
    indicator_number TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pa_works (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    indicator_id UUID REFERENCES public.pa_indicators(id) ON DELETE CASCADE,
    work_type TEXT NOT NULL,
    title TEXT NOT NULL,
    url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.pa_indicator_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    indicator_id UUID REFERENCES public.pa_indicators(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Add Unique Constraints safely (for idempotent seed data)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'pa_categories_number_key') THEN 
        ALTER TABLE pa_categories ADD CONSTRAINT pa_categories_number_key UNIQUE (category_number); 
    END IF; 
    -- We don't force unique on indicators because numbers might repeat across categories if schema changes, 
    -- but for seed data we will assume unique combination or just handle by number check in INSERT.
END $$;

-- 3. Row Level Security (RLS)

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

-- 4. Storage Buckets

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

-- 5. SEED DATA (Standard Data Population)

-- 5.1 PA Categories (Standard 3 Domains)
INSERT INTO public.pa_categories (category_number, title, icon, color)
VALUES
  (1, 'ด้านการจัดการเรียนรู้', 'BookOpen', 'from-pink-500 to-rose-400'),
  (2, 'ด้านการส่งเสริมและสนับสนุนการจัดการเรียนรู้', 'Users', 'from-emerald-400 to-teal-400'),
  (3, 'ด้านการพัฒนาตนเองและวิชาชีพ', 'TrendingUp', 'from-orange-400 to-amber-400')
ON CONFLICT (category_number) DO UPDATE SET
  title = EXCLUDED.title,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color;

-- 5.2 PA Indicators (Standard 15 Indicators for ว9/2564)
-- We use a CTE or variables, but for plain SQL we can use subqueries.

-- Category 1: Learning Management
INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '1.1', 'สร้างและหรือพัฒนาหลักสูตร', 'การจัดทำรายวิชาและหน่วยการเรียนรู้ให้สอดคล้องกับมาตรฐานการเรียนรู้ และตัวชี้วัดหรือผลการเรียนรู้ ตามหลักสูตร'
FROM public.pa_categories WHERE category_number = 1
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '1.1');

INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '1.2', 'ออกแบบการจัดการเรียนรู้', 'เน้นผู้เรียนเป็นสำคัญ เพื่อให้ผู้เรียนมีความรู้ ทักษะ คุณลักษณะประจำวิชา คุณลักษณะอันพึงประสงค์ และสมรรถนะที่สำคัญ'
FROM public.pa_categories WHERE category_number = 1
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '1.2');

INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '1.3', 'จัดกิจกรรมการเรียนรู้', 'อำนวยความสะดวกในการเรียนรู้ และส่งเสริมผู้เรียนได้พัฒนาเต็มตามศักยภาพ เรียนรู้และทำงานร่วมกัน'
FROM public.pa_categories WHERE category_number = 1
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '1.3');

INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '1.4', 'สร้างและหรือพัฒนาสื่อ นวัตกรรม เทคโนโลยี และแหล่งเรียนรู้', 'สอดคล้องกับกิจกรรมการเรียนรู้'
FROM public.pa_categories WHERE category_number = 1
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '1.4');

INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '1.5', 'วัดและประเมินผลการเรียนรู้', 'ประเมินผลการเรียนรู้ด้วยวิธีการที่หลากหลาย เหมาะสม และสอดคล้องกับมาตรฐานการเรียนรู้'
FROM public.pa_categories WHERE category_number = 1
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '1.5');

INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '1.6', 'ศึกษา วิเคราะห์ และสังเคราะห์ เพื่อแก้ปัญหาหรือพัฒนาการเรียนรู้', 'ทำการศึกษา วิเคราะห์ และสังเคราะห์ เพื่อแก้ปัญหาหรือพัฒนาการเรียนรู้ที่ส่งผลต่อคุณภาพผู้เรียน'
FROM public.pa_categories WHERE category_number = 1
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '1.6');

INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '1.7', 'จัดบรรยากาศที่ส่งเสริมและพัฒนาผู้เรียน', 'จัดบรรยากาศที่เหมาะสม สอดคล้องกับความแตกต่างผู้เรียนเป็นรายบุคคล'
FROM public.pa_categories WHERE category_number = 1
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '1.7');

INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '1.8', 'อบรมและพัฒนาคุณลักษณะที่ดีของผู้เรียน', 'อบรมบ่มนิสัยให้ผู้เรียนมีคุณธรรม จริยธรรม คุณลักษณะอันพึงประสงค์ และค่านิยมความเป็นไทยที่ดีงาม'
FROM public.pa_categories WHERE category_number = 1
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '1.8');

-- Category 2: Learning Support & Support
INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '2.1', 'จัดทำข้อมูลสารสนเทศของผู้เรียนและรายวิชา', 'จัดทำข้อมูลสารสนเทศของผู้เรียนและรายวิชาเพื่อใช้ในการส่งเสริมสนับสนุนการเรียนรู้'
FROM public.pa_categories WHERE category_number = 2
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '2.1');

INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '2.2', 'ดำเนินการตามระบบดูแลช่วยเหลือผู้เรียน', 'ใช้ข้อมูลสารสนเทศเกี่ยวกับผู้เรียนรายบุคคล และประสานความร่วมมือกับผู้มีส่วนเกี่ยวข้องเพื่อพัฒนาและแก้ปัญหาผู้เรียน'
FROM public.pa_categories WHERE category_number = 2
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '2.2');

INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '2.3', 'ปฏิบัติงานวิชาการ และงานอื่น ๆ ของสถานศึกษา', 'ร่วมปฏิบัติงานทางวิชาการ และงานอื่น ๆ ของสถานศึกษาเพื่อยกระดับคุณภาพการจัดการศึกษาของสถานศึกษา'
FROM public.pa_categories WHERE category_number = 2
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '2.3');

INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '2.4', 'ประสานความร่วมมือกับผู้ปกครอง ภาคีเครือข่าย หรือสถานประกอบการ', 'ประสานความร่วมมือกับผู้ปกครอง ภาคีเครือข่าย หรือสถานประกอบการ เพื่อร่วมกันพัฒนาผู้เรียน'
FROM public.pa_categories WHERE category_number = 2
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '2.4');

-- Category 3: Self & Professional Development
INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '3.1', 'พัฒนาตนเองอย่างเป็นระบบและต่อเนื่อง', 'พัฒนาตนเองอย่างเป็นระบบและต่อเนื่อง เพื่อให้มีความรู้ความสามารถ ทักษะ โดยเฉพาะอย่างยิ่งการใช้ภาษาไทยและภาษาอังกฤษเพื่อการสื่อสาร'
FROM public.pa_categories WHERE category_number = 3
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '3.1');

INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '3.2', 'มีส่วนร่วมในการแลกเปลี่ยนเรียนรู้ทางวิชาชีพ', 'มีส่วนร่วมในการแลกเปลี่ยนเรียนรู้ทางวิชาชีพเพื่อพัฒนาการจัดการเรียนรู้'
FROM public.pa_categories WHERE category_number = 3
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '3.2');

INSERT INTO public.pa_indicators (category_id, indicator_number, name, description)
SELECT id, '3.3', 'นำความรู้ความสามารถ ทักษะที่ได้จากการพัฒนาตนเองและวิชาชีพมาใช้', 'นำความรู้ความสามารถ ทักษะที่ได้จากการพัฒนาตนเองและวิชาชีพมาใช้ในการพัฒนาการจัดการเรียนรู้'
FROM public.pa_categories WHERE category_number = 3
AND NOT EXISTS (SELECT 1 FROM public.pa_indicators WHERE indicator_number = '3.3');

-- 5.3 Highlights (Sample Data)
INSERT INTO public.highlights (title, description, icon_name, color_class, bg_class, display_order)
SELECT 'ประสบการณ์ 8 ปี', 'สอนในระดับชั้นมัธยมศึกษา', 'GraduationCap', 'text-blue-600', 'bg-blue-100', 1
WHERE NOT EXISTS (SELECT 1 FROM public.highlights LIMIT 1);

INSERT INTO public.highlights (title, description, icon_name, color_class, bg_class, display_order)
SELECT 'นักเรียน 300+', 'ดูแลนักเรียนที่ปรึกษาและรายวิชา', 'Users', 'text-green-600', 'bg-green-100', 2
WHERE NOT EXISTS (SELECT 1 FROM public.highlights LIMIT 1);

INSERT INTO public.highlights (title, description, icon_name, color_class, bg_class, display_order)
SELECT 'พัฒนาตนเอง 100+ ชม.', 'อบรมและพัฒนาวิชาชีพอย่างต่อเนื่อง', 'BookOpen', 'text-purple-600', 'bg-purple-100', 3
WHERE NOT EXISTS (SELECT 1 FROM public.highlights LIMIT 1);

INSERT INTO public.highlights (title, description, icon_name, color_class, bg_class, display_order)
SELECT 'รางวัลครูดีเด่น', 'ระดับจังหวัด ปี 2567', 'Award', 'text-orange-600', 'bg-orange-100', 4
WHERE NOT EXISTS (SELECT 1 FROM public.highlights LIMIT 1);

-- 5.4 Stats (Sample Data)
INSERT INTO public.stats (title, label, icon_name, color_class, display_order)
SELECT 'ประสบการณ์สอน', '8 ปี', 'Clock', 'text-blue-500', 1
WHERE NOT EXISTS (SELECT 1 FROM public.stats LIMIT 1);

INSERT INTO public.stats (title, label, icon_name, color_class, display_order)
SELECT 'นักเรียนที่ปรึกษา', '40+', 'Users', 'text-green-500', 2
WHERE NOT EXISTS (SELECT 1 FROM public.stats LIMIT 1);

INSERT INTO public.stats (title, label, icon_name, color_class, display_order)
SELECT 'ชั่วโมงอบรม', '200+', 'BookOpen', 'text-purple-500', 3
WHERE NOT EXISTS (SELECT 1 FROM public.stats LIMIT 1);

-- 5.5 Works (Sample Data)
INSERT INTO public.works (title, category, description, icon_name, color_class, is_featured, display_order, file_type)
SELECT 'แผนการจัดการเรียนรู้ Active Learning', 'academic', 'แผนการสอนเน้นผู้เรียนเป็นสำคัญ วิชาภาษาไทย ระดับชั้น ม.1', 'BookOpen', 'bg-blue-100 text-blue-600', true, 1, 'document'
WHERE NOT EXISTS (SELECT 1 FROM public.works LIMIT 1);

INSERT INTO public.works (title, category, description, icon_name, color_class, is_featured, display_order, file_type)
SELECT 'สื่อการสอนออนไลน์ Gen Z', 'technology', 'รวมคลิปวิดีโอประกอบการสอนที่นักเรียนสามารถเรียนรู้ได้ด้วยตนเอง', 'Video', 'bg-red-100 text-red-600', true, 2, 'video'
WHERE NOT EXISTS (SELECT 1 FROM public.works LIMIT 1);

INSERT INTO public.works (title, category, description, icon_name, color_class, is_featured, display_order, file_type)
SELECT 'วิจัยในชั้นเรียนการแก้ปัญหาการอ่าน', 'research', 'การพัฒนาทักษะการอ่านจับใจความด้วยแบบฝึกทักษะ', 'FileText', 'bg-green-100 text-green-600', false, 3, 'document'
WHERE NOT EXISTS (SELECT 1 FROM public.works LIMIT 1);

INSERT INTO public.works (title, category, description, icon_name, color_class, is_featured, display_order, file_type)
SELECT 'รายงานการวิจัยในชั้นเรียน', 'research', 'การศึกษาผลสัมฤทธิ์ทางการเรียนวิชาภาษาไทย โดยใช้แบบฝึกทักษะ', 'FileText', 'bg-emerald-100 text-emerald-600', false, 4, 'document'
WHERE NOT EXISTS (SELECT 1 FROM public.works WHERE title = 'รายงานการวิจัยในชั้นเรียน');

INSERT INTO public.works (title, category, description, icon_name, color_class, is_featured, display_order, file_type)
SELECT 'โครงงานสิ่งประดิษฐ์จากวัสดุเหลือใช้', 'academic', 'ที่ปรึกษาโครงงานวิทยาศาสตร์ระดับเขตพื้นที่การศึกษา', 'Lightbulb', 'bg-yellow-100 text-yellow-600', true, 5, 'document'
WHERE NOT EXISTS (SELECT 1 FROM public.works WHERE title = 'โครงงานสิ่งประดิษฐ์จากวัสดุเหลือใช้');

INSERT INTO public.works (title, category, description, icon_name, color_class, is_featured, display_order, file_type)
SELECT 'บทความวิชาการ การเรียนรู้ยุค 2024', 'academic', 'ตีพิมพ์ในวารสารวิชาการครูไทย ปีที่ 15 ฉบับที่ 2', 'PenTool', 'bg-blue-100 text-blue-600', false, 6, 'link'
WHERE NOT EXISTS (SELECT 1 FROM public.works WHERE title = 'บทความวิชาการ การเรียนรู้ยุค 2024');

INSERT INTO public.works (title, category, description, icon_name, color_class, is_featured, display_order, file_type)
SELECT 'สื่อมัลติมีเดียสอนกาพย์เห่เรือ', 'technology', 'บทเรียนคอมพิวเตอร์ช่วยสอน (CAI) ช่วยสอนวรรณคดี', 'MonitorPlay', 'bg-purple-100 text-purple-600', true, 7, 'video'
WHERE NOT EXISTS (SELECT 1 FROM public.works WHERE title = 'สื่อมัลติมีเดียสอนกาพย์เห่เรือ');

INSERT INTO public.works (title, category, description, icon_name, color_class, is_featured, display_order, file_type)
SELECT 'เอกสารประกอบการสอนภาษาไทย', 'academic', 'เอกสารประกอบการสอน ระดับชั้นมัธยมศึกษาปีที่ 1', 'Book', 'bg-pink-100 text-pink-600', false, 8, 'document'
WHERE NOT EXISTS (SELECT 1 FROM public.works WHERE title = 'เอกสารประกอบการสอนภาษาไทย');


-- 5.6 Activities (Sample Data)
INSERT INTO public.activities (title, date_display, location, participants, description, image_emoji, color_gradient_class, display_order)
SELECT 'กิจกรรมวันไหว้ครู 2567', '16 มิถุนายน 2567', 'หอประชุมโรงเรียน', 500, 'กิจกรรมรำลึกพระคุณบูรพาจารย์และมอบทุนการศึกษา', '🙏', 'from-primary to-coral', 1
WHERE NOT EXISTS (SELECT 1 FROM public.activities LIMIT 1);

INSERT INTO public.activities (title, date_display, location, participants, description, image_emoji, color_gradient_class, display_order)
SELECT 'เข้าค่ายลูกเสือ-เนตรนารี', '20-22 สิงหาคม 2567', 'ค่ายลูกเสือวชิราวุธ', 120, 'กิจกรรมพัฒนาผู้เรียน เข้าค่ายพักแรมลูกเสือสามัญรุ่นใหญ่', '⛺', 'from-secondary to-mint', 2
WHERE NOT EXISTS (SELECT 1 FROM public.activities LIMIT 1);

INSERT INTO public.activities (title, date_display, location, participants, description, image_emoji, color_gradient_class, display_order)
SELECT 'โครงการโรงเรียนสีขาว', 'ตลอดปีการศึกษา', 'โรงเรียน', 800, 'รณรงค์ต่อต้านยาเสพติดและอบายมุขในสถานศึกษา', '🤍', 'from-lavender to-sky', 3
WHERE NOT EXISTS (SELECT 1 FROM public.activities LIMIT 1);

INSERT INTO public.activities (title, date_display, location, participants, description, image_emoji, color_gradient_class, display_order)
SELECT 'กิจกรรมสัปดาห์วันวิทยาศาสตร์', '18 สิงหาคม 2567', 'ลานอเนกประสงค์', 1200, 'จัดนิทรรศการและการแข่งขันตอบปัญหาวิทยาศาสตร์', '🔬', 'from-blue-400 to-cyan-300', 4
WHERE NOT EXISTS (SELECT 1 FROM public.activities WHERE title = 'กิจกรรมสัปดาห์วันวิทยาศาสตร์');

INSERT INTO public.activities (title, date_display, location, participants, description, image_emoji, color_gradient_class, display_order)
SELECT 'กีฬาภายใน "ราชพฤกษ์เกมส์"', '25-27 ธันวาคม 2567', 'สนามกีฬากลาง', 1500, 'ควบคุมดูแลขบวนพาเหรดและกองเชียร์คณะสีแดง', '🏃', 'from-red-400 to-orange-400', 5
WHERE NOT EXISTS (SELECT 1 FROM public.activities WHERE title = 'กีฬาภายใน "ราชพฤกษ์เกมส์"');

INSERT INTO public.activities (title, date_display, location, participants, description, image_emoji, color_gradient_class, display_order)
SELECT 'ทัศนศึกษาแหล่งเรียนรู้', '15 พฤศจิกายน 2567', 'พิพิธภัณฑ์วิทย์ฯ', 300, 'พานักเรียนระดับชั้น ม.1 ทัศนศึกษาเปิดโลกทัศน์', '🚌', 'from-yellow-400 to-amber-400', 6
WHERE NOT EXISTS (SELECT 1 FROM public.activities WHERE title = 'ทัศนศึกษาแหล่งเรียนรู้');

INSERT INTO public.activities (title, date_display, location, participants, description, image_emoji, color_gradient_class, display_order)
SELECT 'กิจกรรมพัฒนาผู้เรียน "ค่ายคุณธรรม"', '5-7 กรกฎาคม 2567', 'วัดป่าสุคะโต', 150, 'อบรมจริยธรรมและปฏิบัติธรรมสำหรับนักเรียน', '🙏', 'from-emerald-400 to-green-500', 7
WHERE NOT EXISTS (SELECT 1 FROM public.activities WHERE title = 'กิจกรรมพัฒนาผู้เรียน "ค่ายคุณธรรม"');

INSERT INTO public.activities (title, date_display, location, participants, description, image_emoji, color_gradient_class, display_order)
SELECT 'เยี่ยมบ้านนักเรียน 100%', 'สิงหาคม 2567', 'บ้านนักเรียน', 40, 'ลงพื้นที่เยี่ยมบ้านนักเรียนเพื่อดูแลช่วยเหลือ', '🏠', 'from-indigo-400 to-purple-400', 8
WHERE NOT EXISTS (SELECT 1 FROM public.activities WHERE title = 'เยี่ยมบ้านนักเรียน 100%');


-- 5.7 Certificates (Sample Data)
INSERT INTO public.certificates (title, issuer, year, type, icon_name, color_class, bg_class, display_order)
SELECT 'ครูดีเด่นประจำปี 2567', 'สำนักงานเขตพื้นที่การศึกษา', '2567', 'award', 'Award', 'text-yellow-600', 'bg-yellow-100', 1
WHERE NOT EXISTS (SELECT 1 FROM public.certificates LIMIT 1);

INSERT INTO public.certificates (title, issuer, year, type, icon_name, color_class, bg_class, display_order)
SELECT 'อบรมการจัดการเรียนรู้ Active Learning', 'Starfish Labz', '2567', 'training', 'Certificate', 'text-blue-600', 'bg-blue-100', 2
WHERE NOT EXISTS (SELECT 1 FROM public.certificates LIMIT 1);

INSERT INTO public.certificates (title, issuer, year, type, icon_name, color_class, bg_class, display_order)
SELECT 'วิทยากรโครงการค่ายภาษาไทย', 'โรงเรียนบ้านหนองนา', '2566', 'guest_speaker', 'Mic', 'text-purple-600', 'bg-purple-100', 3
WHERE NOT EXISTS (SELECT 1 FROM public.certificates LIMIT 1);

INSERT INTO public.certificates (title, issuer, year, type, icon_name, color_class, bg_class, display_order)
SELECT 'ครูต้นแบบการสอนอิงสมรรถนะ', 'กระทรวงศึกษาธิการ', '2567', 'award', 'Award', 'text-yellow-600', 'bg-yellow-100', 4
WHERE NOT EXISTS (SELECT 1 FROM public.certificates WHERE title = 'ครูต้นแบบการสอนอิงสมรรถนะ');

INSERT INTO public.certificates (title, issuer, year, type, icon_name, color_class, bg_class, display_order)
SELECT 'อบรมเชิงปฏิบัติการ Coding', 'สสวท.', '2567', 'training', 'Code', 'text-blue-600', 'bg-blue-100', 5
WHERE NOT EXISTS (SELECT 1 FROM public.certificates WHERE title = 'อบรมเชิงปฏิบัติการ Coding');

INSERT INTO public.certificates (title, issuer, year, type, icon_name, color_class, bg_class, display_order)
SELECT 'นวัตกรรมการสอนเหรียญทอง', 'คุรุสภา', '2566', 'award', 'Medal', 'text-orange-600', 'bg-orange-100', 6
WHERE NOT EXISTS (SELECT 1 FROM public.certificates WHERE title = 'นวัตกรรมการสอนเหรียญทอง');

INSERT INTO public.certificates (title, issuer, year, type, icon_name, color_class, bg_class, display_order)
SELECT 'วิทยากรสร้างสื่อการสอนด้วย AI', 'สพม.', '2567', 'guest_speaker', 'Mic', 'text-purple-600', 'bg-purple-100', 7
WHERE NOT EXISTS (SELECT 1 FROM public.certificates WHERE title = 'วิทยากรสร้างสื่อการสอนด้วย AI');

INSERT INTO public.certificates (title, issuer, year, type, icon_name, color_class, bg_class, display_order)
SELECT 'ครูที่ปรึกษาโครงงานเหรียญทอง', 'ศิลปหัตถกรรมนักเรียน', '2566', 'award', 'Star', 'text-green-600', 'bg-green-100', 8
WHERE NOT EXISTS (SELECT 1 FROM public.certificates WHERE title = 'ครูที่ปรึกษาโครงงานเหรียญทอง');


-- 6. MIGRATION / FIXES (Auto-update existing data)

-- Fix: Update Activity Colors to match Theme (Pink, Mint, Sky)
UPDATE public.activities
SET color_gradient_class = CASE
    WHEN title LIKE '%ตอบปัญหาวรรณคดี%' OR title LIKE '%ลูกเสือ%' THEN 'from-secondary to-mint'
    WHEN title LIKE '%รักการอ่าน%' OR title LIKE '%โรงเรียนสีขาว%' THEN 'from-lavender to-sky'
    ELSE 'from-primary to-coral'
END
WHERE color_gradient_class NOT IN ('from-secondary to-mint', 'from-lavender to-sky', 'from-primary to-coral');

-- Fix: Ensure Profile columns exist (Migration)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS facebook_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS line_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS google_map_url TEXT;

-- Fix: Add Messages table for Contact Form
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Allow public to insert messages (for Contact Form)
DO $$
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Public Insert Messages') THEN 
        CREATE POLICY "Public Insert Messages" ON public.messages FOR INSERT WITH CHECK (true); 
    END IF; 
END $$;

-- Allow authenticated users (admin) to view/manage messages
DO $$
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'messages' AND policyname = 'Auth Manage Messages') THEN 
        CREATE POLICY "Auth Manage Messages" ON public.messages USING (auth.role() = 'authenticated'); 
    END IF; 
END $$;
