insert into public.products (line, category, name, price, edition, status, position)
select c.line::public.product_line, c.category, c.label || ' N°' || lpad(i::text, 2, '0'), 0, c.edition, 'soon', i
from (values
  ('streetwear', 'camisetas', 'Camiseta', 30, 8),
  ('streetwear', 'hoodies', 'Hoodie', 20, 5),
  ('streetwear', 'clasicos', 'Clásico', 30, 4),
  ('streetwear', 'jeans', 'Jean', 20, 4),
  ('joyeria', 'anillos', 'Anillo', 15, 3),
  ('joyeria', 'collares', 'Collar', 15, 3),
  ('joyeria', 'aretes', 'Aretes', 15, 3),
  ('joyeria', 'pulseras', 'Pulsera', 15, 3)
) as c(line, category, label, edition, total)
cross join lateral generate_series(1, c.total) as i
where not exists (select 1 from public.products);
