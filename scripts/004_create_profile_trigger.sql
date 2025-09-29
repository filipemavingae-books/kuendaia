-- Create function to auto-create profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, username, email_or_phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', 'User'),
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.email, new.raw_user_meta_data ->> 'email_or_phone', '')
  )
  on conflict (id) do nothing;

  -- Create default free subscription
  insert into public.subscriptions (user_id, plan_type, status)
  values (new.id, 'free', 'active')
  on conflict do nothing;

  return new;
end;
$$;

-- Drop trigger if exists and create new one
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
