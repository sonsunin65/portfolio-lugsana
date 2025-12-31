-- Enable RLS on storage.objects is NOT necessary as it is enabled by default.
-- Skipping ALTER TABLE to avoid permission errors. 
-- However, running this might fail if it exists. Ideally, create via Dashboard. 
-- We will focus on POLICIES which are the cause of the error.)

-- POLICY: Allow Public Read Access
-- This allows anyone to view the images (for the public website)
DROP POLICY IF EXISTS "Give public access to pa-images" ON storage.objects;
CREATE POLICY "Give public access to pa-images"
ON storage.objects FOR SELECT
USING ( bucket_id = 'pa-images' );

-- POLICY: Allow Authenticated Uploads
-- This allows logged-in users (Admin) to upload files
DROP POLICY IF EXISTS "Allow authenticated uploads to pa-images" ON storage.objects;
CREATE POLICY "Allow authenticated uploads to pa-images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'pa-images' );

-- POLICY: Allow Authenticated Update/Delete
-- This allows logged-in users to replace or delete files
DROP POLICY IF EXISTS "Allow authenticated update to pa-images" ON storage.objects;
CREATE POLICY "Allow authenticated update to pa-images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'pa-images' );

DROP POLICY IF EXISTS "Allow authenticated delete to pa-images" ON storage.objects;
CREATE POLICY "Allow authenticated delete to pa-images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'pa-images' );
