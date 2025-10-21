-- Drop existing RSVPs table if it exists
DROP TABLE IF EXISTS public.rsvps CASCADE;

-- Create RSVPs table with relations to Events and fans
CREATE TABLE public.rsvps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  event_id uuid NOT NULL,
  fan_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  added_to_calendar boolean DEFAULT false,
  reminder_sent_30 boolean DEFAULT false,
  reminder_sent_10 boolean DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT rsvps_event_id_fkey FOREIGN KEY (event_id)
    REFERENCES public."Events" (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT rsvps_fan_id_fkey FOREIGN KEY (fan_id)
    REFERENCES public.fans (id)
    ON UPDATE CASCADE
    ON DELETE CASCADE,
  CONSTRAINT unique_event_fan UNIQUE (event_id, fan_id)
);

-- Enable RLS
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- RLS Policies for RSVPs
CREATE POLICY "Users can view RSVPs for their events"
ON public.rsvps
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public."Events" e
    WHERE e.id = rsvps.event_id 
    AND e."influencerId" = (
      SELECT id FROM public."Influencers" 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
  OR
  EXISTS (
    SELECT 1 FROM public.fans f
    WHERE f.id = rsvps.fan_id AND f.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create RSVPs for their fans"
ON public.rsvps
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.fans
    WHERE id = rsvps.fan_id AND user_id = auth.uid()
  )
);

CREATE POLICY "Users can update RSVPs for their events or their fans"
ON public.rsvps
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public."Events" e
    WHERE e.id = rsvps.event_id 
    AND e."influencerId" = (
      SELECT id FROM public."Influencers" 
      WHERE email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
  OR
  EXISTS (
    SELECT 1 FROM public.fans f
    WHERE f.id = rsvps.fan_id AND f.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete RSVPs for their fans"
ON public.rsvps
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.fans
    WHERE id = rsvps.fan_id AND user_id = auth.uid()
  )
);

-- Trigger for updated_at
CREATE TRIGGER update_rsvps_updated_at
BEFORE UPDATE ON public.rsvps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();