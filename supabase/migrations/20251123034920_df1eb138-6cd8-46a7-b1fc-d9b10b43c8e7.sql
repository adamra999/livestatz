-- Add new columns for event wizard data to Events table

-- Event Details
ALTER TABLE public."Events"
ADD COLUMN IF NOT EXISTS "coverImage" text,
ADD COLUMN IF NOT EXISTS "duration" text;

-- Platform Details (store as JSONB array)
ALTER TABLE public."Events"
ADD COLUMN IF NOT EXISTS "selectedPlatforms" jsonb DEFAULT '[]'::jsonb;

-- RSVP Settings
ALTER TABLE public."Events"
ADD COLUMN IF NOT EXISTS "maxAttendees" integer,
ADD COLUMN IF NOT EXISTS "hasMaxAttendees" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "reminder24h" boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS "reminder1h" boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS "reminderLive" boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS "requireEmail" boolean DEFAULT true;

-- Create enum type for calendar options
DO $$ BEGIN
    CREATE TYPE calendar_option AS ENUM ('auto', 'ask', 'none');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public."Events"
ADD COLUMN IF NOT EXISTS "calendarOption" calendar_option DEFAULT 'auto';

-- Create enum type for visibility options
DO $$ BEGIN
    CREATE TYPE event_visibility AS ENUM ('public', 'followers', 'private');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

ALTER TABLE public."Events"
ADD COLUMN IF NOT EXISTS "visibility" event_visibility DEFAULT 'public';

-- Monetization Settings
ALTER TABLE public."Events"
ADD COLUMN IF NOT EXISTS "acceptTips" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "paymentMethod" text,
ADD COLUMN IF NOT EXISTS "paymentHandle" text;

-- Add comments for documentation
COMMENT ON COLUMN public."Events"."coverImage" IS 'URL to the event cover image stored in Supabase Storage';
COMMENT ON COLUMN public."Events"."duration" IS 'Expected duration of the event (e.g., "60 min", "2 hours")';
COMMENT ON COLUMN public."Events"."selectedPlatforms" IS 'Array of platform objects with platform name, profile URL, scheduled link, etc.';
COMMENT ON COLUMN public."Events"."maxAttendees" IS 'Maximum number of attendees allowed (null = unlimited)';
COMMENT ON COLUMN public."Events"."reminder24h" IS 'Send reminder 24 hours before event';
COMMENT ON COLUMN public."Events"."reminder1h" IS 'Send reminder 1 hour before event';
COMMENT ON COLUMN public."Events"."reminderLive" IS 'Send notification when event goes live';
COMMENT ON COLUMN public."Events"."calendarOption" IS 'How to handle calendar invites: auto-send, ask, or none';
COMMENT ON COLUMN public."Events"."visibility" IS 'Event visibility: public, followers only, or private (invite-only)';
COMMENT ON COLUMN public."Events"."acceptTips" IS 'Whether the event accepts tips/donations';
COMMENT ON COLUMN public."Events"."paymentMethod" IS 'Payment method for tips (e.g., cashapp, paypal, venmo)';
COMMENT ON COLUMN public."Events"."paymentHandle" IS 'Payment handle/username for receiving tips';