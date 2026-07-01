create table if not exists checkout_leads (
  id text primary key, -- client-generated session lead ID
  customer_name text,
  phone text,
  address text,
  note text,
  items jsonb not null default '[]'::jsonb,
  subtotal integer not null default 0,
  delivery_fee integer not null default 0,
  total integer not null default 0,
  delivery_area text,
  status text not null default 'abandoned' check (status in ('abandoned', 'converted')),
  converted_order_id text references orders(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_checkout_leads_created_at on checkout_leads(created_at desc);
create index if not exists idx_checkout_leads_status on checkout_leads(status);
