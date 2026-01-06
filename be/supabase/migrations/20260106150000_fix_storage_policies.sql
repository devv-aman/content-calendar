-- Migration: Fix storage policies for content-calendar-attachments bucket
-- Description: Creates permissive policies for backend API access

-- Drop any existing restrictive policies first
DROP POLICY IF EXISTS "Users can upload files to their folder" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own files" ON storage.objects;
DROP POLICY IF EXISTS "Public read access for attachments" ON storage.objects;
DROP POLICY IF EXISTS "Service role full access" ON storage.objects;
DROP POLICY IF EXISTS "Allow all operations for service role" ON storage.objects;
DROP POLICY IF EXISTS "Allow all uploads" ON storage.objects;
DROP POLICY IF EXISTS "Allow all updates" ON storage.objects;
DROP POLICY IF EXISTS "Allow all deletes" ON storage.objects;

-- Create permissive policies (backend handles authorization via JWT)

-- Policy: Allow anyone to read files (public access for file URLs)
CREATE POLICY "Public read access for attachments"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'content-calendar-attachments');

-- Policy: Allow all inserts
CREATE POLICY "Allow all uploads"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'content-calendar-attachments');

-- Policy: Allow all updates
CREATE POLICY "Allow all updates"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'content-calendar-attachments');

-- Policy: Allow all deletes
CREATE POLICY "Allow all deletes"
ON storage.objects
FOR DELETE
TO public
USING (bucket_id = 'content-calendar-attachments');

