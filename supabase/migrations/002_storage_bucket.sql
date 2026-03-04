-- Create the project-media storage bucket for uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-media', 'project-media', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to read (public bucket for serving images)
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'project-media');

-- Allow service-role (admin API routes) to upload
CREATE POLICY "Service role upload" ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'project-media');

-- Allow service-role to update (re-upload / replace)
CREATE POLICY "Service role update" ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'project-media');

-- Allow service-role to delete
CREATE POLICY "Service role delete" ON storage.objects
  FOR DELETE
  USING (bucket_id = 'project-media');
