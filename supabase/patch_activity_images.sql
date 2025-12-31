-- Add images column to activities table
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::JSONB;

-- Update RLS policies (usually not needed for new columns if policy is on table, but good practice to verify)
-- Existing policies are on the table level, so they should cover this new column automatically.
