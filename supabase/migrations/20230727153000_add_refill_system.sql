-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add refill_eligible column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS refill_eligible BOOLEAN DEFAULT false;

-- Create refill_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.refill_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES services(id) ON DELETE CASCADE,
  screenshot_url TEXT NOT NULL,
  current_count INTEGER NOT NULL,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
  admin_notes TEXT,
  processed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comments for documentation
COMMENT ON TABLE public.refill_requests IS 'Tracks refill requests for services that support refills';
COMMENT ON COLUMN public.refill_requests.current_count IS 'The current count/followers shown in the screenshot';
COMMENT ON COLUMN public.refill_requests.status IS 'Current status of the refill request';
COMMENT ON COLUMN public.refill_requests.admin_notes IS 'Optional notes from admin about the request';

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_refill_requests_user_id ON public.refill_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_refill_requests_order_id ON public.refill_requests(order_id);
CREATE INDEX IF NOT EXISTS idx_refill_requests_service_id ON public.refill_requests(service_id);
CREATE INDEX IF NOT EXISTS idx_refill_requests_status ON public.refill_requests(status);

-- Set up RLS (Row Level Security) policies
ALTER TABLE public.refill_requests ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to see their own refill requests
CREATE POLICY "Users can view their own refill requests"
ON public.refill_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Policy to allow users to create refill requests
CREATE POLICY "Users can create refill requests"
ON public.refill_requests
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy to allow admins full access
CREATE POLICY "Admins have full access to refill requests"
ON public.refill_requests
USING (EXISTS (
  SELECT 1 FROM auth.users
  WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
));

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply the trigger to the refill_requests table
DROP TRIGGER IF EXISTS update_refill_requests_updated_at ON public.refill_requests;
CREATE TRIGGER update_refill_requests_updated_at
BEFORE UPDATE ON public.refill_requests
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
