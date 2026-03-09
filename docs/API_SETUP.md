# Express API Setup

The frontend expects the Express API to run in a **separate folder** (e.g. `../job-portal-api`).

## Quick Start

1. Copy env: `cp .env.example .env.local`
2. Set `NEXT_PUBLIC_API_URL` to your Express URL (default: `http://localhost:3001`)
3. Run Express API on port 3001 (or update `.env.local`)
4. Run frontend: `npm run dev`

## Two Ways to Connect

### Option A: Proxy (recommended for dev)

Avoids CORS. Frontend calls `/api/backend/*` → Next.js proxies to Express.

1. `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=/api/backend
   BACKEND_URL=http://localhost:3001
   ```
2. Express runs on port 3001 (no CORS needed)
3. `fetcher('/jobs')` → `GET http://localhost:3000/api/backend/jobs` → proxied to Express `/jobs`

### Option B: Direct

Frontend calls Express directly.

1. `.env.local`:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```
2. Express must enable CORS for `http://localhost:3000`:
   ```js
   app.use(cors({ origin: 'http://localhost:3000' }));
   ```

## Usage

```ts
import { fetcher } from "@/services";

// GET /jobs
const jobs = await fetcher("/jobs");

// POST /jobs
const job = await fetcher("/jobs", {
  method: "POST",
  body: JSON.stringify({ title: "Developer" }),
});
```
