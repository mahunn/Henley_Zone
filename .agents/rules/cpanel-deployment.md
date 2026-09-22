# cPanel Deployment Protocol & Workspace Memory

## Production Hosting Environment
- **Platform**: cPanel Node.js Selector (Phusion Passenger).
- **Domain**: `henleyzone.com`
- **Application Root on Server**: `/home/websybd/henleyzone.com/`
- **Deployment Artifact**: `cpanel-deploy-small.zip` (built using `scripts/make-small-zip.ps1`).

## Live Deployment Checklist
1. Verify production build passes: `npm run build`.
2. Generate fresh zip archive:
   ```powershell
   powershell -ExecutionPolicy Bypass -File scripts/make-small-zip.ps1
   ```
3. Commit and push Git changes:
   ```powershell
   git add -u
   git commit -m "..."
   git push origin main
   ```
4. Instruct user to upload `cpanel-deploy-small.zip` to `/home/websybd/henleyzone.com/`, extract it, and restart the Node.js application.

## Key Architectural Files
- `server.js`: Node entry point configured for cPanel Passenger.
- `cache-handler.js`: Safe local Map cache (no unhandled Redis crashes).
- `MEMORY.md`: Complete troubleshooting history and architecture reference.
