# Deploy to cPanel "Setup Node.js App"

1) Create the app
- In cPanel > Setup Node.js App:
  - Application root: e.g., hardwey-api (upload this server/ folder contents there)
  - Application startup file: server.js
  - Node.js version: 18–20
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
