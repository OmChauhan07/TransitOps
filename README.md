# TransitOps

TransitOps is a modern, full-stack fleet management application designed to handle end-to-end logistics operations. It provides a centralized platform for managing vehicles, drivers, dispatching trips, tracking maintenance, and analyzing fleet ROI.

## Features

- **Role-Based Access Control (RBAC):** Secure authentication with OTP verification and distinct roles (`FLEET_MANAGER`, `DRIVER`, `SAFETY_OFFICER`, `FINANCIAL_ANALYST`) that strictly govern access to specific modules.
- **Vehicle & Driver Registry:** Full CRUD management for the company's fleet assets and driver profiles.
- **Trip Dispatch Board:** Create, dispatch, and track trips from source to destination. Automatically manages vehicle and driver availability constraints.
- **Maintenance & Expense Tracking:** Log maintenance tickets, fuel consumption, and operational expenses against specific vehicles to calculate true operational costs.
- **Reports & Analytics:** A dedicated analytics dashboard featuring key performance indicators (KPIs), charts for Revenue vs. Cost, and ROI metrics per vehicle. Includes client-side CSV export functionality.

## Tech Stack

### Frontend
- **Framework:** React (bootstrapped with Vite)
- **Styling:** Tailwind CSS (Dark mode aesthetic)
- **Routing:** React Router v6
- **Data Visualization:** Recharts
- **Icons:** Lucide React

### Backend
- **Server:** Node.js with Express.js
- **Database ORM:** Prisma
- **Database:** Neon (Serverless PostgreSQL)
- **Authentication:** JWT (JSON Web Tokens) & Resend (for Email OTPs)

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- A Neon PostgreSQL database URL
- A Resend API key for sending OTP emails

### 1. Clone the repository
```bash
git clone https://github.com/OmChauhan07/TransitOps.git
cd TransitOps
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory and add the following variables:
```env
# Database connection string from Neon
DATABASE_URL="postgresql://<user>:<password>@<host>.neon.tech/<dbname>?sslmode=require"

# Secret key for signing JWTs
JWT_SECRET="your-super-secret-jwt-key"

# Resend API key for OTP emails
RESEND_API_KEY="re_..."
```

Run database migrations and seed the database with initial users:
```bash
npx prisma db push
npx prisma db seed
```

Start the backend development server:
```bash
npm run dev
# Server will start on http://localhost:3000
```

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
# Server will start on http://localhost:5173
```

## Default Seed Users
If you ran `npx prisma db seed`, you can log in with the following credentials (an OTP is sent to the email during login, so ensure you have access to the inbox or check the server console if you bypass email in dev mode):

- **Fleet Manager:** `manager@transitops.demo`
- **Driver:** `driver@transitops.demo`
- **Safety Officer:** `safety@transitops.demo`
- **Financial Analyst:** `finance@transitops.demo`

## License
MIT License
