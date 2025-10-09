-- Table: public.notifications

-- DROP TABLE IF EXISTS public.notifications;

CREATE TABLE IF NOT EXISTS public.notifications
(
    id uuid NOT NULL,
    "eventId" uuid NOT NULL,
    type character varying(255) COLLATE pg_catalog."default",
    payload jsonb,
    "sentAt" timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT "notifications_eventId_fkey" FOREIGN KEY ("eventId")
        REFERENCES public."Events" (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE CASCADE
)
