-- Create chat_messages table for storing conversations
create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  message text not null,
  response text,
  model_used text not null check (model_used in ('kuenda-2.5', 'kuenda-4.8-pro')),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.chat_messages enable row level security;

-- RLS Policies for chat_messages
create policy "Users can view their own messages"
  on public.chat_messages for select
  using (auth.uid() = user_id);

create policy "Users can insert their own messages"
  on public.chat_messages for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own messages"
  on public.chat_messages for delete
  using (auth.uid() = user_id);

-- Create index for faster queries
create index if not exists chat_messages_user_id_idx on public.chat_messages(user_id);
create index if not exists chat_messages_created_at_idx on public.chat_messages(created_at desc);
