# Henley Zone Architecture, Deployment & Memory Guide (A-Z)

This document contains the complete technical architecture, configuration details, root-cause troubleshooting log, and step-by-step cPanel deployment protocol for the **Henley Zone** e-commerce platform.

---

## 1. System Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19 & TypeScript.
- **Server Entry**: Custom Node HTTP server (`server.js`) running on Phusion Passenger (cPanel Node Selector, Node.js v18+ / v22+).
- **Database & Auth**: Supabase (PostgreSQL) for store data + Custom HMAC Signed Cookie Authentication for Admin Panel.
- **Caching**: Local memory cache fallback (`cache-handler.js`) + optional Redis integration.
- **Image Optimization**: `unoptimized: true` in `next.config.ts` (tailored for cPanel static serving / Cloudinary / Supabase).

---

## 2. Root Cause Analysis: What Caused the 500 Internal Server Error & How It Was Fixed

### Issue 1: `server.js` Defaulted to Development Mode (`dev: true`)
- **Problem**: On cPanel Node.js Selector, `process.env.NODE_ENV` is empty by default. `const dev = process.env.NODE_ENV !== "production"` evaluated to `true`, causing Next.js to start in **Development Mode** on cPanel. Development mode attempted on-demand Webpack/Turbopack compilation on shared hosting, exceeding RAM/CPU limits and failing with 500 Internal Server Error.
- **Fix**: Updated `server.js` to explicitly force `process.env.NODE_ENV = process.env.NODE_ENV || "production"`.

### Issue 2: `cache-handler.js` Crashed on Unset Redis URL (`TypeError: Invalid pathname`)
- **Problem**: `cache-handler.js` attempted to initialize a Redis client connection to `redis://127.0.0.1:6379` when `REDIS_URL` was empty. Node's `redis` client threw `TypeError: Invalid pathname` inside the `CacheHandler` constructor on every page request, crashing Next.js.
- **Fix**: Updated `cache-handler.js` so it only initializes Redis if `process.env.REDIS_URL` is explicitly non-empty. Otherwise, it uses a 100% safe in-memory `Map` fallback with zero Redis connection attempts.

### Issue 3: Proxy Redirect Bug in `middleware.ts`
- **Problem**: `middleware.ts` used `new URL("/login?type=admin", request.url)`. Behind cPanel's internal Phusion Passenger reverse proxy, `request.url` resolved to local host/IP (`http://127.0.0.1:3000`), breaking redirects.
- **Fix**: Updated `middleware.ts` to use `request.nextUrl.clone()` which preserves domain headers correctly behind proxies.

### Issue 4: cPanel File Permissions (`EACCES: permission denied`)
- **Problem**: Extracting zip files on cPanel set directory permissions on `.next/static` or `.next/server` to restricted (`0700`), preventing Passenger from reading `.next/BUILD_ID` and static chunks.
- **Fix**: Ran `fix-permissions.php` (sets directories to `0755` and files to `0644`).

### Issue 5: Oversized Upload Packages (495 MB)
- **Problem**: Zipping `.next` without excluding `.next/cache` created a 495 MB zip file that timed out during cPanel upload.
- **Fix**: Created `scripts/make-small-zip.ps1` which excludes `.next/cache` and `.next/dev`, producing a lightweight **17.63 MB** zip (`cpanel-deploy-small.zip`).

---

## 3. Standard cPanel Deployment Protocol (Step-by-Step)

Follow these exact steps for all future updates:

### Step 1: Build & Zip Locally
Run the following commands in the project directory:
```bash
npm run build
powershell -ExecutionPolicy Bypass -File scripts/make-small-zip.ps1
```
This generates `cpanel-deploy-small.zip` (~17 MB) in the project root.

### Step 2: Upload to cPanel
1. Open **cPanel > File Manager**.
2. Go to site root: `/home/websybd/henleyzone.com/`.
3. Upload `cpanel-deploy-small.zip`.
4. Select `cpanel-deploy-small.zip` and click **Extract** (overwrite files).

### Step 3: Ensure Environment Variables Are Set
In cPanel **Setup Node.js App** > **Environment Variables** (or in `.env.local`):
- `ADMIN_DASHBOARD_USERNAME`
- `ADMIN_DASHBOARD_PASSWORD`
- `ADMIN_SESSION_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `UPLOAD_LOCAL=true`

### Step 4: Fix Permissions & Restart
1. Run `https://henleyzone.com/fix-permissions.php` once in browser.
2. In cPanel **Setup Node.js App**, click **Restart Application**.

---

## 4. Admin Panel & Auth Reference

- **Admin Login Route**: `/login?type=admin` (redirected from `/admin` when unauthenticated).
- **Admin Dashboard**: `/admin`
- **Catalog Management**: `/admin/products/manage`
- **Add Product**: `/admin/products`
- **Orders**: `/admin/orders`
- **Checkout Leads**: `/admin/leads`
- **Session Cookie**: `admin_session` (HMAC SHA-256 signed with `ADMIN_SESSION_SECRET`).

---

*Last Updated: July 26, 2026*
