# Deploy to cPanel "Setup Node.js App"

1) Create the app
- In cPanel > Setup Node.js App:
  - Application root: e.g., hardwey-api (upload this server/ folder contents there)
  - Application startup file: server.js
  - Node.js version: **18.x LTS** (recommended; Node 19/20 may have build issues)
  - Click "Create".

2) Upload code and install dependencies
- Upload the files from this server/ folder to the Application root.
- In "Manage Shell" for the app:
  - npm install
  - npm run db:init

3) Environment variables
- In the Node.js app UI, add:
  - PORT=3001
  - NODE_ENV=production
  - DB_PATH=/home/<cpaneluser>/hardwey-api/data.db
  - ADMIN_INIT_PASSWORD=ChangeMeNow!123 (rotate after first login)
  - JWT_SECRET=<strong random secret>
  - JWT_EXPIRES_IN=15m
  - REFRESH_EXPIRES_IN=7d
  - ALLOWED_ORIGIN=https://hardweyllc.com
  - UPLOAD_MAX_BYTES=5242880
  - LOGIN_RATE_WINDOW_MS=900000
  - LOGIN_RATE_MAX=5
  - GLOBAL_RATE_PER_MIN=300

4) File permissions
- Ensure the directory for the SQLite file and public/uploads are writable by the app user.
- Create public/uploads if missing; ensure 755 permissions (not world-writable).

5) Passenger/Start
- Click "Run NPM Install" if available, then "Restart App".
- Verify https://hardweyllc.com/api/health returns { "ok": true }.

6) SSL/HTTPS
- Ensure valid SSL for the site. In production, cookies use Secure.
- If behind a proxy, enable trust proxy and optional HTTPS redirect in server.js (commented block).

7) React integration
- Keep React build hosted as usual (Vite). Call the API via same-origin paths like /api/content with credentials: 'include'.
- Mount the admin SPA at /dfaqs in the router (see src/admin/registerRoute.tsx).

8) CORS
- ALLOWED_ORIGIN must be https://hardweyllc.com so admin SPA can make credentialed requests.

9) Updating content
- Public site fetches GET /api/content at runtime; no rebuild needed.

10) Logs
- Use cPanel app logs to monitor errors and requests.

## Troubleshooting better-sqlite3 Installation

If `npm install` fails with `better-sqlite3` build errors:

### GLIBC Version Mismatch Error
If you see: `GLIBC_2.29' not found` or similar GLIBC errors:
- **Solution**: The package uses version 9.4.3 which supports older GLIBC versions
- Delete `node_modules` and `package-lock.json`, then run `npm install` again
- If still failing, try building from source (see Option 3 below)

### Option 1: Use Node.js 18 LTS (Recommended)
- In cPanel Node.js App settings, change Node.js version to **18.x** (LTS)
- Delete `node_modules` and `package-lock.json` if they exist
- Run `npm install` again

### Option 2: Build from Source (if build tools available)
This requires system build tools. Contact hosting support to verify:
- `gcc` / `g++`
- `make`
- `python3-dev` or `python3-devel`
- `node-gyp`

Then install:
```bash
npm install better-sqlite3 --build-from-source
npm install
```

### Option 3: Build Locally and Upload
If native compilation isn't possible on the server:
1. Build on a local Linux machine (or WSL) with the same Node.js version (18.x)
2. Run `npm install` locally
3. Upload the `node_modules/better-sqlite3` folder to the server
4. Ensure the binary matches the server architecture (linux-x64)

### Option 4: Check Node Version Compatibility
- Ensure Node.js version matches `package.json` engines: `>=18 <=22`
- Node 19.9.0 may have compatibility issues; prefer Node 18.x LTS