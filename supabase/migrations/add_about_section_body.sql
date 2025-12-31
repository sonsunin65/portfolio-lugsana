-- Add about_section_body column to profiles table description
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'about_section_body') THEN
        ALTER TABLE profiles ADD COLUMN about_section_body TEXT;
    END IF;
END $$;
