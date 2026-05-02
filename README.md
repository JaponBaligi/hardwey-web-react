# hardwey-react

Marketing site for HARDWEY — React + Vite on the front, a small Express API + SQLite on the back. Most copy and imagery are editable through an admin UI instead of redeploying static HTML.

Static files for the SPA (anything referenced as `/assets/...`, favicon paths in `index.html`, etc.) belong in **`public/`** at the repo root. Vite serves them in dev and copies them into **`dist/`** on build. **`public/` is tracked in git** — add what you need there so clones aren’t missing artwork.

Uploaded CMS images are separate: the API writes to **`server/public/uploads/`**. Don’t confuse that folder with root `public/`.

---

## What runs where

| Piece | Tech | Role |
|-------|------|------|
| `src/` | React 19, TypeScript | Public pages + `/dfaqs` admin |
| `server/` | Express, better-sqlite3 | JSON content API, uploads, admin auth |
| SQLite file | default `./server/data.db` (override with `DB_PATH`) | One row per “section” of site content |

Local dev relies on Vite proxying `/api` and `/uploads` to port **3001** (see `vite.config.ts`).

---

## Quick start (local)

**1. Node** — use something in the **18–22** range (matches `server/package.json` engines).

**2. Install**

```powershell
npm install
cd server
npm install
cd ..
```

**3. Server env** — copy `server/.env.example` to `server/.env` and set at least `JWT_SECRET` and `ADMIN_INIT_PASSWORD`. Generate a long random `JWT_SECRET`; don’t reuse the example string.

**4. Database**

```powershell
cd server
npm run db:init
cd ..
```

**5. Two terminals**

```powershell
# Terminal A — API (default http://localhost:3001)
cd server
npm run dev

# Terminal B — Vite (default http://localhost:5173)
npm run dev
```

Open the site at the Vite URL. Admin lives at **`/dfaqs`** (obscure path on purpose).

---

## Scripts (root)

| Script | What it does |
|--------|----------------|
| `npm run dev` | Vite dev server + proxy to API |
| `npm run build` | `tsc -b` then production bundle to `dist/` |
| `npm run preview` | Serve the built bundle locally |
| `npm run lint` | ESLint |

**Server** (`server/`): `npm run dev`, `npm run start`, `npm run db:init`.

---

## Docs

- [Project overview & data flow](docs/overview.md)
- [Folder layout](docs/folder-layout.md) — what lives where
- [Local development](docs/developing.md)
- [Deployment sketch](docs/deployment.md)
- [Content model & admin API](docs/content-and-admin.md)
- [Troubleshooting](docs/troubleshooting.md)

---

## License

MIT — see [LICENSE](LICENSE).
