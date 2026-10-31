create table if not exists public.visitor_logs (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  country text,
  region text,
  city text
);

alter table public.visitor_logs enable row level security;

-- No anon/authenticated policies: only the server-side service role can access this table.
