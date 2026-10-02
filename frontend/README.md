# Doctor Tracker – Frontend (Next.js Application)

This is the standalone Next.js frontend application for the Doctor Tracker clinical management system.

## Features
- **Next.js App Router** with SSR/CSR hydration & optimized layout
- **Authentication Gateway**: JWT token storage, automatic authorization header injection, demo role quick-fill
- **Clinical Dashboard**: Live telemetry metrics, interactive area chart (intake vs discharges), specialty distribution donut chart, provider workload capacity table, live triage feed
- **Physician Roster**: Paginated directory, search & multi-tier filters (duty status, specialization, hospital), caseload patient slide-over drawer, 3-step registration modal with NPI validation
- **Patient Census & EHR**: Comprehensive census table, acuity triage badges, bulk operations (export, reassign, transfer, mark critical), admitting & editing workflows, clinical timeline drawer
- **Clinical Analytics & Telemetry**: Census latency telemetry, provider capacity metrics, department breakdowns
- **Hospital System Settings**: Enterprise node configuration, security policies, campus switcher

## Directory Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout with fonts & metadata
│   │   ├── globals.css        # Tailwind CSS directives & global rules
│   │   ├── page.tsx           # Home portal router / dashboard
│   │   ├── login/page.tsx     # Dedicated login / registration portal
│   │   ├── doctors/page.tsx   # Doctor directory & caseload management
│   │   ├── patients/page.tsx  # Patient census & admission management
│   │   ├── analytics/page.tsx # Analytics & telemetry deep dive
│   │   └── settings/page.tsx  # Hospital node configuration
│   ├── components/            # Reusable UI components & modals
│   └── lib/                   # API client with JWT interceptor
├── .env.example
├── next.config.mjs
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── tsconfig.json
```

## Getting Started

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
```
Parameters:
- `BACKEND_API_URL="http://localhost:5000"` (Used by Next.js server rewrites)
- `NEXT_PUBLIC_API_URL="http://localhost:5000/api"` (Used by client-side browser fetch)

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Production Build & Start
```bash
npm run build
npm start
```
