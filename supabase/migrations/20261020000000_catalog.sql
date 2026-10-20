create type public.product_line as enum ('streetwear', 'joyeria');
create type public.product_status as enum ('available', 'soon', 'sold_out');

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admins enable row level security;

create policy "admins_read_self" on public.admins
  for select to authenticated
  using (user_id = (select auth.uid()));

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = (select auth.uid()));
$$;

revoke execute on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  line public.product_line not null,
  category text not null check (char_length(category) between 1 and 40),
  name text not null check (char_length(name) between 1 and 80),
  variant text check (char_length(variant) <= 80),
  description text check (char_length(description) <= 500),
  price integer not null default 0 check (price >= 0),
  images text[] not null default '{}' check (cardinality(images) <= 6),
  edition integer not null default 1 check (edition between 1 and 9999),
  status public.product_status not null default 'soon',
  position integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_line_category_position_idx
  on public.products (line, category, position);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_touch_updated_at
  before update on public.products
  for each row execute function public.touch_updated_at();

alter table public.products enable row level security;

grant select on public.products to anon, authenticated;
grant insert, update, delete on public.products to authenticated;
grant select on public.admins to authenticated;

create policy "products_public_read" on public.products
  for select to anon, authenticated
  using (true);

create policy "products_admin_insert" on public.products
  for insert to authenticated
  with check ((select public.is_admin()));

create policy "products_admin_update" on public.products
  for update to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "products_admin_delete" on public.products
  for delete to authenticated
  using ((select public.is_admin()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('products', 'products', true, 2097152, array['image/webp', 'image/jpeg', 'image/png'])
on conflict (id) do nothing;

create policy "product_images_admin_select" on storage.objects
  for select to authenticated
  using (bucket_id = 'products' and (select public.is_admin()));

create policy "product_images_admin_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'products' and (select public.is_admin()));

create policy "product_images_admin_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'products' and (select public.is_admin()))
  with check (bucket_id = 'products' and (select public.is_admin()));

create policy "product_images_admin_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'products' and (select public.is_admin()));
