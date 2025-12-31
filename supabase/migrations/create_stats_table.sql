
-- Create stats table
create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  title text not null, -- The number (e.g. "5", "10+")
  label text not null, -- The label (e.g. "รางวัลระดับชาติ")
  icon_name text not null, -- Lucide icon name
  color_class text not null, -- Tailwind color class
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.stats enable row level security;
create policy "Allow reading stats for everyone" on public.stats for select using (true);
create policy "Allow all for authenticated users" on public.stats for all using (auth.role() = 'authenticated');

-- Seed data to match user's image
INSERT INTO public.stats (title, label, icon_name, color_class, display_order) VALUES
('5', 'รางวัลระดับชาติ', 'Trophy', 'text-primary', 1),
('12', 'เกียรติบัตร', 'Award', 'text-secondary', 2),
('8', 'เหรียญรางวัล', 'Medal', 'text-accent', 3),
('10+', 'ปีที่ได้รับรางวัล', 'Star', 'text-coral', 4);
