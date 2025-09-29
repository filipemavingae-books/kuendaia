-- Create subscriptions table for user plans
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_type text not null check (plan_type in ('free', 'pro')),
  status text not null check (status in ('active', 'inactive', 'expired')),
  created_at timestamp with time zone default now(),
  expires_at timestamp with time zone
);

-- Enable Row Level Security
alter table public.subscriptions enable row level security;

-- RLS Policies for subscriptions
create policy "Users can view their own subscriptions"
  on public.subscriptions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own subscriptions"
  on public.subscriptions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own subscriptions"
  on public.subscriptions for update
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists subscriptions_user_id_idx on public.subscriptions(user_id);
