-- Drop existing policies
DROP POLICY IF EXISTS "Users can view RSVPs for their events" ON public.rsvps;
DROP POLICY IF EXISTS "Users can create RSVPs for their fans" ON public.rsvps;
DROP POLICY IF EXISTS "Users can update RSVPs for their events or their fans" ON public.rsvps;
DROP POLICY IF EXISTS "Users can delete RSVPs for their fans" ON public.rsvps;

-- Create security definer function to check if user is event owner
CREATE OR REPLACE FUNCTION public.is_event_owner(event_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public."Events" e
    JOIN public."Influencers" i ON e."influencerId" = i.id
    WHERE e.id = event_uuid 
    AND i.email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );
$$;

-- Recreate RLS policies without direct auth.users access
CREATE POLICY "Users can view RSVPs for their events"
ON public.rsvps
FOR SELECT
USING (
  public.is_event_owner(event_id)
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
  public.is_event_owner(event_id)
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