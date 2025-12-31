DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'pa_header_title') THEN
        ALTER TABLE profiles ADD COLUMN pa_header_title TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'pa_header_subtitle') THEN
        ALTER TABLE profiles ADD COLUMN pa_header_subtitle TEXT;
    END IF;
END $$;
