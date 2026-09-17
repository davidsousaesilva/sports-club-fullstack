# Sports Club Full-Stack Platform — Frontend

React single-page application (SPA) for the Sports Club Full-Stack Platform. It provides role-aware workflows for athletes, coaches, staff, and managers, including club configuration, team and activity management, attendance and performance tracking, finance workflows, and analytics.

For the complete project overview and Docker-based setup, see the [root README](../README.md).

## Technology stack

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- React Router
- Vercel for deployment

## Main capabilities

- Authentication, session handling, protected routes, and role-based access control
- People, profile, role, and notification management
- Sports modalities, statistic types, and sports-complex configuration
- Team and team-member management
- Calendar, training, event, and competition management
- Attendance and athlete performance tracking
- Membership-fee and payment-record workflows
- Financial and sports dashboards and reports

## Project structure

```text
frontend/
├── docs/                     # Frontend documentation
├── public/                   # Static assets and branding
├── src/
│   ├── app/                  # Application bootstrap, providers, and routing
│   ├── config/               # Environment, API, and authentication configuration
│   ├── lib/                  # Shared infrastructure: HTTP client, auth utilities, query client
│   ├── shared/               # Reusable UI, shell, hooks, utilities, and styles
│   ├── features/             # Business features organised by domain
│   └── layouts/              # Public and authenticated layouts
├── Dockerfile
├── package.json
└── vite.config.*
```

## Feature organisation

The `src/features` directory groups code by business capability. A feature may contain API operations, components, hooks, models, pages, and a barrel export.

```text
feature/
├── api/          # Backend communication for the feature
├── components/   # Feature-specific UI components
├── hooks/        # Presentation and data-access hooks
├── model/        # Types, mappers, and mocks
├── pages/        # Feature pages
└── index.ts      # Public feature exports
```

Current functional areas include:

- `auth` — authentication, session lifecycle, permissions, and route protection
- `landing` — public landing page
- `identity` — people, profiles, roles, and notifications
- `sportscore` — modalities, statistic types, and club configuration
- `teams` — teams and memberships
- `activities` — calendar, training sessions, events, and competitions
- `activity-tracking` — attendance, performance, and self-guided training
- `finance` — fees, payments, and finance workflows
- `analytics` — dashboard, financial reports, and sports reports

## Configuration

Frontend configuration is centralised in `src/config/env.ts`:

```ts
export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
  authMode: import.meta.env.VITE_AUTH_MODE ?? "real",
} as const;
```

The supported public variables are:

| Variable            | Purpose                     | Default                 |
| ------------------- | --------------------------- | ----------------------- |
| `VITE_API_BASE_URL` | Base URL of the backend API | `http://localhost:8080` |
| `VITE_AUTH_MODE`    | Authentication mode         | `real`                  |

For local development without Docker, create `frontend/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_AUTH_MODE=real
```

For Docker, these variables are supplied as Docker build arguments through the root `docker-compose.yml`.

## Authentication and route protection

The frontend route layer controls navigation and authenticated layouts, while the backend remains responsible for authorising protected resources.

The authentication flow supports:

- Authentication restoration during application startup;
- Protected route handling;
- Role-aware navigation and views;
- Handling of `401 Unauthorized` responses;
- Handling of `403 Forbidden` responses;
- Logout and client-state cleanup;
- Session and token refresh behaviour through the shared HTTP/auth infrastructure.

When cookies are used for authentication, requests use the configured credentials policy. When bearer access tokens are used, header injection and refresh handling are centralised in the HTTP client.

## TanStack Query and stale data

TanStack Query manages server state and cache invalidation. Mutations invalidate or update affected queries explicitly.

For concurrent edits, the backend may return `409 Conflict` when optimistic locking detects that the record changed after it was loaded. The frontend handles this by refetching the current representation and presenting the conflict state instead of silently replacing the newer server data.

The mutation flow is:

```text
load entity with version
  │
edit locally
  │
PUT/PATCH with expected version or If-Match
  │
├── 2xx: update or invalidate the query cache
└── 409: refetch and present the conflict state
```

Idempotency and optimistic locking have separate responsibilities. Idempotency applies to repeated operations such as payment retries; optimistic locking applies to concurrent updates of the same resource.

## Run with Docker

From the repository root:

```bash
docker compose up --build
```

The frontend is available at:

```text
http://localhost:3000
```

The Docker image builds the Vite application and serves the generated static assets through Nginx.

Because Vite reads `VITE_*` values at build time, changing `VITE_API_BASE_URL` or `VITE_AUTH_MODE` requires rebuilding the image:

```bash
docker compose up --build
```

## Run locally without Docker

### Prerequisites

- Node.js 20 or newer
- npm
- A running backend API, unless mock mode supports the functionality being tested

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview a production build

```bash
npm run preview
```

## Deployment

The frontend was deployed on Vercel. Production values for `VITE_API_BASE_URL` and `VITE_AUTH_MODE` were configured in the Vercel project environment settings and applied when Vite built the application.
