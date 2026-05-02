# Troubleshooting

Symptoms → things that actually cause them in this codebase.

---

## Blank sections or old copy after saving in admin

Public pages cache **`GET /api/content`** in memory for a few minutes (`useContent.ts`). After an edit, either wait out the TTL or trigger whatever invalidates that cache from the admin save path. If something still looks stale, hard refresh — rare, but browser cache can bite on hashed assets.

---

## CORS errors / login never sticks

- **`ALLOWED_ORIGIN`** on the server must match how you open the site (`http://localhost:5173` vs `http://127.0.0.1:5173` are different origins).
- Cookies need **Secure** in production behind HTTPS; mixed HTTP front + HTTPS API will frustrate you.

---

## `/api/content` fails in dev

API not running, or wrong port. Vite proxies to **`localhost:3001`** — change both `vite.config.ts` and `server` `PORT` if you move it.

---

## Images 404 for `/assets/...`

File missing under **`public/assets/`** (wrong path or not committed). Or you’re running **`vite preview`** without having copied `public/` into `dist/` via a proper `vite build` (build does that automatically).

---

## Uploads 404

Check **`server/public/uploads/`** exists and the server process can write there. URLs returned by the API look like **`/api/uploads/<hash>.ext`** — your production proxy must forward `/api` to Node.

---

## `db:init` throws about `ADMIN_INIT_PASSWORD`

`db:init` only creates the `admin` user when that row is missing, and it **refuses** to run without a non-empty **`ADMIN_INIT_PASSWORD`** in `server/.env`. Set something strong locally; never commit `.env`.

---

## Typecheck fails after editing content shapes

Editors and **`src/types/content.ts`** should agree. The DB accepts flexible JSON; TypeScript does not — update types when you add fields components rely on.
