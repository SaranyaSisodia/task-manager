# TaskFlow — Task Management System

A full-stack Task Management System built with **Node.js + TypeScript + Prisma** (backend) and **Next.js + TypeScript + Tailwind CSS** (frontend).

---

## Prerequisites

Before running this project, make sure you have:

| Tool | Version | Install |
|------|---------|---------|
| Node.js | v18+ | https://nodejs.org |
| npm | v9+ | Comes with Node.js |
| Git | Any | https://git-scm.com |

Verify your versions:
```bash
node --version   # Should be v18 or higher
npm --version    # Should be v9 or higher
git --version
```

---

## Project Structure

```
task-manager/
├── backend/               # Node.js + TypeScript API
│   ├── prisma/
│   │   └── schema.prisma  # Database schema (tables)
│   ├── src/
│   │   ├── controllers/   # Handle HTTP requests/responses
│   │   ├── middleware/     # Auth guard, validation
│   │   ├── routes/        # URL definitions
│   │   ├── services/      # Business logic
│   │   ├── types/         # TypeScript interfaces
│   │   ├── utils/         # JWT helpers, Prisma client
│   │   └── index.ts       # Server entry point
│   ├── .env               # Environment variables (create this)
│   └── package.json
│
└── frontend/              # Next.js 14 App Router
    ├── src/
    │   ├── app/           # Pages (App Router)
    │   │   ├── page.tsx           # Landing page
    │   │   ├── auth/login/        # Login page
    │   │   ├── auth/register/     # Register page
    │   │   └── dashboard/         # Main task dashboard
    │   ├── components/
    │   │   ├── layout/    # Navbar
    │   │   ├── tasks/     # TaskCard, TaskForm, filters
    │   │   └── ui/        # Button, Input, Modal, Badge
    │   ├── hooks/         # useAuth, useTasks
    │   ├── lib/           # axios client, API functions
    │   └── types/         # TypeScript interfaces
    └── package.json
```

---

## Quick Start (Local Development)

### Step 1 — Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/task-manager.git
cd task-manager
```

### Step 2 — Set up the Backend
```bash
cd backend

# Install dependencies
npm install

# Create your environment file
copy .env.example .env       # Windows
# cp .env.example .env       # Mac/Linux

# Generate Prisma client and create the database
npx prisma generate
npx prisma migrate dev --name init

# Start the development server
npm run dev
```

Backend runs at: **http://localhost:5000**  
Test it: **http://localhost:5000/health**

### Step 3 — Set up the Frontend (new terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend runs at: **http://localhost:3000**

---

## API Reference

### Authentication

| Method | Endpoint | Body | Auth Required |
|--------|----------|------|---------------|
| POST | `/auth/register` | `{name, email, password}` | No |
| POST | `/auth/login` | `{email, password}` | No |
| POST | `/auth/refresh` | `{refreshToken}` | No |
| POST | `/auth/logout` | — | Yes |

### Tasks

| Method | Endpoint | Query Params | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/tasks` | `page, limit, status, search` | Yes |
| POST | `/tasks` | — | Yes |
| GET | `/tasks/:id` | — | Yes |
| PATCH | `/tasks/:id` | — | Yes |
| DELETE | `/tasks/:id` | — | Yes |
| PATCH | `/tasks/:id/toggle` | — | Yes |

All protected routes require: `Authorization: Bearer <accessToken>`

---

## Tech Stack

### Backend
- **Node.js + Express** — HTTP server
- **TypeScript** — Type safety
- **Prisma** — ORM / database toolkit
- **SQLite** — Database (file-based, zero setup)
- **JWT** — Authentication tokens
- **bcryptjs** — Password hashing

### Frontend
- **Next.js 14** — React framework (App Router)
- **TypeScript** — Type safety
- **Tailwind CSS** — Styling
- **axios** — HTTP client with interceptors
- **react-hook-form** — Form management
- **react-hot-toast** — Toast notifications
- **lucide-react** — Icons
- **date-fns** — Date formatting

---

## Deployment

### Backend → Railway
1. Push code to GitHub
2. Go to railway.app → New Project → Deploy from GitHub
3. Select the `/backend` folder
4. Add environment variables from `.env.example`
5. Railway auto-detects Node.js and deploys

### Frontend → Vercel
1. Go to vercel.com → New Project → Import from GitHub
2. Set **Root Directory** to `frontend`
3. Add env variable: `NEXT_PUBLIC_API_URL=https://your-railway-url.railway.app`
4. Deploy

---

## Features

- ✅ User registration and login with JWT authentication
- ✅ Access token (15min) + Refresh token (7 days) strategy
- ✅ Password hashing with bcrypt
- ✅ Full task CRUD (Create, Read, Update, Delete)
- ✅ Task status toggle (Pending → In Progress → Completed → Pending)
- ✅ Pagination, status filtering, and title search
- ✅ Priority levels (Low / Medium / High)
- ✅ Due date support with overdue detection
- ✅ Responsive design (mobile + desktop)
- ✅ Toast notifications for all actions
- ✅ Loading skeletons and empty states
- ✅ Auto token refresh on 401 responses
