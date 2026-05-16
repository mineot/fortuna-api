# @repo/database

Persistence layer for Project Fortuna.

Main responsibilities:
- typed SQLite client with Kysely
- versioned migrations with `up/down`
- idempotent seeds
- data-access repositories

## Environment variables

### `FORTUNA_ENV`
- `DEV`: uses a local database at the project root: `./dev.db`
- `PROD`: tries `FORTUNA_DB`; if missing/invalid, falls back to `~/.fortuna/fortuna.db`

### `FORTUNA_DB`
- Used when `FORTUNA_ENV=PROD`.
- Must point to a valid database file path (including filename).

## Migrations

Migrations are reconciled against the root `package.json` version.

Rule:
- Migrations with `migration.version <= app.version` run `up`.
- Applied migrations not included in target version run `down`.

Control table:
- `migration` (`migration_id`, `version`, `applied_at`)

### Commands

```bash
pnpm --filter @repo/database run migrate
pnpm --filter @repo/database run migrate:status
```

### Useful options

```bash
# Reconcile to a specific version
pnpm --filter @repo/database exec tsx src/migrations/index.ts reconcile --target=0.1.0

# Status for a specific version
pnpm --filter @repo/database exec tsx src/migrations/index.ts status --target=0.1.0

# Force a specific database file (for local/temp runs)
pnpm --filter @repo/database exec tsx src/migrations/index.ts status --database-url=/tmp/fortuna.db
```

## Seeds

Available seed modes:
- `account-types`
- `categories` (requires `--user-id`)
- `all` (default, requires `--user-id`)

### Commands

```bash
pnpm --filter @repo/database run seed:account-types
pnpm --filter @repo/database run seed -- categories --user-id=1
pnpm --filter @repo/database run seed -- all --user-id=1
```

### Options

```bash
# Specific database
pnpm --filter @repo/database run seed -- all --user-id=1 --database-url=/tmp/fortuna.db
```

## Recommended local bootstrap

```bash
pnpm --filter @repo/database run migrate
pnpm --filter @repo/database run seed:account-types
pnpm --filter @repo/database run seed -- categories --user-id=1
```

## Quality

```bash
pnpm --filter @repo/database run typecheck
pnpm --filter @repo/database run test
```

Current test coverage includes:
- migration `up/down` versioning behavior
- protection against unknown applied migrations
- seed idempotency
- repository CRUD/ownership rules
- credit card flow (purchase -> installments -> payment -> transaction)
