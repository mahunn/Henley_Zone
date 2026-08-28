-- Add courier fields to orders table
alter table orders add column if not exists courier text;
alter table orders add column if not exists consignment_id text;
alter table orders add column if not exists courier_tracking_url text;
alter table orders add column if not exists courier_status text default 'Pending';
alter table orders add column if not exists courier_delivery_fee numeric;

-- Index for consignment ID lookups
create index if not exists idx_orders_consignment_id on orders(consignment_id);
