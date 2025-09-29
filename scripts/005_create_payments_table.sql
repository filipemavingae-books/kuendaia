-- Create payments table for tracking transactions
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  amount decimal(10, 2) not null,
  currency text default 'BRL',
  status text not null check (status in ('pending', 'completed', 'failed', 'refunded')),
  transaction_id text unique,
  plan_type text not null check (plan_type in ('free', 'pro')),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.payments enable row level security;

-- RLS Policies for payments
create policy "Users can view their own payments"
  on public.payments for select
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists payments_user_id_idx on public.payments(user_id);
create index if not exists payments_created_at_idx on public.payments(created_at desc);
