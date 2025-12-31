DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'pa_description') THEN
        ALTER TABLE profiles ADD COLUMN pa_description TEXT;
    END IF;
END $$;
