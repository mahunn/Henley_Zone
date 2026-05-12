-- Optional: remove old western demo rows from `products` (same items hidden in app if you skip this).
-- Run in Supabase SQL Editor when you want them deleted from the database.
delete from products
where lower(trim(name)) in (
  'classic polo shirt',
  'slim fit chino',
  'summer linen shirt'
);
