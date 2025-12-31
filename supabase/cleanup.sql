-- Clean up duplicate data by truncating tables
-- This will delete ALL data in these tables so you can re-seed them cleanly

TRUNCATE TABLE public.highlights CASCADE;
TRUNCATE TABLE public.works CASCADE;
TRUNCATE TABLE public.activities CASCADE;
TRUNCATE TABLE public.certificates CASCADE;
TRUNCATE TABLE public.profiles CASCADE;
TRUNCATE TABLE public.pa_works CASCADE;
TRUNCATE TABLE public.pa_indicator_images CASCADE;
TRUNCATE TABLE public.pa_indicators CASCADE;
TRUNCATE TABLE public.pa_categories CASCADE;

-- After running this, please run the Insert/Seed parts of setup.sql again,
-- OR just run the full setup.sql script from the beginning (which includes DROP/CREATE).
