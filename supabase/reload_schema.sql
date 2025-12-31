-- Run this command to force Supabase (PostgREST) to reload its schema cache
-- This is useful when you've added columns but the API doesn't see them yet.

NOTIFY pgrst, 'reload schema';
