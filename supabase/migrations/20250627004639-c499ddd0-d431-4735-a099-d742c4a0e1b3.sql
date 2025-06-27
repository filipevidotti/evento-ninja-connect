
-- Create subscribers table to track subscription information
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  stripe_customer_id TEXT,
  subscribed BOOLEAN NOT NULL DEFAULT false,
  subscription_tier TEXT,
  subscription_end TIMESTAMPTZ,
  user_type TEXT CHECK (user_type IN ('freelancer', 'producer')) NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own subscription info
CREATE POLICY "select_own_subscription" ON public.subscribers
FOR SELECT
USING (user_id = auth.uid() OR email = auth.email());

-- Create policy for edge functions to update subscription info
CREATE POLICY "update_own_subscription" ON public.subscribers
FOR UPDATE
USING (true);

-- Create policy for edge functions to insert subscription info
CREATE POLICY "insert_subscription" ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Add subscription limits table
CREATE TABLE public.subscription_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_type TEXT CHECK (user_type IN ('freelancer', 'producer')) NOT NULL,
  subscription_tier TEXT NOT NULL DEFAULT 'free',
  events_created INTEGER DEFAULT 0,
  applications_made INTEGER DEFAULT 0,
  monthly_limit_events INTEGER,
  monthly_limit_applications INTEGER,
  reset_date TIMESTAMPTZ DEFAULT (date_trunc('month', now()) + interval '1 month'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on subscription_limits
ALTER TABLE public.subscription_limits ENABLE ROW LEVEL SECURITY;

-- Create policies for subscription_limits
CREATE POLICY "select_own_limits" ON public.subscription_limits
FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "update_own_limits" ON public.subscription_limits
FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "insert_own_limits" ON public.subscription_limits
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Function to initialize subscription limits for new users
CREATE OR REPLACE FUNCTION public.initialize_subscription_limits()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Get user type from raw_user_meta_data
  INSERT INTO public.subscription_limits (
    user_id,
    user_type,
    subscription_tier,
    monthly_limit_events,
    monthly_limit_applications
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'type', 'freelancer'),
    'free',
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'type', 'freelancer') = 'producer' THEN 1
      ELSE NULL
    END,
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'type', 'freelancer') = 'freelancer' THEN 3
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$;

-- Create trigger to initialize limits on user creation
CREATE TRIGGER on_auth_user_created_limits
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.initialize_subscription_limits();
