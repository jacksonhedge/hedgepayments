-- Hedge Research inquiry form submissions (/research → /api/research-inquiry)
create table if not exists public.research_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text not null,
  title text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'contacted', 'scoped', 'won', 'lost')),
  created_at timestamptz not null default now()
);

alter table public.research_inquiries enable row level security;
-- Writes happen server-side with the service key; no anon policies.
