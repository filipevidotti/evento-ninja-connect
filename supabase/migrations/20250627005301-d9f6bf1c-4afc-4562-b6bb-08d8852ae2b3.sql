
-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  produtor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  data TIMESTAMPTZ NOT NULL,
  local TEXT NOT NULL,
  descricao TEXT,
  status TEXT CHECK (status IN ('open', 'closed', 'completed')) DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create functions table (event functions/roles)
CREATE TABLE public.functions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evento_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  cargo TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  quantidade INTEGER NOT NULL,
  requirements TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  function_id UUID REFERENCES public.functions(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pendente', 'aprovado', 'recusado')) DEFAULT 'pendente',
  applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewed_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nota INTEGER CHECK (nota >= 1 AND nota <= 5) NOT NULL,
  comentario TEXT,
  tipo TEXT CHECK (tipo IN ('evento', 'usuario')) NOT NULL,
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_profiles table for additional user data
CREATE TABLE public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  city TEXT,
  phone TEXT,
  avatar_url TEXT,
  skills TEXT[],
  description TEXT,
  user_type TEXT CHECK (user_type IN ('freelancer', 'producer')) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.functions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for events
CREATE POLICY "Anyone can view open events" ON public.events
FOR SELECT USING (status = 'open');

CREATE POLICY "Producers can manage their events" ON public.events
FOR ALL USING (produtor_id = auth.uid());

-- RLS Policies for functions
CREATE POLICY "Anyone can view functions of open events" ON public.functions
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = functions.evento_id AND events.status = 'open'
  )
);

CREATE POLICY "Event owners can manage functions" ON public.functions
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.events 
    WHERE events.id = functions.evento_id AND events.produtor_id = auth.uid()
  )
);

-- RLS Policies for applications
CREATE POLICY "Users can view their own applications" ON public.applications
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create applications" ON public.applications
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Event owners can view applications for their events" ON public.applications
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.functions f
    JOIN public.events e ON f.evento_id = e.id
    WHERE f.id = applications.function_id AND e.produtor_id = auth.uid()
  )
);

CREATE POLICY "Event owners can update applications for their events" ON public.applications
FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.functions f
    JOIN public.events e ON f.evento_id = e.id
    WHERE f.id = applications.function_id AND e.produtor_id = auth.uid()
  )
);

-- RLS Policies for reviews
CREATE POLICY "Anyone can view reviews" ON public.reviews
FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON public.reviews
FOR INSERT WITH CHECK (reviewer_id = auth.uid());

-- RLS Policies for user_profiles
CREATE POLICY "Anyone can view profiles" ON public.user_profiles
FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
FOR ALL USING (id = auth.uid());

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_profile()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    name,
    city,
    user_type,
    skills
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'city', ''),
    COALESCE(NEW.raw_user_meta_data->>'type', 'freelancer'),
    CASE 
      WHEN COALESCE(NEW.raw_user_meta_data->>'type', 'freelancer') = 'freelancer' 
      THEN ARRAY[]::TEXT[]
      ELSE NULL
    END
  );
  RETURN NEW;
END;
$$;

-- Trigger to create profile on user creation
CREATE TRIGGER on_auth_user_created_profile
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_profile();
