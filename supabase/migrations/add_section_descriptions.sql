-- Add section description columns to profiles table
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'works_description') THEN
        ALTER TABLE profiles ADD COLUMN works_description TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'certificates_description') THEN
        ALTER TABLE profiles ADD COLUMN certificates_description TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'activities_description') THEN
        ALTER TABLE profiles ADD COLUMN activities_description TEXT;
    END IF;
END $$;
