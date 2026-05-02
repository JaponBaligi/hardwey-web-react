# Deployment (sketch)

There is no single “deploy button” in this repo. Production is always **two concerns**: the **static SPA** and the **Node API** (plus SQLite file and upload dir on disk).

---

## Build the frontend

From repo root:

```powershell
npm ci   # or npm install
npm run build
```

Output: **`dist/`**. That folder needs to be served as static files with **fallback to `index.html`** for client-side routes (`/more-faq`, `/dfaqs`, etc.). Misconfigure that and deep links 404.

---

## Run the API

From `server/`:

```powershell
npm ci
# set production .env: JWT_SECRET, ALLOWED_ORIGIN (your real site origin), NODE_ENV=production, DB_PATH, etc.
npm start
```

`ALLOWED_ORIGIN` must be the **exact origin** browsers use for the SPA (scheme + host + port if any). Wrong value → CORS errors or cookies that never stick.

---

## Wiring them together

Common pattern:

1. Reverse proxy (nginx, Apache, Caddy, host panel) routes `/api` and `/uploads` (and `/csrf`, `/auth` if you use unprefixed mounts) to Node.
2. Everything else serves files from **`dist/`**.

Because `server/server.js` mounts routes **with and without** the `/api` prefix, you can align either style with your proxy — just don’t split brain between two configs without checking both.

---

## SQLite & uploads

- Point **`DB_PATH`** at a persistent path on the server (not a wiped tmp dir).
- **`server/public/uploads/`** must stay writable by the Node process and survive redeploys if you care about existing images.

Back up both.

---

## TLS & cookies

In production, `NODE_ENV=production` sets **`secure` cookies**. The site should be served over **HTTPS** or logins will feel broken (cookies dropped).

---

## Environment-specific builds

`VITE_*` variables are **baked in at build time**. If staging and production differ (feature flags, API URL), run **separate builds** per environment.
