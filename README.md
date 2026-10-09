# Mini SaaS Template Store

A full-stack app where users can register, log in, browse templates, and save their favorites.

**Name:** Nithya  
**Contact:** nithya4648@gmail.com

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** SQLite (via Knex.js, no install needed)
- **Auth:** JWT + bcrypt password hashing

## Setup

You need Node.js 18+ installed.

### 1. Backend
```bash
cd server
npm install
cp .env.example .env     # on Windows: copy .env.example .env
npm start
```
Runs on http://localhost:5000. The database file is created and **7 sample templates are seeded automatically** on first start.

### 2. Frontend (new terminal)
```bash
cd client
npm install
cp .env.example .env     # on Windows: copy .env.example .env
npm run dev
```
Open http://localhost:5173

## API

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | No | Register (name, email, password) |
| POST | /api/auth/login | No | Login, returns JWT |
| GET | /api/templates | No | List templates (`?search=` and `?category=` supported) |
| GET | /api/templates/:id | No | Template details |
| POST | /api/favorites/:templateId | Yes | Add to favorites |
| GET | /api/favorites | Yes | Logged-in user's favorites |
| DELETE | /api/favorites/:templateId | Yes | Remove from favorites (extra) |

## Features
- Register / Login with validation and proper status codes
- JWT stored in localStorage, sent via Axios interceptor
- Template cards with image, title, description, Favorite button
- Already-favorited templates are highlighted
- Protected `/favorites` route (redirects to login)
- Search and category filter, Logout button (bonus)

## Deployment (optional)
- Backend (Render): root `server`, build `npm install`, start `npm start`, set `JWT_SECRET` and `CLIENT_ORIGIN` (your frontend URL).
- Frontend (Vercel/Netlify): root `client`, build `npm run build`, output `dist`, set `VITE_API_URL` to `https://<your-backend>/api`. Add a rewrite of all routes to `/index.html` for React Router.
