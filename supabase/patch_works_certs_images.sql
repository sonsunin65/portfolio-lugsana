-- Add images column to works table
ALTER TABLE works ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add images column to certificates table
ALTER TABLE certificates ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Optional: Migrate existing file_url to images (if needed, but code will handle fallback)
-- UPDATE works SET images = ARRAY[file_url] WHERE file_url IS NOT NULL AND (images IS NULL OR images = '{}');
-- UPDATE certificates SET images = ARRAY[file_url] WHERE file_url IS NOT NULL AND (images IS NULL OR images = '{}');
