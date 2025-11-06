# Deploy Node.js Backend to cPanel

## Prerequisites
- cPanel access with "Setup Node.js App" feature
- Domain configured: `hardweyllc.com`
- All files from `server/` folder ready to upload

## Deployment Steps

### 1. Create Node.js Application in cPanel

1. Go to **cPanel > Setup Node.js App**
2. Click **"+ CREATE APPLICATION"**
3. Configure:
   - **Node.js version**: `18.x LTS` (recommended)
   - **Application mode**: `Production`
   - **Application root**: `api` (or `hardwey-api`)
   - **Application URL**: `hardweyllc.com/api`
   - **Application startup file**: `server.js`
4. Click **"CREATE"**

### 2. Upload Application Files

Upload **ALL files and folders** from `server/` directory to the Application root directory (`/home/<cpaneluser>/api/`):

**Required files/folders:**
- `server.js` (main entry point)
- `package.json`
- `db/` folder (with `db.js`, `init.js`)
- `routes/` folder (with `auth.js`, `content.js`)
- `middleware/` folder (with `auth.js`, `csrf.js`)
- `util/` folder (with `fs.js`)
- `public/` folder (with `uploads/` subdirectory)

**Do NOT upload:**
- `node_modules/` (will be installed on server)
- `*.db` files (database will be created on server)
- `data.dev.db*` files (development database)

### 3. Install Dependencies

In cPanel > Setup Node.js App:
- Click **"Run NPM Install"** button for your app
- Wait for installation to complete

Or via Terminal/Shell:
```bash
cd /home/<cpaneluser>/api
npm install
```

### 4. Initialize Database

In Terminal/Shell:
```bash
cd /home/<cpaneluser>/api
npm run db:init
```

This creates the database and seeds initial content sections.

### 5. Set Environment Variables

In cPanel > Setup Node.js App > Edit your app, add:

```
PORT=3001
NODE_ENV=production
DB_PATH=/home/<cpaneluser>/api/data.db
ADMIN_INIT_PASSWORD=ChangeMeNow!123
JWT_SECRET=<generate a strong random secret>
JWT_EXPIRES_IN=15m
REFRESH_EXPIRES_IN=7d
ALLOWED_ORIGIN=https://hardweyllc.com
UPLOAD_MAX_BYTES=5242880
LOGIN_RATE_WINDOW_MS=900000
LOGIN_RATE_MAX=5
GLOBAL_RATE_PER_MIN=300
```

**Important:**
- Replace `<cpaneluser>` with your actual cPanel username
- Generate a strong random string for `JWT_SECRET`
- Change `ADMIN_INIT_PASSWORD` after first login

### 6. Set File Permissions

Ensure directories are writable:
```bash
chmod 755 /home/<cpaneluser>/api
chmod 755 /home/<cpaneluser>/api/public
chmod 755 /home/<cpaneluser>/api/public/uploads
```

The database file will be created automatically with correct permissions.

### 7. Start/Restart Application

In cPanel > Setup Node.js App:
- Click **"RESTART"** button
- Wait for status to show **"started (v18.20.8)"**

### 8. Verify Deployment

Test endpoints:
- `https://hardweyllc.com/api` → Should return `{"message":"Hardwey API","version":"1.0.0"}`
- `https://hardweyllc.com/api/health` → Should return `{"ok":true}`
- `https://hardweyllc.com/api/csrf` → Should return `{"csrfToken":"..."}`

### 9. Frontend Integration

Ensure your React app's `.htaccess` in `public_html/` excludes `/api` from SPA rewrite:
```apache
RewriteCond %{REQUEST_URI} ^/api(/|$) [OR]
RewriteCond %{REQUEST_URI} ^/uploads(/|$)
RewriteRule ^ - [L]
```

### 10. Admin Panel Access

Visit `https://hardweyllc.com/dfaqs` to access the admin panel.

**Default credentials:**
- Username: `admin`
- Password: Value set in `ADMIN_INIT_PASSWORD` environment variable

**Change password after first login** by updating the database or resetting `ADMIN_INIT_PASSWORD` and re-running `npm run db:init`.

## Troubleshooting

### App Shows "Started" but Returns 404

1. Verify Application URL is exactly `hardweyllc.com/api` (no trailing slash)
2. Check app logs in cPanel for errors
3. Test app directly: `cd /home/<cpaneluser>/api && node server.js`
4. Ensure Passenger is enabled (contact hosting support if needed)

### Database Errors

- Ensure `DB_PATH` environment variable is correct
- Check directory permissions: `chmod 755 /home/<cpaneluser>/api`
- Verify database file exists: `ls -la /home/<cpaneluser>/api/data.db`

### better-sqlite3 Installation Errors

See "Troubleshooting better-sqlite3 Installation" section below.

### Rate Limiting Errors

If you see `ERR_ERL_PERMISSIVE_TRUST_PROXY`:
- The app is configured correctly with `trust proxy` set to `1` (first proxy only)
- Rate limiters have `validate: { trustProxy: false }` to skip validation
- This is expected and safe

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

## File Structure After Deployment

```
/home/<cpaneluser>/api/
├── server.js
├── package.json
├── package-lock.json
├── data.db (created by db:init)
├── db/
│   ├── db.js
│   └── init.js
├── routes/
│   ├── auth.js
│   └── content.js
├── middleware/
│   ├── auth.js
│   └── csrf.js
├── util/
│   └── fs.js
└── public/
    └── uploads/
```

## Updating the Application

1. Upload updated files to the Application root directory
2. Run `npm install` if `package.json` changed
3. Restart the app in cPanel
4. Database changes require manual migration or re-running `db:init` (be careful - this resets data)

## Security Notes

- Change `ADMIN_INIT_PASSWORD` after first login
- Use a strong random `JWT_SECRET`
- Ensure `public/uploads` directory is not world-writable (755 permissions)
- Keep Node.js updated to the latest stable version
- Review and update dependencies regularly
