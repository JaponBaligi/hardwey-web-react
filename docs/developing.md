# Local development

## Two processes

You need **Vite** (frontend) and **Express** (API) running together. The frontend never talks to `localhost:3001` directly from the browser for `/api` — Vite’s dev server proxies those paths (see `vite.config.ts`).

Typical layout:

- `http://localhost:5173` — site + admin  
- `http://localhost:3001` — API if you hit it directly (health check, debugging)

If the proxy breaks, you’ll see HTML error pages or connection failures on `/api/content`; check that the server is up first.

---

## Static files (`public/` vs server uploads)

| Location | Purpose |
|----------|--------|
| `public/` (repo root) | SHIPPED static assets: logos, banner jpgs, svg motifs. Paths like `/assets/...` resolve here in dev and copy into `dist/`. |
| `server/public/uploads/` | Created by the API for admin uploads. Served at `/api/uploads/...`. Usually gitignored or empty in fresh clones. |

---

## `vite preview`

`npm run preview` serves **`dist/`** only. It does **not** proxy `/api` to Express like `npm run dev` does. Either run the API separately and point your browser setup at both origins (messy), or test API-backed behaviour with **`npm run dev`**.

---

## Environment files

**Never commit real `.env` files.**

### Frontend (repo root, optional)

Vite picks up `.env`, `.env.local`, etc. Variables must be prefixed with `VITE_`. Copy from `.env.example` when present.

Common ones:

- `VITE_ENVIRONMENT` — `development` | `staging` | `production` (drives a few defaults in `env.ts`)
- `VITE_WEBGL_ANIMATION_ENABLED` — `true` / `false` (heavy; off by default in schema unless you set otherwise)
- `VITE_LENIS_ENABLED`, `VITE_COOKIE_CONSENT_ENABLED` — toggles used in `App.tsx`

### Backend (`server/.env`)

Required for anything beyond a toy session:

| Variable | Notes |
|----------|--------|
| `JWT_SECRET` | Signing key for access + refresh JWTs. Use a long random string. |
| `ADMIN_INIT_PASSWORD` | **Required** when `db:init` creates the first `admin` user (non-empty; no default in code). |

Useful knobs:

| Variable | Notes |
|----------|--------|
| `PORT` | Default `3001` when not behind Passenger. |
| `ALLOWED_ORIGIN` | CORS origin for credentialed requests — must match where the SPA is served (e.g. `http://localhost:5173` in dev). |
| `DB_PATH` | SQLite path; default `./data.db` relative to current working directory when the server runs. |
| `NODE_ENV` | `development` vs `production` toggles cookie `secure`, error verbosity, etc. |

See `server/.env.example` for the rest (rate limits, upload size, JWT expiry).

---

## Database reset

Deleting the SQLite file and running `npm run db:init` again gives you a fresh DB with seeded sections. Set **`ADMIN_INIT_PASSWORD`** in `.env` first, or init throws. If an `admin` row already exists, init won’t reset that password.

---

## Linting & tests

```powershell
npm run lint
```

Vitest is in `package.json` but there’s **no `npm test` script** wired up yet. Tests live under `src/**/__tests__/` if you want to run Vitest manually (`npx vitest`).

---

## Production build (rough cuts)

1. `npm run build` → static assets in `dist/`.
2. Serve `dist/` from nginx, Apache, S3+CloudFront, or whatever you use.
3. Run the Node server (or Passenger) so `/api` hits Express — either same host (reverse proxy) or explicit API host (then you’ll need to align CORS + cookie domains yourself; the current code assumes same-site cookies with the proxy pattern).

Exact hosting steps depend on your provider. There are deploy notes floating in other branches or folders sometimes (`README-deploy-*`); treat those as supplements, not the single source of truth.

---

## Small quirks worth knowing

- **`LoadingScreen`** delays showing the main UI by ~2s in `App.tsx` — that’s product polish, not loading data.
- **Admin route** is `/dfaqs` — not linked from the public nav; bookmark it.
- **Cookie paths** for refresh tokens are narrower than access tokens; if you change route prefixes, test login/logout carefully.
