
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS
alter table public.messages enable row level security;

-- Allow anyone (public) to insert messages (contact form)
create policy "Allow public to insert messages" on public.messages for insert with check (true);

-- Allow only authenticated users (admin) to read/update/delete messages
create policy "Allow authenticated to select messages" on public.messages for select using (auth.role() = 'authenticated');
create policy "Allow authenticated to update messages" on public.messages for update using (auth.role() = 'authenticated');
create policy "Allow authenticated to delete messages" on public.messages for delete using (auth.role() = 'authenticated');
