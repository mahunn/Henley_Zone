# Henley Zone Architecture, Deployment & Memory Guide (A-Z)

This document contains the complete technical architecture, configuration details, root-cause troubleshooting log, and step-by-step cPanel deployment protocol for the **Henley Zone** e-commerce platform.

---

## 1. System Architecture & Tech Stack

- **Framework**: Next.js 16 (App Router) with React 19 & TypeScript.
- **Server Entry**: Custom Node HTTP server (`server.js`) running on Phusion Passenger (cPanel Node Selector, Node.js v18+ / v22+).
- **Database & Auth**: Supabase (PostgreSQL) for store data + Custom HMAC Signed Cookie Authentication for Admin Panel.
- **Caching**: Local memory cache fallback (`cache-handler.js`) + optional Redis integration.
- **Image Optimization**: `unoptimized: true` in `next.config.ts` (tailored for cPanel static serving / Cloudinary / Supabase).
- **Tracking**: Meta (Facebook) Pixel with standard eCommerce events (`PageView`, `ViewContent`, `AddToCart`, `InitiateCheckout`, `Purchase`).

---

## 2. Root Cause Analysis & Historical Troubleshooting Log

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

### Issue 5: Oversized Upload Packages (495 MB) & Hardcoded Script Path
- **Problem**: Zipping `.next` without excluding `.next/cache` created a 495 MB zip file that timed out during cPanel upload. The script also had a hardcoded path from an older machine.
- **Fix**: Updated `scripts/make-small-zip.ps1` to use dynamic relative path `Join-Path (Get-Location).Path "cpanel-deploy-small.zip"` and filter out `.next/cache` & `.next/dev`, producing a clean ~18 MB deploy zip.

### Issue 6: Local Catalog Image 404s on New Laptop Setup
- **Problem**: Product photos in production are saved to local server disk (`/uploads/catalog/...`) and `.gitignore` intentionally excludes them. On a new machine, `public/uploads/catalog/` is empty, causing 404 errors for every product image during `npm run dev`.
- **Fix**: Added dynamic rewrites in `next.config.ts`:
  ```typescript
  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];
    return [{ source: "/uploads/:path*", destination: "https://henleyzone.com/uploads/:path*" }];
  }
  ```
  In local dev, any upload not found on the local filesystem automatically proxies to `https://henleyzone.com/uploads/...` with zero 404s.

### Issue 7: Meta Pixel `test_event_code` Console Warning
- **Problem**: In `meta-facebook-pixel.tsx`, code called `fbq('set', 'test_event_code', code, id)`. Meta's browser SDK printed `[Meta Pixel] - Unsupported metadata argument: test_event_code.` because `test_event_code` is strictly a Server-side Conversions API (CAPI) parameter, not supported by client `fbq('set')`.
- **Fix**: Removed the unsupported `fbq('set', 'test_event_code')` call and commented out `NEXT_PUBLIC_META_PIXEL_TEST_EVENT_CODE` in `.env.local`.

### Issue 8: Early `window.fbq` Stub Breaking Script Injection
- **Problem**: Attempting to create a `window.fbq` queue stub in `meta-pixel.ts` caused official Meta snippet `!function(...) { if (f.fbq) return; ... }` to return early without injecting `fbevents.js`, resulting in "No Pixels found on this page".
- **Fix**: Refactored `src/lib/meta-pixel.ts` to use an asynchronous polling dispatcher. It lets Meta's official snippet initialize `window.fbq` first, then dispatches queued events without interfering with the snippet's guard.

### Issue 9: Multiple Pixels Conflicting Versions Warning
- **Problem**: Next.js Fast Refresh or route changes re-ran the `<Script>` tag, causing multiple `fbq('init')` calls in the same browser session.
- **Fix**: Added an idempotency flag `if (!window._fbq_initialized)` around the initialization block in `meta-facebook-pixel.tsx`.

### Issue 10: WhatsApp Floating Button Overlap & Return Policy Realignment
- **Problem**: Floating WhatsApp button at the bottom-right sat directly over the sticky "Order Now" button on mobile, interfering with conversions. Return policy was inconsistent across the site (7-day vs 3-day).
- **Fix**: Moved WhatsApp button directly into the main site header (top-right replacing the old cart icon). Moved the floating cart button to the landing page with dynamic badge count. Elevated the floating cart button above the mobile sticky bottom bar (`bottom: calc(76px + env(...))`). Replaced all return policy text site-wide with "চেক করে তাৎক্ষণিক রিটার্ন/এক্সচেঞ্জ" (instant on-the-spot inspection upon delivery).

### Issue 11: Laptop Trackpad Scroll Lock & Stretched Bottom Bar
- **Problem**: On laptop/desktop screens (`>= 640px`), `.lp-page` had `overflow: hidden;`, trapping mouse wheel and touchpad precision scroll events and causing scrolling to feel stuck or broken. Additionally, `.lp-sticky-bottom-bar` spanned 100% width, pushing price to the far left under Next.js dev badges and buttons to the far right, while covering the footer credits (`Websy.bd`).
- **Fix**: Removed `overflow: hidden;` and `-webkit-overflow-scrolling: touch;` from `.lp-page`. Bound `overflow-x: clip;` exclusively to `html`. Capped `.lp-sticky-bottom-bar` to `max-width: 600px; left: 50%; transform: translateX(-50%);` with rounded top corners for desktop/laptop, and added `105px` bottom padding to `.lp-footer` so all credits remain completely visible above the bar.

---

## 3. Meta Pixel Tracking Architecture

Tracking is centralized in `src/lib/meta-pixel.ts`:
- **`PageView`**: Fired on initial load and route changes by `meta-facebook-pixel.tsx`.
- **`ViewContent`**: Fired in `product-detail-view.tsx` and `landing-product-page.tsx` on product mount with `id`, `name`, `price`, `category`, and `currency: "BDT"`.
- **`AddToCart`**: Fired in `cart-provider.tsx` inside `addToCart` and `addCartItems`, capturing all store, landing, and card add-to-cart clicks.
- **`InitiateCheckout`**: Fired in `checkout/page.tsx` when the customer enters checkout with items.
- **`Purchase`**: Fired in `checkout/success/page.tsx` upon loading `latestOrder` from `localStorage`, with `sessionStorage` deduplication (`fb_purchased_<orderId>`) to prevent duplicate events on page reload.

---

## 4. Standard cPanel Deployment Protocol (Step-by-Step)

Follow these exact steps for all future updates:

### Step 1: Build & Package Locally
Run the following commands in the project directory:
```powershell
npm run build
powershell -ExecutionPolicy Bypass -File scripts/make-small-zip.ps1
```
This outputs `cpanel-deploy-small.zip` (~18 MB) in the project root directory.

### Step 2: Upload to cPanel
1. Open **cPanel > File Manager**.
2. Navigate to your application root directory:
   `/home/websybd/henleyzone.com/`
3. Upload `cpanel-deploy-small.zip`.
4. Right-click `cpanel-deploy-small.zip` and click **Extract** (overwrite existing files).
5. Delete `cpanel-deploy-small.zip` from cPanel to save space.

### Step 3: Restart Application
- In cPanel, navigate to **Setup Node.js App**.
- Find `henleyzone.com` and click **Restart Application**.
- *(Alternatively, create or touch an empty file at `/home/websybd/henleyzone.com/tmp/restart.txt`).*

---

## 5. Local Laptop Development Setup Reference

- **Node.js**: Installed in `C:\Users\mahin\AppData\Local\Programs\nodejs` (`v22.23.2` LTS).
- **Git**: Installed in `C:\Users\mahin\AppData\Local\Programs\Git\cmd` (`2.55.0`).
- **PowerShell Execution Policy**: Set to `RemoteSigned` for `CurrentUser` to permit `npm.ps1`.
- **Global Path & Wrappers**: User `PATH` updated permanently. CLI wrappers placed in `C:\Users\mahin\.gemini\antigravity-ide\bin`.
- **Local Dev Server**: Run with `npm run dev` at `http://localhost:3000`.

---

*Last Updated: September 22, 2026*
