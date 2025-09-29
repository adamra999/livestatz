
CREATE TABLE IF NOT EXISTS public."Influencers"
(
    id uuid NOT NULL,
    name character varying(255) COLLATE pg_catalog."default" NOT NULL,
    email character varying(255) COLLATE pg_catalog."default" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    CONSTRAINT "Influencers_pkey" PRIMARY KEY (id),
    CONSTRAINT "Influencers_email_key" UNIQUE (email)
)