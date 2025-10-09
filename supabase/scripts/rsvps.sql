-- Table: public.rsvps

-- DROP TABLE IF EXISTS public.rsvps;

CREATE TABLE IF NOT EXISTS public.rsvps
(
    id uuid NOT NULL,
    "eventId" uuid NOT NULL,
    "userId" uuid,
    email character varying(255) COLLATE pg_catalog."default",
    phone character varying(255) COLLATE pg_catalog."default",
    "addedToCalendar" boolean DEFAULT false,
    "reminderSent30" boolean DEFAULT false,
    "reminderSent10" boolean DEFAULT false,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT rsvps_pkey PRIMARY KEY (id),
    CONSTRAINT "rsvps_eventId_fkey" FOREIGN KEY ("eventId")
        REFERENCES public."Events" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT "rsvps_userId_fkey" FOREIGN KEY ("userId")
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE SET NULL
)

