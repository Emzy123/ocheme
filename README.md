# Emmanuel Ocheme — Personal Portfolio

Production-ready full-stack portfolio: **React 18 + Vite + TypeScript + TailwindCSS + shadcn-style UI** on the frontend, **Express + MongoDB + JWT + Cloudinary** on the backend.

## Prerequisites

- Node.js 20+
- MongoDB Atlas cluster (connection string)
- Cloudinary account (for admin image uploads)

## Quick start

### 1. Backend

```bash
cd backend
cp .env.example .env
# Edit .env: MONGODB_URI, JWT_SECRET, CORS_ORIGIN=http://localhost:5173, Cloudinary vars, ADMIN_EMAIL, ADMIN_PASSWORD
npm install
npm run seed
npm run dev
```

API runs at `http://localhost:5000` (`GET /api/health`).

### 2. Frontend

```bash
cd frontend
cp .env.example .env
# Optional: VITE_API_URL= — leave empty to use Vite dev proxy to the backend
npm install
npm run dev
```

App runs at `http://localhost:5173`.

### Default admin (change after first login)

Use the same values as in `.env` after seeding (defaults in `.env.example`):

- Email: `admin@emmanuelocheme.com`
- Password: `QuantroAdmin2025!`

## Scripts

| Location   | Command        | Description                |
|-----------|----------------|----------------------------|
| `backend` | `npm run dev`  | Dev server (tsx watch)     |
| `backend` | `npm run build`| Compile to `dist/`         |
| `backend` | `npm start`    | Run compiled API           |
| `backend` | `npm run seed` | Seed MongoDB content + admin |
| `frontend`| `npm run dev`  | Vite dev server            |
| `frontend`| `npm run build`| Production build           |

## Deployment

### Frontend (Vercel)

1. Root directory: `frontend`
2. Build command: `npm run build`
3. Output: `dist`
4. Environment: `VITE_API_URL=https://your-backend-host` (no trailing slash; requests use `/api/...`)

`vercel.json` rewrites SPA routes to `index.html`.

### Backend (Render / Railway)

1. Root directory: `backend`
2. Build: `npm install && npm run build`
3. Start: `npm start`
4. Set env: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CORS_ORIGIN` (your Vercel URL), `CLOUDINARY_*`, `ADMIN_*`

See [`render.yaml`](render.yaml) as a starting point; bind secrets in the host dashboard.

### MongoDB Atlas

- Allow network access from `0.0.0.0/0` for managed hosts, or restrict to Render/Railway egress IPs in production.
- Use a strong database user password.

### Cloudinary

If Cloudinary env vars are missing, `POST /api/admin/upload` returns **503** — paste image URLs manually or configure Cloudinary.

## API overview

- **Public:** `GET /api/hero`, `/api/about`, `/api/projects`, `/api/projects/:slug`, `/api/posts`, `/api/posts/:slug`, `POST /api/contact`
- **Admin:** `POST /api/admin/login`, `PUT /api/admin/hero`, `PUT /api/admin/about`, CRUD projects/posts/messages, `POST /api/admin/upload` (JWT required)

## Project structure

- [`backend/`](backend/) — Express API, Mongoose models, seed script
- [`frontend/`](frontend/) — Vite SPA, public site + `/admin` dashboard

## License

Private / all rights reserved unless otherwise stated by the author.
