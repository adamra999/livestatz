-- Function to auto-update the "updated_at" column
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Table to store additional user information
create table profiles (
  id uuid primary key, -- link to Supabase Auth
  username text unique,
  full_name text,
  avatar_url text,
  email text unique,
  phone text,
  role text default 'user', -- could be 'user', 'admin', 'influencer'
  metadata jsonb,           -- flexible extra data (tags, preferences, etc.)
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Keep updated_at in sync automatically
create trigger update_profiles_updated_at
before update on profiles
for each row
execute function set_updated_at();
