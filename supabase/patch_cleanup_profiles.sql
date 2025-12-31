-- Clean up duplicate profiles, keeping the latest one
DELETE FROM public.profiles
WHERE id NOT IN (
    SELECT id
    FROM public.profiles
    ORDER BY created_at DESC
    LIMIT 1
);

-- Note: We do not add a unique constraint here because the logic now handles it via .limit(1), 
-- but running this ensures the DB is clean.
