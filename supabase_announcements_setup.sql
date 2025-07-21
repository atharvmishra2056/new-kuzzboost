-- SQL script to create announcements table and set up RLS policies
-- Run this in your Supabase SQL Editor

-- Create announcements table
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS handle_announcements_updated_at ON public.announcements;
CREATE TRIGGER handle_announcements_updated_at
    BEFORE UPDATE ON public.announcements
    FOR EACH ROW
    EXECUTE PROCEDURE public.handle_updated_at();

-- Enable RLS
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Allow everyone to read active announcements
CREATE POLICY "Anyone can view active announcements" ON public.announcements
    FOR SELECT USING (is_active = true);

-- Allow admins to do everything
CREATE POLICY "Admins can manage announcements" ON public.announcements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Grant permissions
GRANT ALL ON public.announcements TO authenticated;
GRANT SELECT ON public.announcements TO anon;

-- Insert some sample data (optional)
INSERT INTO public.announcements (title, description, is_active) VALUES 
('Welcome to KuzzBoost!', 'Get started with our amazing services and boost your social media presence.', true),
('New Features Available', 'Check out our latest updates and improvements to serve you better.', true)
ON CONFLICT (id) DO NOTHING;