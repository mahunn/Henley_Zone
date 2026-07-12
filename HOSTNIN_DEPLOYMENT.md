# Hostnin (cPanel) Deployment Guide — Henley Zone

This guide documents the step-by-step workflow required to deploy Next.js updates to Hostnin cPanel server. Follow this guide to prevent and resolve common shared hosting errors such as "Out of memory", "Maximum call stack size exceeded", and "EACCES permission denied".

---

## The Core Issues on Hostnin
1. **LVE Memory Limits (Out of Memory)**: Shared servers have strict memory allocations (1GB–2GB RAM). Next.js compilation (`next build` / `npm run build`) is highly resource-intensive and will crash on the server with `RangeError: Maximum call stack size exceeded`.
2. **On-the-fly npx fetch blocks**: Running on-the-fly npm dependencies via `npx` (e.g. `npx tsx`) fails due to firewall / CPU limits.
3. **Extraction Permissions (EACCES)**: Extracting zip files via cPanel File Manager often locks directory permissions to `0700` and files to `0600`, which causes Node.js startup crashes (`503 Service Unavailable` with `EACCES: permission denied, scandir` in `stderr.log`).

---

## The Correct Deployment Workflow

Whenever you change code and want to deploy, do NOT run `npm run build` on cPanel. Instead, compile the code locally, package it, upload it, and reset permissions.

### Step 1: Update & Push Code
1. Commit your changes and push them to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push origin main
   ```
2. Pull the changes on the server:
   - Go to cPanel -> **Git™ Version Control** -> click **Manage** -> **Pull or Deploy** tab.
   - Click **`Update from Remote`** to pull the latest code.
   - Click **`Deploy HEAD Commit`** (this copies the files to your active application folder `/home/websybd/henleyzone.com/`).

### Step 2: Compile and Zip the Build Locally (On your PC)
1. Run the build locally in your VS Code terminal:
   ```bash
   npm run build
   ```
2. Compress the compiled `.next` folder into `next.zip` ensuring it includes the `.next` parent folder but excludes the local development environment cache (which might be locked):
   - **In PowerShell**:
     ```powershell
     Remove-Item -Path next.zip -ErrorAction SilentlyContinue
     New-Item -ItemType Directory -Path temp_build\.next -Force
     Copy-Item -Path .next\* -Destination temp_build\.next -Recurse -Exclude dev -ErrorAction SilentlyContinue
     Compress-Archive -Path temp_build\.next -DestinationPath next.zip -Force
     Remove-Item -Path temp_build -Recurse -Force
     ```

### Step 3: Clean & Upload to Hostnin cPanel
1. Open cPanel **`File Manager`** and go to `/home/websybd/henleyzone.com/`.
2. Delete the old `.next` folder.
3. *Crucial*: Make sure no Next.js manifest files (like `routes-manifest.json`, `build-manifest.json`, `server/`, `static/`, etc.) exist in the root of `/home/websybd/henleyzone.com/` (delete them if they were accidentally extracted there).
4. Upload the newly created **`next.zip`** to `/home/websybd/henleyzone.com/`.
5. Right-click **`next.zip`** and select **`Extract`** (this will create a proper `.next` folder containing the build).

### Step 4: Fix Server File Permissions
1. Run the permission fixing PHP script:
   - Make sure `public/fix-permissions.php` is deployed.
   - Open a browser and visit: **`https://henleyzone.com/fix-permissions.php`**
   - It will output a success message showing that it reset directory permissions to `0755` and files to `0644`.
2. **Delete the file `public/fix-permissions.php`** using your cPanel File Manager immediately after running it for security.

### Step 5: Restart the Application
1. Go to cPanel -> **Node.js Application Manager**.
2. Click the circular **`Restart` / `Reload`** icon next to `henleyzone.com/` in the actions column.
3. Refresh your website!

---

## Server Environment Configuration Rules
- **No tsx prebuild**: Ensure `"prebuild"` script in `package.json` is set to `echo 'Skipping prebuild on server'`. TSX execution is blocked on cPanel.
- **Node Version**: The application is configured to run on **Node.js version 22.22.3** in cPanel Node.js Selector.
- **Supabase credentials**: Supabase URL and Keys should not be added to git but are loaded dynamically on Hostnin disk.
