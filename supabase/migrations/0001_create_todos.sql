-- Creates the todos table with public read access via Row Level Security.
create table if not exists public.todos (
  id bigint generated always as identity primary key,
  name text not null
);

alter table public.todos enable row level security;

create policy "Public can read todos" on public.todos for select to anon, authenticated using (true);

insert into public.todos (name) values ('Set up Supabase'), ('Build the console'), ('Ship it');
