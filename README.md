# Nozzle Motion — 3D printing service platform

Next.js 16 (App Router, Cache Components) single app: public landing page, client platform (signup, file uploads, job tracking, chat), and admin dashboard (order queue, quotes, inbox).

## Run locally

```bash
npm install
npm run seed   # creates the admin account (see below)
npm run dev
```

Open http://localhost:3000. Local dev uses SQLite in `data/` and file uploads in `uploads/` — no external services needed.

Dev admin seeded for you: `admin@nozzle-motion.dev` / `change-me-admin` — **change this password before anything else**, or re-seed your own:

```bash
NM_ADMIN_EMAIL=you@example.com NM_ADMIN_PASSWORD='strong-pass' npm run seed
```

## How it works

- **Auth** — email + password (bcrypt), JWT in an httpOnly cookie (`AUTH_SECRET`). `src/proxy.ts` guards `/dashboard/*` (any user) and `/admin/*` (admin only).
- **Uploads** — STL/3MF/OBJ/STEP/GCODE, 200 MB/file. Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set, local disk otherwise. Downloads go through `/api/files/[id]` with per-order access checks.
- **Chat** — one thread per job (`order:<id>`) plus `general:<userId>`. Writes hit `/api/chat/[thread]`; live updates stream over SSE (`/api/chat-events/[thread]`) with automatic 5 s polling fallback if the stream drops.
- **DB** — libSQL. Local file in dev; set `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` for production (schema auto-creates on first request).

## Deploy to Vercel

1. Create a Blob store (Storage tab) → `BLOB_READ_WRITE_TOKEN`.
2. Create a Turso database → `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`.
3. Set `AUTH_SECRET` (`openssl rand -hex 32`).
4. Seed the admin against Turso, or sign up once and run the INSERT from `scripts/seed.mjs` logic.

Note: SSE streams don't survive Vercel's serverless function timeouts well — the chat already falls back to 5-second polling, so it stays functional. A small VPS with `npm run build && npm start` gives true instant delivery if that matters.

## Test accounts in the dev database

- `admin@nozzle-motion.dev` — admin
- `client@test.dev` / `testpass123` — has job #1 with an uploaded STL, quote, and a chat thread
