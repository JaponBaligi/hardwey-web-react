# Content model & admin API

## Content shape

Each **section** is a JSON object stored in SQLite. There’s no separate CMS schema per section at the DB layer — it’s all `TEXT` JSON. Validation/sanitization on write happens in `server/routes/content.js` (`sanitizeContent`, payload checks).

Front-end types in `src/types/content.ts` describe what editors and sections expect. Reality can drift: the DB will accept any object that passes server sanitization, but React components may assume certain fields exist.

---

## Section keys (seeded)

From `server/db/init.js` initial seed:

`home`, `hero`, `intro`, `shares`, `ticker`, `investmentIntro`, `investment`, `nftDisclaimer`, `faq`, `fredAgain`, `founders`, `joinUs`, `footer`, `moreFaq`, `privacyPolicy`, `terms`, `errorPage`, `faqIntro`, `partners`, `collaboratives`

You can add more keys from the admin list UI; only routes/components that read those keys will show them.

---

## Public endpoints (no login)

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/content` | All sections as one JSON map |
| GET | `/api/content/:section` | Single section |
| GET | `/api/csrf` | CSRF token (needed before login / writes) |
| GET | `/api/health` | `{ ok: true }` |

Static uploads are served from `/api/uploads/...` (and `/uploads/...` mirror).

---

## Auth endpoints

Uses **HTTP-only cookies** (access + refresh) and **JWT** signed with `JWT_SECRET`.

| Method | Path | Notes |
|--------|------|--------|
| POST | `/api/auth/login` | Body: `{ username, password }`. Requires CSRF. Rate limited. |
| POST | `/api/auth/refresh` | Refresh access token. CSRF. |
| POST | `/api/auth/logout` | Clears cookies. CSRF. |
| GET | `/api/auth/me` | `{ authenticated, user? }` |

Client helpers: `src/admin/api.ts` (`login`, `logout`, `getMe`, `ensureCsrf`, etc.).

---

## Protected writes

| Method | Path | Notes |
|--------|------|--------|
| PUT | `/api/content/:section` | Replace section JSON |
| DELETE | `/api/content/:section` | Remove section row |
| POST | `/api/uploads` | `multipart/form-data` field `file`. Returns `{ url }` under `/api/uploads/...` |

All of the above need a valid access cookie **and** CSRF header on mutating routes.

---

## Admin UI structure (frontend)

- `src/admin/AdminApp.tsx` — auth gate, layout shell  
- `src/admin/ContentList.tsx` — pick/create/delete section keys  
- `src/admin/SectionEditor.tsx` — routes to the right editor per section  
- `src/admin/editors/*` — one editor component per major section type  

Normalizers live in `src/admin/sectionNormalizers.ts` when shapes need massaging before save.

---

## Cache invalidation

After admin saves, `invalidateContentCache()` from `useContent.ts` can be used so the public sections refetch. If you edit content and the homepage looks stale, something in that chain didn’t fire — worth checking the editor save path.

---

## Security reminders (boring but real)

- Rotate `JWT_SECRET` if it ever leaks; all issued tokens become invalid once you change signing (depending on how you handle token versioning — see `token_version` on `admin_users`).
- First admin user: `ADMIN_INIT_PASSWORD` is **required** in `.env` before `db:init` when no admin exists; change the password after first login in production.
- CORS `ALLOWED_ORIGIN` is a **single origin string** in code — not an array. Multiple frontends need a code change or env-driven adjust.
