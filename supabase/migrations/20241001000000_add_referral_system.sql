-- Add referral system

-- Add columns to profiles
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS referral_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS credits NUMERIC DEFAULT 0;

-- Create referrals table
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  referred_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(referrer_id, referred_id)
);

-- Enable RLS on referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

-- Policies for referrals
CREATE POLICY "Users can view their own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);

-- Create index on referral_code
CREATE INDEX IF NOT EXISTS idx_profiles_referral_code ON public.profiles(referral_code);

-- Update handle_new_user function to handle referrals
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ref_code TEXT := NEW.raw_user_meta_data->>'referral_code';
  referrer_uuid UUID;
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );

  IF ref_code IS NOT NULL THEN
    SELECT user_id INTO referrer_uuid
    FROM public.profiles
    WHERE referral_code = ref_code
    LIMIT 1;

    IF referrer_uuid IS NOT NULL THEN
      INSERT INTO public.referrals (referrer_id, referred_id)
      VALUES (referrer_uuid, NEW.id);
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
