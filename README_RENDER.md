Render deployment notes

- Provision: Use `render.yaml` included in the repo to create a Web Service (`fra-backend`) and a managed Postgres (`fra-db`).
- Environment variables (set in Render web service settings or via `render.yaml`):
  - `DATABASE_URL` (Render will wire this automatically when using `fromDatabase` in `render.yaml`)
  - `NODE_ENV=production`
- Build & start:
  - `buildCommand` runs `npm install && npm run backend:migrate` which initializes DB schema and seeds data.
  - `startCommand` runs `npm run server` (uses `tsx server/index.ts`).

Local testing:

- To run Postgres locally and migrate, set `DATABASE_URL` and run:

```bash
export DATABASE_URL="postgres://user:pass@localhost:5432/fra_dev"
npm run backend:migrate
npm run server
```

Notes:
- The server will prefer Postgres when `DATABASE_URL` is set; otherwise it falls back to the existing SQLite adapter for local dev.
- After deploy, set `VITE_API_BASE_URL` in your frontend build pipeline to the deployed backend URL (e.g., `https://fra-backend.onrender.com/api/v1`).
