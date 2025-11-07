-- Add targetAudience column to Events table
ALTER TABLE public."Events"
ADD COLUMN "targetAudience" integer NULL DEFAULT 50;