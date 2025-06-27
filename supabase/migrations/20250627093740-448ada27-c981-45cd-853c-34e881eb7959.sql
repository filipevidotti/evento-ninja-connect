
-- Create disputes table
CREATE TABLE public.disputes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id),
  complainant_id UUID NOT NULL,
  defendant_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  priority TEXT NOT NULL DEFAULT 'medium',
  admin_id UUID,
  resolution TEXT,
  resolution_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create dispute messages table for chat/timeline
CREATE TABLE public.dispute_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  dispute_id UUID REFERENCES public.disputes(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  sender_type TEXT NOT NULL, -- 'admin', 'complainant', 'defendant'
  message TEXT NOT NULL,
  message_type TEXT NOT NULL DEFAULT 'text', -- 'text', 'evidence', 'resolution'
  attachments TEXT[], -- URLs to uploaded files
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create financial transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id UUID REFERENCES public.events(id),
  user_id UUID NOT NULL,
  type TEXT NOT NULL, -- 'payment', 'commission', 'refund'
  amount DECIMAL(10,2) NOT NULL,
  commission_rate DECIMAL(5,2),
  commission_amount DECIMAL(10,2),
  net_amount DECIMAL(10,2),
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'failed', 'disputed'
  payment_method TEXT,
  stripe_payment_id TEXT,
  description TEXT,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create platform settings table for commission rates
CREATE TABLE public.platform_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default commission rates
INSERT INTO public.platform_settings (setting_key, setting_value, description) VALUES
('default_commission_rate', '10.0', 'Default commission rate percentage'),
('freelancer_commission_rate', '8.0', 'Commission rate for freelancer events'),
('producer_commission_rate', '12.0', 'Commission rate for producer events');

-- Enable RLS
ALTER TABLE public.disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dispute_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies (Admin access for now - can be refined later)
CREATE POLICY "Admin access to disputes" ON public.disputes FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin access to dispute messages" ON public.dispute_messages FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin access to transactions" ON public.transactions FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin access to platform settings" ON public.platform_settings FOR ALL TO authenticated USING (true);
