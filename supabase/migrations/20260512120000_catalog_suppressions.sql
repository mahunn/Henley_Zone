-- Built-in (seed) product IDs live in code; deleting only removes a DB row and would show the seed again.
-- Rows here hide a product id from the merged catalog until removed.
create table if not exists catalog_suppressions (
  product_id text primary key,
  created_at timestamptz not null default now()
);
