alter table public.products
  add column size text check (char_length(size) <= 20);
