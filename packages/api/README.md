# @repo/api

HTTP API layer for Project Fortuna.

Main responsibilities:
- expose REST endpoints with Hono
- orchestrate `@repo/database` repositories
- validate request `params/query/body`
- normalize success/error payloads
- keep API concerns separate from domain/persistence internals

This package must not execute raw SQL directly.

## Runtime and environment

### `.env` loading
`start` uses Node `--env-file` and reads the workspace root `.env`:

```bash
pnpm --filter @repo/api run start
```

### `FORTUNA_ENV`
Used by `@repo/database` adapter resolution:
- `DEV`: uses project root `./dev.db`
- `PROD`: uses `FORTUNA_DB` or falls back to `~/.fortuna/fortuna.db`

### `PORT`
- Optional HTTP port for the API server.
- Default: `3000`.

## API conventions

- Base path: `/api/v1`
- Health route: `GET /health`
- Success envelope:
- `{ data: <payload>, request_id: <uuid> }`
- Error envelope:
- domain: `{ code, message, request_id }`
- validation: `{ code: 'VALIDATION_ERROR', message, fields, request_id }`

## Authentication (MVP)

Protected routes require header:

```txt
x-user-id: <positive-integer>
```

Current auth is middleware-based (`x-user-id`) and can be replaced later by token/session auth without changing module handlers.

## Implemented modules

- `users`
- `user-settings`
- `account-types`
- `accounts`
- `category-groups`
- `categories`
- `payees`
- `transactions`
- `transfers`
- `recurring-transactions`
- `credit-cards`
- `credit-card-statements`
- `credit-card-purchases`
- `credit-card-installments`
- `credit-card-statement-payments`
- `reports`

## Scripts

```bash
pnpm --filter @repo/api run build
pnpm --filter @repo/api run typecheck
pnpm --filter @repo/api run test
pnpm --filter @repo/api run start
```

## Test coverage (current)

Integration tests currently cover critical API flows:
- transactions create/list
- transfers create/list
- credit card statement payment registration and paid-state reconciliation
