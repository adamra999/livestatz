-- Create fans table
CREATE TABLE public.fans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  phone TEXT,
  location TEXT,
  total_spent DECIMAL(10,2) DEFAULT 0,
  events_attended INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  segment TEXT DEFAULT 'casual',
  first_interaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  last_interaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fan_events table
CREATE TABLE public.fan_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fan_id UUID NOT NULL REFERENCES public.fans(id) ON DELETE CASCADE,
  event_id UUID NOT NULL,
  event_name TEXT NOT NULL,
  attendance_status TEXT DEFAULT 'attended',
  ticket_price DECIMAL(10,2) DEFAULT 0,
  attended_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fan_transactions table
CREATE TABLE public.fan_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fan_id UUID NOT NULL REFERENCES public.fans(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  transaction_type TEXT NOT NULL,
  description TEXT,
  transaction_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create fan_comments table
CREATE TABLE public.fan_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fan_id UUID NOT NULL REFERENCES public.fans(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  platform TEXT DEFAULT 'live_stream',
  sentiment TEXT DEFAULT 'neutral',
  commented_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workflows table
CREATE TABLE public.workflows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT NOT NULL,
  target_segment TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create workflow_actions table
CREATE TABLE public.workflow_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workflow_id UUID NOT NULL REFERENCES public.workflows(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  action_data JSONB,
  delay_hours INTEGER DEFAULT 0,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collaborations table
CREATE TABLE public.collaborations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  partner_name TEXT NOT NULL,
  partner_email TEXT,
  partnership_type TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  deal_value DECIMAL(10,2),
  description TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.fans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workflow_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for fans
CREATE POLICY "Users can view their own fans" 
ON public.fans 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fans" 
ON public.fans 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fans" 
ON public.fans 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fans" 
ON public.fans 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for fan_events
CREATE POLICY "Users can view events for their fans" 
ON public.fan_events 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.fans WHERE id = fan_id AND user_id = auth.uid()));

CREATE POLICY "Users can insert events for their fans" 
ON public.fan_events 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.fans WHERE id = fan_id AND user_id = auth.uid()));

CREATE POLICY "Users can update events for their fans" 
ON public.fan_events 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.fans WHERE id = fan_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete events for their fans" 
ON public.fan_events 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.fans WHERE id = fan_id AND user_id = auth.uid()));

-- Create RLS policies for fan_transactions
CREATE POLICY "Users can view transactions for their fans" 
ON public.fan_transactions 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.fans WHERE id = fan_id AND user_id = auth.uid()));

CREATE POLICY "Users can insert transactions for their fans" 
ON public.fan_transactions 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.fans WHERE id = fan_id AND user_id = auth.uid()));

CREATE POLICY "Users can update transactions for their fans" 
ON public.fan_transactions 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.fans WHERE id = fan_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete transactions for their fans" 
ON public.fan_transactions 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.fans WHERE id = fan_id AND user_id = auth.uid()));

-- Create RLS policies for fan_comments
CREATE POLICY "Users can view comments for their fans" 
ON public.fan_comments 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.fans WHERE id = fan_id AND user_id = auth.uid()));

CREATE POLICY "Users can insert comments for their fans" 
ON public.fan_comments 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.fans WHERE id = fan_id AND user_id = auth.uid()));

CREATE POLICY "Users can update comments for their fans" 
ON public.fan_comments 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.fans WHERE id = fan_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete comments for their fans" 
ON public.fan_comments 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.fans WHERE id = fan_id AND user_id = auth.uid()));

-- Create RLS policies for workflows
CREATE POLICY "Users can view their own workflows" 
ON public.workflows 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workflows" 
ON public.workflows 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own workflows" 
ON public.workflows 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workflows" 
ON public.workflows 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for workflow_actions
CREATE POLICY "Users can view actions for their workflows" 
ON public.workflow_actions 
FOR SELECT 
USING (EXISTS (SELECT 1 FROM public.workflows WHERE id = workflow_id AND user_id = auth.uid()));

CREATE POLICY "Users can insert actions for their workflows" 
ON public.workflow_actions 
FOR INSERT 
WITH CHECK (EXISTS (SELECT 1 FROM public.workflows WHERE id = workflow_id AND user_id = auth.uid()));

CREATE POLICY "Users can update actions for their workflows" 
ON public.workflow_actions 
FOR UPDATE 
USING (EXISTS (SELECT 1 FROM public.workflows WHERE id = workflow_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete actions for their workflows" 
ON public.workflow_actions 
FOR DELETE 
USING (EXISTS (SELECT 1 FROM public.workflows WHERE id = workflow_id AND user_id = auth.uid()));

-- Create RLS policies for collaborations
CREATE POLICY "Users can view their own collaborations" 
ON public.collaborations 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own collaborations" 
ON public.collaborations 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own collaborations" 
ON public.collaborations 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own collaborations" 
ON public.collaborations 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_fans_updated_at
BEFORE UPDATE ON public.fans
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workflows_updated_at
BEFORE UPDATE ON public.workflows
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_collaborations_updated_at
BEFORE UPDATE ON public.collaborations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update fan stats
CREATE OR REPLACE FUNCTION public.update_fan_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update total spent
  UPDATE public.fans 
  SET total_spent = (
    SELECT COALESCE(SUM(amount), 0) 
    FROM public.fan_transactions 
    WHERE fan_id = COALESCE(NEW.fan_id, OLD.fan_id)
  ),
  events_attended = (
    SELECT COUNT(*) 
    FROM public.fan_events 
    WHERE fan_id = COALESCE(NEW.fan_id, OLD.fan_id)
  ),
  comments_count = (
    SELECT COUNT(*) 
    FROM public.fan_comments 
    WHERE fan_id = COALESCE(NEW.fan_id, OLD.fan_id)
  ),
  last_interaction_date = now()
  WHERE id = COALESCE(NEW.fan_id, OLD.fan_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers to auto-update fan stats
CREATE TRIGGER update_fan_stats_on_transaction
AFTER INSERT OR UPDATE OR DELETE ON public.fan_transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_fan_stats();

CREATE TRIGGER update_fan_stats_on_event
AFTER INSERT OR UPDATE OR DELETE ON public.fan_events
FOR EACH ROW
EXECUTE FUNCTION public.update_fan_stats();

CREATE TRIGGER update_fan_stats_on_comment
AFTER INSERT OR UPDATE OR DELETE ON public.fan_comments
FOR EACH ROW
EXECUTE FUNCTION public.update_fan_stats();