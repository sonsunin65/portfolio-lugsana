ALTER TABLE profiles ADD COLUMN IF NOT EXISTS google_map_url TEXT;

COMMENT ON COLUMN profiles.google_map_url IS 'URL for Google Map embed iframe';
