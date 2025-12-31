-- Run this script in Supabase SQL Editor to fix the "Could not find the 'external_links' column" error
-- This will add the missing column without deleting your existing data.

ALTER TABLE public.pa_works 
ADD COLUMN IF NOT EXISTS external_links JSONB DEFAULT '[]'::jsonb;

-- Update the comment for clarity
COMMENT ON COLUMN public.pa_works.external_links IS 'Array of { title: string, url: string }';
