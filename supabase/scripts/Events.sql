-- Table: public.Events

-- DROP TABLE IF EXISTS public."Events";

create table if not exists public."Events" (
  id uuid not null,
  url character varying(255) not null,
  title character varying(255) not null,
  description text null,
  "dateTime" timestamp with time zone not null,
  link character varying(255) not null,
  platform character varying(255) not null,
  "isPublic" boolean null default true,
  "isPaid" boolean null default false,
  "price" character varying(255) null, -- ✅ added for request object
  "accessDescription" text null,
  "offerWithSubscription" boolean null default false,
  "includeReplay" boolean null default false,
  "includePerks" boolean null default false, -- ✅ added for request object
  "perkDescription" text null,
  "selectedFanGroups" jsonb null default '[]'::jsonb,
  "inviteEmails" jsonb null default '[]'::jsonb,
  tags jsonb null default '[]'::jsonb,
  "createdAt" timestamp with time zone not null,
  "updatedAt" timestamp with time zone not null,
  "influencerId" uuid null,
  "attendeeBenefits" jsonb null default '[]'::jsonb,
  constraint "Events_pkey" primary key (id),
  constraint "Events_influencerId_fkey" foreign KEY ("influencerId")
    references "Influencers" (id)
    on update cascade
    on delete set null
);
