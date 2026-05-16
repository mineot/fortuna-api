# @repo/web

Angular frontend layer for Project Fortuna.

Main responsibilities:
- provide the web application shell and routing
- consume `@repo/api` through a centralized HTTP client
- apply route protection and auth session rules
- keep UI concerns isolated from persistence/backend internals

This package must never access the database directly.

## Runtime and environment

### `.env` loading
`dev`, `build`, and `typecheck` load the workspace root `.env`:

```bash
pnpm --filter @repo/web run dev
pnpm --filter @repo/web run build
pnpm --filter @repo/web run typecheck
```

### `FORTUNA_ENV`
Used by `packages/web/scripts/env.mjs`:
- `DEV`: applies default local values when variables are missing
- `PROD`: requires mandatory variables and fails fast on startup/build when missing

### Required environment variables in `PROD`
- `FORTUNA_WEB_PORT`
- `FORTUNA_API_PORT`
- `FORTUNA_WEB_URL`
- `FORTUNA_API_BASE_URL`

## Web conventions

- API base URL comes from runtime config (`appEnv.apiBaseUrl`)
- HTTP access goes through `ApiClientService`
- Request auth uses `Authorization: Bearer <token>` via interceptor
- `401/403` responses clear session and redirect to `/login`
- Guards:
- `AuthGuard`: blocks protected routes when unauthenticated
- `GuestGuard`: blocks login route when already authenticated

## Authentication (current)

- Access token is stored in memory and mirrored in `sessionStorage`
- Session is restored on app bootstrap via `APP_INITIALIZER`
- Auth endpoints consumed by web:
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

## Scripts

```bash
pnpm --filter @repo/web run dev
pnpm --filter @repo/web run build
pnpm --filter @repo/web run typecheck
pnpm --filter @repo/web run test
```

## Test coverage (current)

Unit tests currently cover critical auth/session behavior:
- `AuthSessionService` token store/restore and non-browser safety
- `AuthService` login token persistence
- `AuthService` logout session cleanup on API failure
