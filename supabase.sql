create table if not exists public.visitor_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  country text,
  region text,
  city text
);

alter table public.visitor_logs enable row level security;

-- Allow only the server-side service role to access the table through the Data API.
grant usage on schema public to service_role;
grant all on table public.visitor_logs to service_role;

-- No anon/authenticated policies: browser clients cannot read or write visitor logs.
