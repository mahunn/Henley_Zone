-- Optional variants for storefront + admin-created products
alter table products add column if not exists colors_json jsonb default '[]'::jsonb;
alter table products add column if not exists sizes_json jsonb default '[]'::jsonb;
