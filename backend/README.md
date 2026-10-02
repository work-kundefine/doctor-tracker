# Doctor Tracker – Backend API (Node.js + Express + MongoDB)

This is the standalone backend application for Doctor Tracker.

## Features
- **Node.js + Express + TypeScript**
- **MongoDB & Mongoose ODM** with indexed collections (`User`, `Doctor`, `Patient`)
- **JWT Authentication** with password hashing (`bcryptjs`)
- **Strict Architecture**: `Route` -> `Controller` -> `Validate Request (Zod)` -> `DTO` -> `Services`
- **Embedded fallback mode**: Automatic resilient fallback data store if external MongoDB is offline during local test/development.

## Directory Structure
```
backend/
├── src/
│   ├── config/          # MongoDB connection & initial DB seeding
│   ├── controllers/     # Request orchestration & HTTP response mapping
│   ├── dto/             # Data Transfer Objects (contracts)
│   ├── middlewares/     # JWT Auth & Zod Request Validator middlewares
│   ├── models/          # Mongoose schemas & TypeScript Document types
│   ├── routes/          # Express route definitions
│   ├── services/        # Core business logic & database queries
│   ├── validators/      # Zod validation schemas
│   └── server.ts        # Standalone Express application entry point
├── .env.example
├── package.json
└── tsconfig.json
```

## Getting Started

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```
Default parameters:
- `PORT=5000`
- `MONGODB_URI="mongodb://127.0.0.1:27017/doctortracker"`
- `JWT_SECRET="clinical_intelligence_doctortracker_jwt_secret_token_2026"`
- `JWT_EXPIRES_IN="12h"`

### 3. Run Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5000` with hot-reloading.

### 4. Build & Production Start
```bash
npm run build
npm start
```
