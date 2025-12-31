ALTER TABLE profiles ADD COLUMN IF NOT EXISTS footer_text TEXT;

COMMENT ON COLUMN profiles.footer_text IS 'Custom text for the website footer';
