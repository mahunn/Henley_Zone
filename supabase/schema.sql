create table if not exists products (
  id text primary key,
  slug text unique not null,
  name text not null,
  description text not null,
  price integer not null,
  stock integer not null default 0,
  image_url text not null,
  category text not null,
  created_at timestamptz not null default now()
);

create table if not exists orders (
  id text primary key,
  customer_name text not null,
  phone text not null,
  address text not null,
  note text,
  subtotal integer not null,
  delivery_fee integer not null default 0,
  total integer not null,
  payment_method text not null check (payment_method in ('COD')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'delivered', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id bigint generated always as identity primary key,
  order_id text not null references orders(id) on delete cascade,
  product_id text not null,
  product_name text not null,
  unit_price integer not null,
  quantity integer not null check (quantity > 0)
);

create index if not exists idx_orders_created_at on orders(created_at desc);
create index if not exists idx_order_items_order_id on order_items(order_id);

alter table orders drop constraint if exists orders_status_check;
alter table orders
  add constraint orders_status_check
  check (status in ('pending', 'confirmed', 'delivered', 'cancelled'));

