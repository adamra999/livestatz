-- Re-enable Row Level Security on all fan-related tables to protect sensitive data
ALTER TABLE public.fans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fan_comments ENABLE ROW LEVEL SECURITY;

-- Verify that existing RLS policies are in place (they should already exist)
-- These policies ensure users can only access their own fan data