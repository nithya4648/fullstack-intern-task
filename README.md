# Mini SaaS Template Store

A full-stack app where users can register, log in, browse templates, and save their favorites.

**Name:** Nithya  
**Contact:** nithya4648@gmail.com

## Live Demo
- **Frontend App:** [https://client-mu-khaki-63.vercel.app](https://client-mu-khaki-63.vercel.app)
- **Backend API:** [https://fullstack-intern-task-cq3g.onrender.com](https://fullstack-intern-task-cq3g.onrender.com)

> **Note:** The backend is hosted on Render's free tier. If the server is idle, the initial request may take about 60 seconds to wake up.

## Tech Stack
- **Frontend:** React (Vite), Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT + bcrypt password hashing

## Setup

You need Node.js 18+ installed.

### 1. Backend
```bash
cd server
npm install
cp .env.example .env     # on Windows: copy .env.example .env
```
Ensure `MONGODB_URI` in `server/.env` is set to a valid MongoDB connection string (e.g. MongoDB Atlas).
```bash
npm start
```
Runs on http://localhost:5000. **7 sample templates are seeded automatically** on first start.

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

## Deployment
- **Backend (Render):**
  - Root directory: `server`
  - Build command: `npm install`
  - Start command: `npm start`
  - Environment variables:
    - `MONGODB_URI`: MongoDB Atlas connection string
    - `JWT_SECRET`: Secret key for JWT tokens
    - `CLIENT_URL`: `https://client-mu-khaki-63.vercel.app` (Frontend CORS origin)
- **Frontend (Vercel):**
  - Root directory: `client`
  - Build command: `npm run build`
  - Output directory: `dist`
  - Environment variable: `VITE_API_URL` set to `https://fullstack-intern-task-cq3g.onrender.com/api`
  - Rewrites configuration in `client/vercel.json` for React Router client-side routing fallback.
