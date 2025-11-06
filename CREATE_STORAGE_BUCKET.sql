-- Create the storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies to allow uploads
CREATE POLICY "Allow public read access" 
ON storage.objects FOR SELECT 
TO public 
USING (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated uploads" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated updates" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated deletes" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'product-images');
