# Project overview

## The idea in one pass

The **public site** is a normal React SPA: routes in `src/App.tsx`, sections implemented as components under `src/components`, legal/extra pages under `src/pages`.

Those sections don’t hardcode final copy in JSX only. They pull structured JSON blobs from the backend (`GET /api/content`), keyed by names like `hero`, `faq`, `partners`. TypeScript shapes for that JSON live in `src/types/content.ts`. Some sections still merge **defaults from `src/types/content.ts`** when the API returns nothing useful — so behaviour is “API wins, fallbacks exist.”

The **admin app** is the same bundle, lazy-loaded at route **`/dfaqs`** (`AdminApp`). It talks to the same origin `/api/...` with cookies + CSRF on mutating requests.

The **server** stores each section as one JSON string in SQLite (`content` table). Uploads go to disk under `server/public/uploads/` and are exposed again as `/api/uploads/...` (and `/uploads/...` duplicate mounts exist for hosting quirks).

---

## Request path (read)

1. Browser loads the SPA from Vite or your static host.
2. Section components call `useContent('someSectionKey')` in `src/hooks/useContent.ts`.
3. That hook fetches **`/api/content`** once (with a small in-memory cache, ~5 minutes).
4. The JSON is a map: `{ content: { hero: {...}, faq: {...}, ... } } }`.
5. Each component reads its slice and renders.

So: **one bulk fetch** for the public site, not one HTTP call per section. Simple, a bit coarse for huge payloads, fine for this use case.

---

## Request path (write)

1. Admin UI loads, checks session with `GET /api/auth/me` (cookie).
2. Before POST/PUT/DELETE, the client grabs a CSRF token from **`GET /api/csrf`** and sends `x-csrf-token`.
3. Saves go to **`PUT /api/content/:section`** with JSON body; images via **`POST /api/uploads`** (multipart).

---

## Dual mounting (`/api` and `/`)

Look at `server/server.js`: many routes are registered **twice** — once under `/api/...` and once without the prefix. That’s for LiteSpeed/Passenger setups where the prefix isn’t always stripped the same way. Annoying to read, intentional for deployment.

---

## Section keys you’ll actually see

`server/db/init.js` seeds a fixed list (e.g. `hero`, `intro`, `shares`, `ticker`, `investment`, `faq`, `founders`, `moreFaq`, `privacyPolicy`, `terms`, `errorPage`, …). The admin can **create extra keys** beyond that list; the site only renders what the React routes and components know about.

---

## Assets (`/assets/...`)

Defaults and seed JSON often use `/assets/img/...`, `/assets/svg/...`, etc. Put those files under **`public/assets/`** (repo root). Vite exposes them at `/assets/...` in dev and bundles them into **`dist/`** when you build.

You can still point fields at **absolute URLs** (CDN, third-party) via the admin — nothing forces everything through `public/`.

**Uploaded** images from the admin UI land under **`server/public/uploads/`** and come back as `/api/uploads/<filename>`. That directory is runtime data, not the same as root `public/`.

---

## Feature flags (frontend)

`src/utils/env.ts` reads `VITE_*` variables at build time. **`features`** (Lenis scroll, WebGL background, cookie banner, etc.) is what `App.tsx` uses. `apiConfig` / `securityConfig` are defined there too but **nothing imports them yet** — don’t assume they affect runtime behaviour until wired up.
