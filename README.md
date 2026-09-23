# DevHire

Full-stack job board for developer roles at Indian startups. Employers post openings, candidates browse and filter them.

## Live Demo

🔗 **https://devhire-neon.vercel.app**

## App Overview

![Hero — Find your next role](public/screenshots/screenshot-1-hero.png)

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS |
| Backend | Node.js, Express, MongoDB Atlas, Mongoose |
| Auth | JWT, bcrypt |
| Deploy | Vercel (frontend) · Render (backend) |

## Features

- Browse job listings with search, stack filters, and sorting
- Register / login with JWT authentication (bcrypt-hashed passwords)
- Post a job (protected — authenticated users only)
- Job detail pages
- Dark / light mode with persistence
- Responsive layout, loading and error states on all async operations

## Local development

### Backend
```bash
cd server
npm install
npm run dev       # http://localhost:5001
```

### Frontend
```bash
npm install
npm run dev       # http://localhost:5173
```

### Environment variables

`/server/.env`:

PORT=5001
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
CORS_ORIGINS=https://your-frontend-domain

`/.env` (frontend, optional — defaults to localhost):

VITE_API_URL=http://localhost:5001/api

## API

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Login, returns JWT |
| GET | `/api/jobs` | — | Fetch all jobs |
| GET | `/api/jobs/:id` | — | Fetch single job |
| POST | `/api/jobs` | ✓ | Create a job |
| PUT | `/api/jobs/:id` | ✓ | Update own job |
| DELETE | `/api/jobs/:id` | ✓ | Delete own job |

## Roadmap

- [x] Backend REST API with JWT auth
- [x] MongoDB Atlas integration
- [x] Job listings, filters, search, detail pages
- [x] Post a job (protected)
- [x] Deploy to Vercel + Render
- [ ] AI-powered candidate–JD matching
- [ ] Cover letter generation
