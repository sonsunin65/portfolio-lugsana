-- Create tables for the portfolio website

-- 0. Clean up existing tables (ORDER MATTERS due to foreign keys)
DROP TABLE IF EXISTS public.pa_indicator_images CASCADE;
DROP TABLE IF EXISTS public.pa_works CASCADE;
DROP TABLE IF EXISTS public.pa_indicators CASCADE;
DROP TABLE IF EXISTS public.pa_categories CASCADE;
DROP TABLE IF EXISTS public.certificates CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.works CASCADE;
DROP TABLE IF EXISTS public.highlights CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 1. Profiles Table (For Hero, About, & Contact Section)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    full_name TEXT NOT NULL,
    position TEXT,
    bio TEXT,
    teaching_philosophy TEXT,
    image_url TEXT,
    stats_years TEXT,
    stats_students TEXT,
    stats_awards TEXT,
    -- Contact Info
    email TEXT,
    phone TEXT,
    address TEXT,
    facebook TEXT,
    line_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Highlights Table (About Section Cards)
CREATE TABLE IF NOT EXISTS public.highlights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color_class TEXT NOT NULL,
    bg_class TEXT NOT NULL,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Works Table (Works Section)
CREATE TABLE IF NOT EXISTS public.works (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color_class TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER,
    file_url TEXT, -- URL to uploaded file/PDF
    file_type TEXT, -- 'pdf', 'image', 'link', etc.
    external_links JSONB DEFAULT '[]'::jsonb, -- Array of { title: string, url: string }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Activities Table (Activities Section)
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    date_display TEXT NOT NULL,
    location TEXT NOT NULL,
    participants INTEGER,
    description TEXT NOT NULL,
    image_emoji TEXT, -- storing emoji or url
    color_gradient_class TEXT,
    display_order INTEGER,
    file_url TEXT, -- URL to uploaded file/PDF
    file_type TEXT, -- 'pdf', 'image', 'link', etc.
    external_links JSONB DEFAULT '[]'::jsonb, -- Array of { title: string, url: string }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Certificates Table (Certificates Section)
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    year TEXT NOT NULL,
    type TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color_class TEXT NOT NULL,
    bg_class TEXT NOT NULL,
    display_order INTEGER,
    file_url TEXT, -- URL to uploaded file/PDF
    file_type TEXT, -- 'pdf', 'image', 'link', etc.
    external_links JSONB DEFAULT '[]'::jsonb, -- Array of { title: string, url: string }
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PA Categories Table (For Admin / Performance Evaluation)
CREATE TABLE IF NOT EXISTS public.pa_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PA Indicators Table (For Admin / Performance Evaluation)
CREATE TABLE IF NOT EXISTS public.pa_indicators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.pa_categories(id) ON DELETE CASCADE,
    indicator_number TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. PA Works Table (For Admin / Performance Evaluation)
CREATE TABLE IF NOT EXISTS public.pa_works (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    indicator_id UUID REFERENCES public.pa_indicators(id) ON DELETE CASCADE,
    work_type TEXT NOT NULL, -- document, image, video, link
    title TEXT NOT NULL,
    url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PA Indicator Images Table (For Admin / Performance Evaluation)
CREATE TABLE IF NOT EXISTS public.pa_indicator_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    indicator_id UUID REFERENCES public.pa_indicators(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pa_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pa_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pa_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pa_indicator_images ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow Public Read for all, Authenticated Write for CRUD)

-- Drop existing policies to avoid conflicts on re-run
DROP POLICY IF EXISTS "Allow public read access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read access on highlights" ON public.highlights;
DROP POLICY IF EXISTS "Allow public read access on works" ON public.works;
DROP POLICY IF EXISTS "Allow public read access on activities" ON public.activities;
DROP POLICY IF EXISTS "Allow public read access on certificates" ON public.certificates;
DROP POLICY IF EXISTS "Allow public read access on pa_categories" ON public.pa_categories;
DROP POLICY IF EXISTS "Allow public read access on pa_indicators" ON public.pa_indicators;
DROP POLICY IF EXISTS "Allow public read access on pa_works" ON public.pa_works;
DROP POLICY IF EXISTS "Allow public read access on pa_indicator_images" ON public.pa_indicator_images;

DROP POLICY IF EXISTS "Allow authenticated insert on pa_categories" ON public.pa_categories;
DROP POLICY IF EXISTS "Allow authenticated update on pa_categories" ON public.pa_categories;
DROP POLICY IF EXISTS "Allow authenticated delete on pa_categories" ON public.pa_categories;

DROP POLICY IF EXISTS "Allow authenticated insert on pa_indicators" ON public.pa_indicators;
DROP POLICY IF EXISTS "Allow authenticated update on pa_indicators" ON public.pa_indicators;
DROP POLICY IF EXISTS "Allow authenticated delete on pa_indicators" ON public.pa_indicators;

DROP POLICY IF EXISTS "Allow authenticated insert on pa_works" ON public.pa_works;
DROP POLICY IF EXISTS "Allow authenticated update on pa_works" ON public.pa_works;
DROP POLICY IF EXISTS "Allow authenticated delete on pa_works" ON public.pa_works;

DROP POLICY IF EXISTS "Allow authenticated insert on pa_indicator_images" ON public.pa_indicator_images;
DROP POLICY IF EXISTS "Allow authenticated update on pa_indicator_images" ON public.pa_indicator_images;
DROP POLICY IF EXISTS "Allow authenticated delete on pa_indicator_images" ON public.pa_indicator_images;

-- Public Read
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on highlights" ON public.highlights FOR SELECT USING (true);
CREATE POLICY "Allow public read access on works" ON public.works FOR SELECT USING (true);
CREATE POLICY "Allow public read access on activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Allow public read access on pa_categories" ON public.pa_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on pa_indicators" ON public.pa_indicators FOR SELECT USING (true);
CREATE POLICY "Allow public read access on pa_works" ON public.pa_works FOR SELECT USING (true);
CREATE POLICY "Allow public read access on pa_indicator_images" ON public.pa_indicator_images FOR SELECT USING (true);

-- Authenticated Write (For Admin)
-- Note: You can add specific policies for other tables (profiles, works, etc.) if needed for admin to write.
-- Assuming Admin uses dashboard or we add policies:

DROP POLICY IF EXISTS "Allow authenticated insert on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated update on profiles" ON public.profiles;
CREATE POLICY "Allow authenticated update on profiles" ON public.profiles FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated ALL on highlights" ON public.highlights;
CREATE POLICY "Allow authenticated ALL on highlights" ON public.highlights FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated ALL on works" ON public.works;
CREATE POLICY "Allow authenticated ALL on works" ON public.works FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated ALL on activities" ON public.activities;
CREATE POLICY "Allow authenticated ALL on activities" ON public.activities FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated ALL on certificates" ON public.certificates;
CREATE POLICY "Allow authenticated ALL on certificates" ON public.certificates FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on pa_categories" ON public.pa_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on pa_categories" ON public.pa_categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on pa_categories" ON public.pa_categories FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on pa_indicators" ON public.pa_indicators FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on pa_indicators" ON public.pa_indicators FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on pa_indicators" ON public.pa_indicators FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on pa_works" ON public.pa_works FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on pa_works" ON public.pa_works FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on pa_works" ON public.pa_works FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on pa_indicator_images" ON public.pa_indicator_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on pa_indicator_images" ON public.pa_indicator_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on pa_indicator_images" ON public.pa_indicator_images FOR DELETE TO authenticated USING (true);


-- Storage Bucket Setup
-- Note: User needs to create a bucket named 'pa-images' in Supabase Storage and enable public access.

-- Seed Data (Initial Data matching current website)

-- Seed Profile
INSERT INTO public.profiles (full_name, position, bio, teaching_philosophy, image_url, stats_years, stats_students, stats_awards, email, phone, address, facebook)
VALUES (
    'กฤษฎา คำมา',
    'ตำแหน่งครู วิทยฐานะครูชำนาญการ',
    'ครูผู้สอนที่มุ่งมั่นในการพัฒนาการเรียนรู้ของนักเรียน ด้วยความรักและความใส่ใจในทุกๆ วัน',
    'ทุกคนมีศักยภาพในตัวเอง หน้าที่ของครูคือช่วยให้เด็กๆ ค้นพบและพัฒนาศักยภาพนั้น',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60',
    '10+',
    '500+',
    '50+',
    'kritsada@example.com',
    '081-234-5678',
    'โรงเรียน..., จังหวัด...',
    'ครูกฤษฎา คำมา'
);

-- Seed Highlights
INSERT INTO public.highlights (title, description, icon_name, color_class, bg_class, display_order) VALUES
('การศึกษา', 'ปริญญาตรี สาขาการศึกษา มหาวิทยาลัยชั้นนำ', 'GraduationCap', 'text-primary', 'bg-primary/10', 1),
('ประสบการณ์', 'มากกว่า 10 ปี ในการสอนและพัฒนานักเรียน', 'Award', 'text-secondary', 'bg-secondary/10', 2),
('วิชาที่สอน', 'ภาษาไทย ภาษาอังกฤษ และกิจกรรมพัฒนาผู้เรียน', 'BookOpen', 'text-accent', 'bg-accent/10', 3),
('ทักษะพิเศษ', 'การจัดกิจกรรมสร้างสรรค์ การใช้เทคโนโลยีในการสอน', 'Users', 'text-lavender', 'bg-lavender/10', 4);

-- Seed Works
INSERT INTO public.works (title, category, description, icon_name, color_class, views, is_featured, display_order, external_links) VALUES
('สื่อการสอนภาษาไทยแบบ Interactive', 'สื่อการสอน', 'สื่อการสอนที่ช่วยให้นักเรียนเรียนรู้ภาษาไทยอย่างสนุกสนาน ปีการศึกษา 2569', 'Presentation', 'bg-primary', 1250, true, 1, '[{"title": "ดูวิดีโอตัวอย่าง", "url": "#"}, {"title": "ดาวน์โหลดเอกสาร", "url": "#"}]'::jsonb),
('แผนการจัดการเรียนรู้แบบ Active Learning', 'แผนการสอน', 'แผนการสอนที่เน้นให้ผู้เรียนมีส่วนร่วมในกระบวนการเรียนรู้ ปีการศึกษา 2569', 'FileText', 'bg-secondary', 890, false, 2, '[]'::jsonb),
('วิดีโอสอนการอ่านออกเสียง', 'วิดีโอ', 'วิดีโอสอนเทคนิคการอ่านออกเสียงที่ถูกต้องตามหลักภาษา ปีการศึกษา 2569', 'Video', 'bg-coral', 2340, true, 3, '[{"title": "ชมผ่าน YouTube", "url": "#"}]'::jsonb),
('หนังสือเสริมทักษะการเขียน', 'หนังสือ', 'หนังสือแบบฝึกหัดเสริมทักษะการเขียนเรียงความ ปีการศึกษา 2569', 'BookOpen', 'bg-lavender', 567, false, 4, '[]'::jsonb),
('เกมการศึกษาวรรณคดีไทย', 'เกม', 'เกมการศึกษาที่ช่วยให้นักเรียนเรียนรู้วรรณคดีอย่างสนุก ปีการศึกษา 2569', 'Star', 'bg-mint', 1890, true, 5, '[{"title": "เล่นเกม", "url": "#"}]'::jsonb),
('ใบงานพัฒนาทักษะการคิด', 'ใบงาน', 'ใบงานที่ออกแบบมาเพื่อพัฒนาทักษะการคิดวิเคราะห์ ปีการศึกษา 2569', 'FileText', 'bg-accent', 723, false, 6, '[]'::jsonb);

-- Seed Activities
INSERT INTO public.activities (title, date_display, location, participants, description, image_emoji, color_gradient_class, display_order, external_links) VALUES
('กิจกรรมค่ายวิชาการภาษาไทย', '15-17 มกราคม 2569', 'โรงเรียน', 120, 'ค่ายพัฒนาทักษะภาษาไทยสำหรับนักเรียนชั้นประถมศึกษา', '🏕️', 'from-primary to-coral', 1, '[{"title": "ดูรูปภาพเพิ่มเติม", "url": "#"}]'::jsonb),
('การแข่งขันตอบปัญหาวรรณคดี', '22 กุมภาพันธ์ 2569', 'หอประชุมโรงเรียน', 80, 'การแข่งขันตอบปัญหาวรรณคดีไทยระดับเขตพื้นที่การศึกษา', '🏆', 'from-secondary to-mint', 2, '[]'::jsonb),
('โครงการรักการอ่าน', 'ตลอดปีการศึกษา 2569', 'ห้องสมุดโรงเรียน', 250, 'กิจกรรมส่งเสริมนิสัยรักการอ่านสำหรับนักเรียนทุกระดับชั้น', '📚', 'from-lavender to-sky', 3, '[]'::jsonb),
('ทัศนศึกษาพิพิธภัณฑ์วรรณกรรม', '5 มีนาคม 2569', 'กรุงเทพมหานคร', 45, 'ทัศนศึกษาเรียนรู้ประวัติศาสตร์วรรณกรรมไทย', '🚌', 'from-accent to-peach', 4, '[{"title": "วิดีโอบันทึกกิจกรรม", "url": "#"}]'::jsonb);

-- Seed Certificates
INSERT INTO public.certificates (title, issuer, year, type, icon_name, color_class, bg_class, display_order, external_links) VALUES
('ครูดีเด่นระดับเขตพื้นที่การศึกษา', 'สำนักงานเขตพื้นที่การศึกษา', '2569', 'รางวัล', 'Trophy', 'text-accent', 'bg-accent/10', 1, '[]'::jsonb),
('รางวัลครูสอนดี ประจำปี 2569', 'กระทรวงศึกษาธิการ', '2569', 'รางวัล', 'Crown', 'text-primary', 'bg-primary/10', 2, '[{"title": "ดูเกียรติบัตร", "url": "#"}]'::jsonb),
('ใบประกาศนียบัตรการอบรม Google Certified Educator', 'Google for Education', '2569', 'ประกาศนียบัตร', 'Award', 'text-secondary', 'bg-secondary/10', 3, '[]'::jsonb),
('เหรียญทองการแข่งขันนวัตกรรมการสอน', 'สมาคมครูแห่งประเทศไทย', '2569', 'เหรียญรางวัล', 'Medal', 'text-coral', 'bg-coral/10', 4, '[]'::jsonb),
('รางวัลครูผู้สร้างแรงบันดาลใจ', 'มูลนิธิส่งเสริมการศึกษา', '2569', 'รางวัล', 'Star', 'text-lavender', 'bg-lavender/10', 5, '[]'::jsonb),
('ใบประกาศนียบัตร Microsoft Innovative Educator', 'Microsoft Education', '2569', 'ประกาศนียบัตร', 'Award', 'text-sky', 'bg-sky/10', 6, '[]'::jsonb);

-- Seed PA Data (Full Standard 3 Categories)
DO $$
DECLARE
    cat1_id UUID;
    cat2_id UUID;
    cat3_id UUID;
    ind_id UUID;
BEGIN
    -- PA data is already cleared by DROP TABLE at start

    -- Category 1: ด้านการจัดการเรียนรู้
    INSERT INTO public.pa_categories (category_number, title, icon, color)
    VALUES (1, 'ด้านการจัดการเรียนรู้', 'BookOpen', 'from-primary to-coral')
    RETURNING id INTO cat1_id;

    -- Indicators for Cat 1
    INSERT INTO public.pa_indicators (category_id, indicator_number, name, description) VALUES 
    (cat1_id, '1.1', 'การสร้างและหรือพัฒนาหลักสูตร', 'มีการวิเคราะห์หลักสูตรมาตรฐานการเรียนรู้และตัวชี้วัด และนำไปจัดทำรายวิชา'),
    (cat1_id, '1.2', 'การออกแบบการจัดการเรียนรู้', 'เน้นผู้เรียนเป็นสำคัญ เพื่อให้ผู้เรียนมีความรู้ ทักษะ คุณลักษณะประจำวิชา'),
    (cat1_id, '1.3', 'การจัดกิจกรรมการเรียนรู้', 'อำนวยความสะดวกในการเรียนรู้ และส่งเสริมผู้เรียนได้พัฒนาเต็มตามศักยภาพ'),
    (cat1_id, '1.4', 'การสร้างและหรือพัฒนาสื่อ นวัตกรรม', 'มีการเลือกใช้ สื่อ เทคโนโลยี และแหล่งเรียนรู้ ที่สอดคล้องกับกิจกรรมการเรียนรู้'),
    (cat1_id, '1.5', 'การวัดและประเมินผลการเรียนรู้', 'มีกระบวนการวัดและประเมินผลการเรียนรู้ด้วยวิธีการที่หลากหลาย'),
    (cat1_id, '1.6', 'การศึกษา วิเคราะห์ และสังเคราะห์', 'เพื่อแก้ปัญหาหรือพัฒนาการเรียนรู้ที่ส่งผลต่อคุณภาพผู้เรียน'),
    (cat1_id, '1.7', 'การจัดบรรยากาศที่ส่งเสริมและพัฒนาผู้เรียน', 'จัดบรรยากาศที่ส่งเสริมและเอื้อต่อการเรียนรู้ กระตุ้นความสนใจใฝ่รู้'),
    (cat1_id, '1.8', 'การอบรมและพัฒนาคุณลักษณะที่ดีของผู้เรียน', 'ปลูกฝังคุณธรรม จริยธรรม คุณลักษณะอันพึงประสงค์');

    -- Category 2: ด้านการส่งเสริมและสนับสนุน
    INSERT INTO public.pa_categories (category_number, title, icon, color)
    VALUES (2, 'ด้านการส่งเสริมและสนับสนุน', 'Users', 'from-secondary to-mint')
    RETURNING id INTO cat2_id;

    -- Indicators for Cat 2
    INSERT INTO public.pa_indicators (category_id, indicator_number, name, description) VALUES
    (cat2_id, '2.1', 'การจัดทำข้อมูลสารสนเทศของผู้เรียนและรายวิชา', 'เพื่อใช้ในการส่งเสริมสนับสนุนการเรียนรู้ และพัฒนาคุณภาพผู้เรียน'),
    (cat2_id, '2.2', 'การดำเนินการตามระบบดูแลช่วยเหลือผู้เรียน', 'ใช้ข้อมูลสารสนเทศเกี่ยวกับผู้เรียนรายบุคคล และประสานความร่วมมือผู้มีส่วนเกี่ยวข้อง'),
    (cat2_id, '2.3', 'การปฏิบัติงานวิชาการ และงานอื่นๆ ของสถานศึกษา', 'ร่วมปฏิบัติงานทางวิชาการ และงานอื่นๆ ของสถานศึกษาเพื่อยกระดับคุณภาพ'),
    (cat2_id, '2.4', 'การประสานความร่วมมือกับผู้ปกครอง ภาคีเครือข่าย', 'ประสานความร่วมมือกับผู้ปกครอง ภาคีเครือข่าย และหรือสถานประกอบการ');

    -- Category 3: ด้านการพัฒนาตนเองและวิชาชีพ
    INSERT INTO public.pa_categories (category_number, title, icon, color)
    VALUES (3, 'ด้านการพัฒนาตนเองและวิชาชีพ', 'TrendingUp', 'from-accent to-peach')
    RETURNING id INTO cat3_id;

    -- Indicators for Cat 3
    INSERT INTO public.pa_indicators (category_id, indicator_number, name, description) VALUES
    (cat3_id, '3.1', 'การพัฒนาตนเองอย่างเป็นระบบและต่อเนื่อง', 'เพื่อให้มีความรู้ความสามารถ ทักษะ โดยเฉพาะอย่างยิ่งการใช้ภาษาไทยและภาษาอังกฤษเพื่อการสื่อสาร'),
    (cat3_id, '3.2', 'การมีส่วนร่วม และเป็นผู้นำในการแลกเปลี่ยนเรียนรู้', 'ในชุมชนการเรียนรู้ทางวิชาชีพ เพื่อพัฒนาการจัดการเรียนรู้'),
    (cat3_id, '3.3', 'การนำความรู้ความสามารถ ทักษะที่ได้จากการพัฒนาตนเอง', 'มาใช้ในการพัฒนาการจัดการเรียนรู้ การพัฒนาคุณภาพผู้เรียน และการพัฒนานวัตกรรมการจัดการเรียนรู้');

    -- Sample Works (Add some sample works to first indicator to show structure)
    SELECT id INTO ind_id FROM public.pa_indicators WHERE indicator_number = '1.1' LIMIT 1;
    INSERT INTO public.pa_works (indicator_id, work_type, title, url, sort_order) VALUES
    (ind_id, 'document', 'หลักสูตรสถานศึกษา 2569', '#', 1),
    (ind_id, 'document', 'คำอธิบายรายวิชา', '#', 2);
    
    INSERT INTO public.pa_indicator_images (indicator_id, image_url, caption, sort_order) VALUES
    (ind_id, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60', 'การประชุมจัดทำหลักสูตร', 1);

END $$;

-- 2. Highlights Table (About Section Cards)
CREATE TABLE IF NOT EXISTS public.highlights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color_class TEXT NOT NULL,
    bg_class TEXT NOT NULL,
    display_order INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Works Table (Works Section)
CREATE TABLE IF NOT EXISTS public.works (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color_class TEXT NOT NULL,
    views INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    display_order INTEGER,
    file_url TEXT, -- New: URL to uploaded file/PDF
    file_type TEXT, -- New: 'pdf', 'image', 'link', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Activities Table (Activities Section)
CREATE TABLE IF NOT EXISTS public.activities (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    date_display TEXT NOT NULL,
    location TEXT NOT NULL,
    participants INTEGER,
    description TEXT NOT NULL,
    image_emoji TEXT, -- storing emoji or url
    color_gradient_class TEXT,
    display_order INTEGER,
    file_url TEXT, -- New: URL to uploaded file/PDF
    file_type TEXT, -- New: 'pdf', 'image', 'link', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Certificates Table (Certificates Section)
CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    issuer TEXT NOT NULL,
    year TEXT NOT NULL,
    type TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    color_class TEXT NOT NULL,
    bg_class TEXT NOT NULL,
    display_order INTEGER,
    file_url TEXT, -- New: URL to uploaded file/PDF
    file_type TEXT, -- New: 'pdf', 'image', 'link', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. PA Categories Table (For Admin / Performance Evaluation)
CREATE TABLE IF NOT EXISTS public.pa_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PA Indicators Table (For Admin / Performance Evaluation)
CREATE TABLE IF NOT EXISTS public.pa_indicators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.pa_categories(id) ON DELETE CASCADE,
    indicator_number TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. PA Works Table (For Admin / Performance Evaluation)
CREATE TABLE IF NOT EXISTS public.pa_works (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    indicator_id UUID REFERENCES public.pa_indicators(id) ON DELETE CASCADE,
    work_type TEXT NOT NULL, -- document, image, video, link
    title TEXT NOT NULL,
    url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. PA Indicator Images Table (For Admin / Performance Evaluation)
CREATE TABLE IF NOT EXISTS public.pa_indicator_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    indicator_id UUID REFERENCES public.pa_indicators(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    caption TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pa_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pa_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pa_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pa_indicator_images ENABLE ROW LEVEL SECURITY;

-- Create Policies (Allow Public Read for all, Authenticated Write for CRUD)

-- Drop existing policies to avoid conflicts on re-run
DROP POLICY IF EXISTS "Allow public read access on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow public read access on highlights" ON public.highlights;
DROP POLICY IF EXISTS "Allow public read access on works" ON public.works;
DROP POLICY IF EXISTS "Allow public read access on activities" ON public.activities;
DROP POLICY IF EXISTS "Allow public read access on certificates" ON public.certificates;
DROP POLICY IF EXISTS "Allow public read access on pa_categories" ON public.pa_categories;
DROP POLICY IF EXISTS "Allow public read access on pa_indicators" ON public.pa_indicators;
DROP POLICY IF EXISTS "Allow public read access on pa_works" ON public.pa_works;
DROP POLICY IF EXISTS "Allow public read access on pa_indicator_images" ON public.pa_indicator_images;

DROP POLICY IF EXISTS "Allow authenticated insert on pa_categories" ON public.pa_categories;
DROP POLICY IF EXISTS "Allow authenticated update on pa_categories" ON public.pa_categories;
DROP POLICY IF EXISTS "Allow authenticated delete on pa_categories" ON public.pa_categories;

DROP POLICY IF EXISTS "Allow authenticated insert on pa_indicators" ON public.pa_indicators;
DROP POLICY IF EXISTS "Allow authenticated update on pa_indicators" ON public.pa_indicators;
DROP POLICY IF EXISTS "Allow authenticated delete on pa_indicators" ON public.pa_indicators;

DROP POLICY IF EXISTS "Allow authenticated insert on pa_works" ON public.pa_works;
DROP POLICY IF EXISTS "Allow authenticated update on pa_works" ON public.pa_works;
DROP POLICY IF EXISTS "Allow authenticated delete on pa_works" ON public.pa_works;

DROP POLICY IF EXISTS "Allow authenticated insert on pa_indicator_images" ON public.pa_indicator_images;
DROP POLICY IF EXISTS "Allow authenticated update on pa_indicator_images" ON public.pa_indicator_images;
DROP POLICY IF EXISTS "Allow authenticated delete on pa_indicator_images" ON public.pa_indicator_images;

-- Public Read
CREATE POLICY "Allow public read access on profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Allow public read access on highlights" ON public.highlights FOR SELECT USING (true);
CREATE POLICY "Allow public read access on works" ON public.works FOR SELECT USING (true);
CREATE POLICY "Allow public read access on activities" ON public.activities FOR SELECT USING (true);
CREATE POLICY "Allow public read access on certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Allow public read access on pa_categories" ON public.pa_categories FOR SELECT USING (true);
CREATE POLICY "Allow public read access on pa_indicators" ON public.pa_indicators FOR SELECT USING (true);
CREATE POLICY "Allow public read access on pa_works" ON public.pa_works FOR SELECT USING (true);
CREATE POLICY "Allow public read access on pa_indicator_images" ON public.pa_indicator_images FOR SELECT USING (true);

-- Authenticated Write (For Admin)
-- Note: You can add specific policies for other tables (profiles, works, etc.) if needed for admin to write.
-- Assuming Admin uses dashboard or we add policies:

DROP POLICY IF EXISTS "Allow authenticated insert on profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated update on profiles" ON public.profiles;
CREATE POLICY "Allow authenticated update on profiles" ON public.profiles FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated ALL on highlights" ON public.highlights;
CREATE POLICY "Allow authenticated ALL on highlights" ON public.highlights FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated ALL on works" ON public.works;
CREATE POLICY "Allow authenticated ALL on works" ON public.works FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated ALL on activities" ON public.activities;
CREATE POLICY "Allow authenticated ALL on activities" ON public.activities FOR ALL TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated ALL on certificates" ON public.certificates;
CREATE POLICY "Allow authenticated ALL on certificates" ON public.certificates FOR ALL TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on pa_categories" ON public.pa_categories FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on pa_categories" ON public.pa_categories FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on pa_categories" ON public.pa_categories FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on pa_indicators" ON public.pa_indicators FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on pa_indicators" ON public.pa_indicators FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on pa_indicators" ON public.pa_indicators FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on pa_works" ON public.pa_works FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on pa_works" ON public.pa_works FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on pa_works" ON public.pa_works FOR DELETE TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert on pa_indicator_images" ON public.pa_indicator_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update on pa_indicator_images" ON public.pa_indicator_images FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Allow authenticated delete on pa_indicator_images" ON public.pa_indicator_images FOR DELETE TO authenticated USING (true);


-- Storage Bucket Setup
-- Note: User needs to create a bucket named 'pa-images' in Supabase Storage and enable public access.

-- Seed Data (Initial Data matching current website)

-- Seed Profile
INSERT INTO public.profiles (full_name, position, bio, teaching_philosophy, image_url, stats_years, stats_students, stats_awards)
VALUES (
    'กฤษฎา คำมา',
    'ตำแหน่งครู วิทยฐานะครูชำนาญการ',
    'ครูผู้สอนที่มุ่งมั่นในการพัฒนาการเรียนรู้ของนักเรียน ด้วยความรักและความใส่ใจในทุกๆ วัน',
    'ทุกคนมีศักยภาพในตัวเอง หน้าที่ของครูคือช่วยให้เด็กๆ ค้นพบและพัฒนาศักยภาพนั้น',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&auto=format&fit=crop&q=60',
    '10+',
    '500+',
    '50+'
);

-- Seed Highlights
INSERT INTO public.highlights (title, description, icon_name, color_class, bg_class, display_order) VALUES
('การศึกษา', 'ปริญญาตรี สาขาการศึกษา มหาวิทยาลัยชั้นนำ', 'GraduationCap', 'text-primary', 'bg-primary/10', 1),
('ประสบการณ์', 'มากกว่า 10 ปี ในการสอนและพัฒนานักเรียน', 'Award', 'text-secondary', 'bg-secondary/10', 2),
('วิชาที่สอน', 'ภาษาไทย ภาษาอังกฤษ และกิจกรรมพัฒนาผู้เรียน', 'BookOpen', 'text-accent', 'bg-accent/10', 3),
('ทักษะพิเศษ', 'การจัดกิจกรรมสร้างสรรค์ การใช้เทคโนโลยีในการสอน', 'Users', 'text-lavender', 'bg-lavender/10', 4);

-- Seed Works
INSERT INTO public.works (title, category, description, icon_name, color_class, views, is_featured, display_order) VALUES
('สื่อการสอนภาษาไทยแบบ Interactive', 'สื่อการสอน', 'สื่อการสอนที่ช่วยให้นักเรียนเรียนรู้ภาษาไทยอย่างสนุกสนาน ปีการศึกษา 2569', 'Presentation', 'bg-primary', 1250, true, 1),
('แผนการจัดการเรียนรู้แบบ Active Learning', 'แผนการสอน', 'แผนการสอนที่เน้นให้ผู้เรียนมีส่วนร่วมในกระบวนการเรียนรู้ ปีการศึกษา 2569', 'FileText', 'bg-secondary', 890, false, 2),
('วิดีโอสอนการอ่านออกเสียง', 'วิดีโอ', 'วิดีโอสอนเทคนิคการอ่านออกเสียงที่ถูกต้องตามหลักภาษา ปีการศึกษา 2569', 'Video', 'bg-coral', 2340, true, 3),
('หนังสือเสริมทักษะการเขียน', 'หนังสือ', 'หนังสือแบบฝึกหัดเสริมทักษะการเขียนเรียงความ ปีการศึกษา 2569', 'BookOpen', 'bg-lavender', 567, false, 4),
('เกมการศึกษาวรรณคดีไทย', 'เกม', 'เกมการศึกษาที่ช่วยให้นักเรียนเรียนรู้วรรณคดีอย่างสนุก ปีการศึกษา 2569', 'Star', 'bg-mint', 1890, true, 5),
('ใบงานพัฒนาทักษะการคิด', 'ใบงาน', 'ใบงานที่ออกแบบมาเพื่อพัฒนาทักษะการคิดวิเคราะห์ ปีการศึกษา 2569', 'FileText', 'bg-accent', 723, false, 6);

-- Seed Activities
INSERT INTO public.activities (title, date_display, location, participants, description, image_emoji, color_gradient_class, display_order) VALUES
('กิจกรรมค่ายวิชาการภาษาไทย', '15-17 มกราคม 2569', 'โรงเรียน', 120, 'ค่ายพัฒนาทักษะภาษาไทยสำหรับนักเรียนชั้นประถมศึกษา', '🏕️', 'from-primary to-coral', 1),
('การแข่งขันตอบปัญหาวรรณคดี', '22 กุมภาพันธ์ 2569', 'หอประชุมโรงเรียน', 80, 'การแข่งขันตอบปัญหาวรรณคดีไทยระดับเขตพื้นที่การศึกษา', '🏆', 'from-secondary to-mint', 2),
('โครงการรักการอ่าน', 'ตลอดปีการศึกษา 2569', 'ห้องสมุดโรงเรียน', 250, 'กิจกรรมส่งเสริมนิสัยรักการอ่านสำหรับนักเรียนทุกระดับชั้น', '📚', 'from-lavender to-sky', 3),
('ทัศนศึกษาพิพิธภัณฑ์วรรณกรรม', '5 มีนาคม 2569', 'กรุงเทพมหานคร', 45, 'ทัศนศึกษาเรียนรู้ประวัติศาสตร์วรรณกรรมไทย', '🚌', 'from-accent to-peach', 4);

-- Seed Certificates
INSERT INTO public.certificates (title, issuer, year, type, icon_name, color_class, bg_class, display_order) VALUES
('ครูดีเด่นระดับเขตพื้นที่การศึกษา', 'สำนักงานเขตพื้นที่การศึกษา', '2569', 'รางวัล', 'Trophy', 'text-accent', 'bg-accent/10', 1),
('รางวัลครูสอนดี ประจำปี 2569', 'กระทรวงศึกษาธิการ', '2569', 'รางวัล', 'Crown', 'text-primary', 'bg-primary/10', 2),
('ใบประกาศนียบัตรการอบรม Google Certified Educator', 'Google for Education', '2569', 'ประกาศนียบัตร', 'Award', 'text-secondary', 'bg-secondary/10', 3),
('เหรียญทองการแข่งขันนวัตกรรมการสอน', 'สมาคมครูแห่งประเทศไทย', '2569', 'เหรียญรางวัล', 'Medal', 'text-coral', 'bg-coral/10', 4),
('รางวัลครูผู้สร้างแรงบันดาลใจ', 'มูลนิธิส่งเสริมการศึกษา', '2569', 'รางวัล', 'Star', 'text-lavender', 'bg-lavender/10', 5),
('ใบประกาศนียบัตร Microsoft Innovative Educator', 'Microsoft Education', '2569', 'ประกาศนียบัตร', 'Award', 'text-sky', 'bg-sky/10', 6);

-- Seed PA Data (Full Standard 3 Categories)
DO $$
DECLARE
    cat1_id UUID;
    cat2_id UUID;
    cat3_id UUID;
    ind_id UUID;
BEGIN
    -- Clear existing PA data to avoid duplicates if re-running
    DELETE FROM public.pa_works;
    DELETE FROM public.pa_indicator_images;
    DELETE FROM public.pa_indicators;
    DELETE FROM public.pa_categories;

    -- Category 1: ด้านการจัดการเรียนรู้
    INSERT INTO public.pa_categories (category_number, title, icon, color)
    VALUES (1, 'ด้านการจัดการเรียนรู้', 'BookOpen', 'from-primary to-coral')
    RETURNING id INTO cat1_id;

    -- Indicators for Cat 1
    INSERT INTO public.pa_indicators (category_id, indicator_number, name, description) VALUES 
    (cat1_id, '1.1', 'การสร้างและหรือพัฒนาหลักสูตร', 'มีการวิเคราะห์หลักสูตรมาตรฐานการเรียนรู้และตัวชี้วัด และนำไปจัดทำรายวิชา'),
    (cat1_id, '1.2', 'การออกแบบการจัดการเรียนรู้', 'เน้นผู้เรียนเป็นสำคัญ เพื่อให้ผู้เรียนมีความรู้ ทักษะ คุณลักษณะประจำวิชา'),
    (cat1_id, '1.3', 'การจัดกิจกรรมการเรียนรู้', 'อำนวยความสะดวกในการเรียนรู้ และส่งเสริมผู้เรียนได้พัฒนาเต็มตามศักยภาพ'),
    (cat1_id, '1.4', 'การสร้างและหรือพัฒนาสื่อ นวัตกรรม', 'มีการเลือกใช้ สื่อ เทคโนโลยี และแหล่งเรียนรู้ ที่สอดคล้องกับกิจกรรมการเรียนรู้'),
    (cat1_id, '1.5', 'การวัดและประเมินผลการเรียนรู้', 'มีกระบวนการวัดและประเมินผลการเรียนรู้ด้วยวิธีการที่หลากหลาย'),
    (cat1_id, '1.6', 'การศึกษา วิเคราะห์ และสังเคราะห์', 'เพื่อแก้ปัญหาหรือพัฒนาการเรียนรู้ที่ส่งผลต่อคุณภาพผู้เรียน'),
    (cat1_id, '1.7', 'การจัดบรรยากาศที่ส่งเสริมและพัฒนาผู้เรียน', 'จัดบรรยากาศที่ส่งเสริมและเอื้อต่อการเรียนรู้ กระตุ้นความสนใจใฝ่รู้'),
    (cat1_id, '1.8', 'การอบรมและพัฒนาคุณลักษณะที่ดีของผู้เรียน', 'ปลูกฝังคุณธรรม จริยธรรม คุณลักษณะอันพึงประสงค์');

    -- Category 2: ด้านการส่งเสริมและสนับสนุน
    INSERT INTO public.pa_categories (category_number, title, icon, color)
    VALUES (2, 'ด้านการส่งเสริมและสนับสนุน', 'Users', 'from-secondary to-mint')
    RETURNING id INTO cat2_id;

    -- Indicators for Cat 2
    INSERT INTO public.pa_indicators (category_id, indicator_number, name, description) VALUES
    (cat2_id, '2.1', 'การจัดทำข้อมูลสารสนเทศของผู้เรียนและรายวิชา', 'เพื่อใช้ในการส่งเสริมสนับสนุนการเรียนรู้ และพัฒนาคุณภาพผู้เรียน'),
    (cat2_id, '2.2', 'การดำเนินการตามระบบดูแลช่วยเหลือผู้เรียน', 'ใช้ข้อมูลสารสนเทศเกี่ยวกับผู้เรียนรายบุคคล และประสานความร่วมมือผู้มีส่วนเกี่ยวข้อง'),
    (cat2_id, '2.3', 'การปฏิบัติงานวิชาการ และงานอื่นๆ ของสถานศึกษา', 'ร่วมปฏิบัติงานทางวิชาการ และงานอื่นๆ ของสถานศึกษาเพื่อยกระดับคุณภาพ'),
    (cat2_id, '2.4', 'การประสานความร่วมมือกับผู้ปกครอง ภาคีเครือข่าย', 'ประสานความร่วมมือกับผู้ปกครอง ภาคีเครือข่าย และหรือสถานประกอบการ');

    -- Category 3: ด้านการพัฒนาตนเองและวิชาชีพ
    INSERT INTO public.pa_categories (category_number, title, icon, color)
    VALUES (3, 'ด้านการพัฒนาตนเองและวิชาชีพ', 'TrendingUp', 'from-accent to-peach')
    RETURNING id INTO cat3_id;

    -- Indicators for Cat 3
    INSERT INTO public.pa_indicators (category_id, indicator_number, name, description) VALUES
    (cat3_id, '3.1', 'การพัฒนาตนเองอย่างเป็นระบบและต่อเนื่อง', 'เพื่อให้มีความรู้ความสามารถ ทักษะ โดยเฉพาะอย่างยิ่งการใช้ภาษาไทยและภาษาอังกฤษเพื่อการสื่อสาร'),
    (cat3_id, '3.2', 'การมีส่วนร่วม และเป็นผู้นำในการแลกเปลี่ยนเรียนรู้', 'ในชุมชนการเรียนรู้ทางวิชาชีพ เพื่อพัฒนาการจัดการเรียนรู้'),
    (cat3_id, '3.3', 'การนำความรู้ความสามารถ ทักษะที่ได้จากการพัฒนาตนเอง', 'มาใช้ในการพัฒนาการจัดการเรียนรู้ การพัฒนาคุณภาพผู้เรียน และการพัฒนานวัตกรรมการจัดการเรียนรู้');

    -- Sample Works (Add some sample works to first indicator to show structure)
    SELECT id INTO ind_id FROM public.pa_indicators WHERE indicator_number = '1.1' LIMIT 1;
    INSERT INTO public.pa_works (indicator_id, work_type, title, url, sort_order) VALUES
    (ind_id, 'document', 'หลักสูตรสถานศึกษา 2569', '#', 1),
    (ind_id, 'document', 'คำอธิบายรายวิชา', '#', 2);
    
    INSERT INTO public.pa_indicator_images (indicator_id, image_url, caption, sort_order) VALUES
    (ind_id, 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&auto=format&fit=crop&q=60', 'การประชุมจัดทำหลักสูตร', 1);

END $$;
