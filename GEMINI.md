# Henley Zone — Assistant Rules & Permanent Memory

## CRITICAL DEPLOYMENT INSTRUCTION (CPANEL)
This project is deployed to **cPanel Shared Hosting (Phusion Passenger Node.js Selector)**, NOT Vercel.
Whenever the user asks to "make it live", "deploy", "push for live", or "update production":
1. **Always build and package the deployment zip**:
   ```powershell
   npm run build
   powershell -ExecutionPolicy Bypass -File scripts/make-small-zip.ps1
   ```
2. The zip file created is: `cpanel-deploy-small.zip` in the project root (~18 MB).
3. Push changes to GitHub: `git push origin main`.
4. Provide the exact cPanel upload steps:
   - Go to cPanel File Manager -> `/home/websybd/henleyzone.com/`
   - Upload `cpanel-deploy-small.zip` and click **Extract** (overwrite files).
   - In cPanel **Setup Node.js App**, click **Restart Application** (or touch `tmp/restart.txt`).

## CORE ARCHITECTURE & SYSTEM RULES
- **Server Entry**: `server.js` (forces `process.env.NODE_ENV = 'production'`).
- **Cache**: In-memory fallback (`cache-handler.js`). Never force Redis if `REDIS_URL` is empty.
- **Images**: `unoptimized: true` in `next.config.ts`. In local dev, `/uploads/:path*` rewrites to `https://henleyzone.com/uploads/:path*`.
- **Database**: Supabase client (`@supabase/supabase-js`) + local JSON fallback.
- **CSS**: Vanilla CSS only (never Tailwind). Scoped design tokens in `src/app/globals.css` and `src/app/(landing)/landing.css`.
- **Reference Docs**: Complete troubleshooting logs and architecture are stored in `MEMORY.md`.
