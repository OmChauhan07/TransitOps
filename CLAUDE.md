# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Backend
- Install dependencies: `cd backend && npm install`
- Start dev server: `cd backend && npm run dev` (runs on http://localhost:3000)
- Run database migrations: `npx prisma db push`
- Seed database: `npx prisma db seed`
- Lint: No lint script configured; use `npx eslint .` if needed

### Frontend
- Install dependencies: `cd frontend && npm install`
- Start dev server: `cd frontend && npm run dev` (runs on http://localhost:5173)
- Build for production: `cd frontend && npm run build`
- Preview build: `cd frontend && npm run preview`
- Lint: `cd frontend && npm run lint`

### Testing
- No test scripts defined in package.json. To run tests, add appropriate test framework (e.g., Jest) and configure scripts.

## Code Architecture

### High-Level Structure
- **backend/**: Node.js/Express server with Prisma ORM
  - `src/`: Source code
    - `controllers/`: Request handlers for each resource (auth, vehicle, driver, trip, maintenance, finance, dashboard, analytics)
    - `routes/`: Express route definitions
    - `services/`: Business logic layer
    - `config/`: Database and mailer configuration
    - `middlewares/`: Custom middleware (auth)
    - `app.js`: Express app setup
    - `index.js`: Server entry point
  - `prisma/`: Prisma schema and seed data
  - `.env`: Environment variables (DATABASE_URL, JWT_SECRET, RESEND_API_KEY)
  - `package.json`: Backend dependencies and scripts

- **frontend/**: React application built with Vite
  - `src/`: Source code
    - Components, pages, hooks, contexts (structure inferred from typical React+Vite)
  - `public/`: Static assets
  - `index.html`: Entry HTML
  - `vite.config.js`: Vite configuration
  - `eslint.config.js`: ESLint configuration
  - `package.json`: Frontend dependencies and scripts

### Key Technologies
- **Frontend**: React 19, Vite, Tailwind CSS, React Router v6, Recharts (charts), Lucide React (icons), Motion (animations), Axios (HTTP client), JWT-decode (token handling)
- **Backend**: Node.js, Express.js, Prisma ORM (with Neon PostgreSQL), bcryptjs (password hashing), jsonwebtoken (JWT), nodemailer + Resend (OTP emails), cors, dotenv
- **Database**: Neon Serverless PostgreSQL via Prisma
- **Auth**: JWT-based authentication with OTP verification via email (Resend). Role-based access control (RBAC) with roles: FLEET_MANAGER, DRIVER, SAFETY_OFFICER, FINANCIAL_ANALYST

### Core Features (per README)
1. Role-Based Access Control (RBAC)
2. Vehicle & Driver Registry (CRUD)
3. Trip Dispatch Board (create, dispatch, track trips)
4. Maintenance & Expense Tracking
5. Reports & Analytics (KPIs, charts, CSV export)

### Environment Setup
1. Clone repo
2. Backend: create `.env` from `.env.example`, set DATABASE_URL, JWT_SECRET, RESEND_API_KEY
3. Run `npx prisma db push` and `npx prisma db seed`
4. Start backend (`npm run dev` in backend)
5. Frontend: create `.env` if needed (currently only example), run `npm install` then `npm run dev`

## Notes
- Default seed users exist after running prisma seed; OTP sent to email on login.
- Backend runs on port 3000, frontend on port 5173 by default.
- No configured test suite; testing must be added manually.