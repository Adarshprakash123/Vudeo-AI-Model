# QRT Studio

Production-ready full-stack starter for a modern AI content dashboard with mocked image generation.

## Stack

- Frontend: Next.js App Router, Tailwind CSS, Redux Toolkit, Axios, React Hot Toast
- Backend: Node.js, Express, MongoDB, Mongoose, JWT auth with HTTP-only cookies

## Project Structure

```bash
.
├── backend
└── frontend
```

## Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env`:

```env
PORT=5001
MONGODB_URI=mongodb://127.0.0.1:27017/qrt-studio
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

Run backend:

```bash
npm run dev
```

## Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Update `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

Run frontend:

```bash
npm run dev
```

## Features

- JWT authentication with secure HTTP-only cookies
- Register, login, current-user session hydration, logout
- Protected dashboard route
- Sidebar-driven dark SaaS dashboard UI
- Mock image generation via Picsum placeholders
- Image listing, favorite toggling, mock uploads
- Redux Toolkit slices for auth and image state
- Loading states, error handling, and toast notifications

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

### Images

- `POST /api/images/generate`
- `GET /api/images`
- `PATCH /api/images/favorite/:id`
- `POST /api/images/upload`

## Notes

- No external AI provider is integrated yet.
- Image generation is intentionally mocked with `https://picsum.photos`.
- Uploads are mock entries saved into MongoDB for UI/demo flows.
