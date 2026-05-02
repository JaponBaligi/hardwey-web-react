# Folder layout

Rough map so you don’t have to spelunk blindly.

```
hardwey-react/
├── public/                 # Vite static root → / URLs in dev & dist (assets, favicon targets)
├── src/
│   ├── admin/              # CMS UI (lazy route /dfaqs): editors, api client, normalizers
│   ├── components/         # Homepage sections + shared UI (Navigation, CookieConsent, …)
│   ├── hooks/              # useContent (API cache), smooth scroll, modal, …
│   ├── pages/              # Routed pages: More FAQ, Privacy, Terms, Partners
│   ├── styles/             # globals + CSS variables
│   ├── types/              # content.ts = JSON shapes + large default blobs
│   ├── utils/              # env (VITE_*), validation, formatters
│   ├── App.tsx             # Routes + loading gate + feature flags
│   └── main.tsx
├── server/
│   ├── db/                 # init.js (seed), db.js (connection)
│   ├── middleware/         # JWT auth, CSRF
│   ├── routes/             # auth.js, content.js
│   ├── public/uploads/     # multer writes here; NOT the same as repo-root public/
│   ├── util/
│   └── server.js           # Express app, dual /api mounts
├── docs/                   # This documentation
├── dist/                   # Build output (gitignored)
├── index.html
├── vite.config.ts
└── package.json
```

**Types:** `src/types/content.ts` is both TypeScript interfaces and a pile of default content used as fallbacks — it’s long on purpose.

**Tests:** `src/**/__tests__/**` — hook/util unit tests; no e2e suite in-tree.
