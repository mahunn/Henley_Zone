# Henley Zone Arif - Business Websites Platform

TypeScript-first starter for three small business websites.

## Current Scope

- Next.js App Router scaffold in TypeScript
- Reusable business config for three business websites
- Store module placeholder for clothing e-commerce flow
- Prepared for COD-only checkout implementation

## Run Locally

1. Install dependencies:
  - `npm install`
2. Start development server:
  - `npm run dev`

## Planned Modules (next)

- Product and category data layer (Supabase)
- Cart and checkout (Cash on Delivery only)
- Order creation API and admin order dashboard
- Reusable branding/content system for 3 businesses

## Implemented in this step

- Checkout now posts orders to `POST /api/orders`
- Orders are persisted to local file store: `data/orders.json`
- Admin orders dashboard available at `/admin/orders`

This local data store is the bridge step before moving to Supabase tables.

## Supabase Migration (implemented)

- Added Supabase adapters for:
  - `GET/POST /api/orders` (orders + order_items tables)
  - `GET /api/products` (products table)
- If Supabase env keys are missing, app automatically falls back to:
  - seed products (`src/data/seed-products.ts`)
  - file-based orders (`data/orders.json`)

### Setup

1. Install dependency:
  - `npm install`
2. Copy env template:
  - copy `.env.example` to `.env.local`
3. Add values in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `ADMIN_DASHBOARD_USERNAME` (used for `/admin/login`)
  - `ADMIN_DASHBOARD_PASSWORD` (used for `/admin/login`)
  - `ADMIN_SESSION_SECRET` (random long string for cookie signing)
4. Run SQL in Supabase SQL editor:
  - `supabase/schema.sql`

After this, your store and orders run from Supabase automatically.

## Admin Access Protection

- `/admin/orders` is protected by login middleware.
- Login page: `/admin/login`
- Set username/password via `ADMIN_DASHBOARD_USERNAME` and `ADMIN_DASHBOARD_PASSWORD` in `.env.local`.
- Set `ADMIN_SESSION_SECRET` to any long random string.

## Order Status Workflow

- Admin can update COD order status from `/admin/orders`.
- Supported statuses:
  - `pending`
  - `confirmed`
  - `delivered`
  - `cancelled`
- API endpoint:
  - `PATCH /api/orders` with `{ orderId, status }` (admin session required)

If your Supabase `orders` table was created before this update, run the latest `supabase/schema.sql` again to refresh the status check constraint.