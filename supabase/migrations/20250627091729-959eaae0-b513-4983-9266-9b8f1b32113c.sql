
-- Add missing columns to user_profiles table
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS courses text[],
ADD COLUMN IF NOT EXISTS other_knowledge text;
