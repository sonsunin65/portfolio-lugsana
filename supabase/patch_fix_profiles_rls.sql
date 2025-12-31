-- Enable RLS on profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
DROP POLICY IF EXISTS "Enable read access for all users" ON public.profiles;
CREATE POLICY "Enable read access for all users" ON public.profiles
    FOR SELECT
    USING (true);

-- Ensure authenticated users can update (idempotent check not need if we just use standard name)
-- Note: 'Allow authenticated update on profiles' might already exist from setup.sql
-- We'll just ensure read access is there.
