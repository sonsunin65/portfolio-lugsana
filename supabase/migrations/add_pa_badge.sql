DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'pa_badge_text') THEN
        ALTER TABLE profiles ADD COLUMN pa_badge_text TEXT;
    END IF;
END $$;
