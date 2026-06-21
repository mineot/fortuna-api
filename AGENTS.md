# Fortuna — AGENTS.md

## Stack

AdonisJS 7 / InertiaJS + Vue 3 / SQLite (better-sqlite3) / Lucid ORM / TypeScript 6 / pnpm

Node >=24. ESM (`"type": "module"`). SSR is **disabled**.

## Commands

| Command             | What it runs                                                       |
| ------------------- | ------------------------------------------------------------------ |
| `npm run dev`       | `node ace serve --hmr`                                             |
| `npm run build`     | `node ace build`                                                   |
| `npm run test`      | `node ace test` (runs all suites)                                  |
| `npm run lint`      | `eslint .`                                                         |
| `npm run format`    | `prettier --write .`                                               |
| `npm run typecheck` | `tsc --noEmit && vue-tsc --noEmit --project inertia/tsconfig.json` |

## Test suites

Defined in `adonisrc.ts` `tests.suites`:

- `unit` (2s timeout) — `tests/unit/**/*.spec.{ts,js}`
- `functional` (30s timeout) — `tests/functional/**/*.spec.{ts,js}`
- `browser` (300s timeout) — `tests/browser/**/*.spec.{ts,js}`

Functional/browser suites auto-start HTTP server via `testUtils.httpServer().start()`. Tests bootstrap at `tests/bootstrap.ts` — uses `dbAssertions` plugin, `forceExit: false`.

## Import aliases (package.json `imports`)

`#controllers/*`, `#models/*`, `#services/*`, `#validators/*`, `#config/*`, `#start/*`, `#generated/*` ⇒ `.adonisjs/server/*.js`, etc.
Inertia: `~/` ⇒ `inertia/`, `@generated` ⇒ `.adonisjs/client/`.

## Generated code

`.adonisjs/` is **tracked** in git (not in .gitignore). Regenerated on `node ace serve` / `node ace build` via `adonisrc.ts` hooks (`indexEntities`, `indexPages`, `generateRegistry`). If imports from `#generated/` fail, restart the dev server.

## Architecture highlights

- **Money** — stored as integer cents. Use `toCents()` / `centsToMoney()` / `money()` from `#services/money`. Never `toFixed(2)`.
- **API responses** — custom `ApiSerializer` wraps payloads in `{ data: ... }`. Controllers call `ctx.serialize(data)` (injected by `providers/api_provider.ts`).
- **i18n errors** — `tHttp(i18n, 'messageKey')` from `#services/http_i18n` translates `domain.http.<messageKey>`. Centralized keys in `#services/http_messages`.
- **Soft archive** — every user entity has `archived` (boolean) + `archivedAt` (DateTime|null). Controllers PATCH to archive, never DELETE.
- **Owner scoping** — all queries filter `where('user_id', auth.user!.id)`. Controllers use `auth.user!.id` directly.
- **Validation** — VineJS validators in `app/validators/`. Dates auto-transform to Luxon DateTime (`start/validator.ts`).
- **Domain enums** — shared constants in `#services/domain_enums`, consumed by validators.
- **Transfers** — business logic in `TransferService` (DB transaction, creates `transfer_out` + `transfer_in` linked transactions, updates account balances).
- **Settings locale** — on first auth request: detected from `Accept-Language`, persisted to `settings.locale`. Subsequent reads ignore `Accept-Language`.
- **hotHook** HMR boundaries: `./app/controllers/**/*.ts`, `./app/middleware/*.ts`.
- **Bootstrap 5** + dark theme (`data-bs-theme="dark"` in `inertia_layout.edge`). Pinia for state. vue-sonner for toasts. `@tuyau/core` typed client via `TuyauProvider`.

## Setup flow

```bash
cp .env.example .env          # generate APP_KEY via `node ace generate:key`
npm install
node ace migration:run
node ace db:seed              # creates seed user + settings + defaults
npm run dev
```

## Seeders

Sequential (run via `node ace db:seed`):

1. `0001_users_seeder.ts` — default user (`seed.user@fortuna.local`)
2. `0002_settings_seeder.ts` — backfills missing settings

Helper code lives in `database/support/` (excluded from seeder scan).

## Repo structure

- `app/controllers/` — 21 controllers, one per domain entity
- `app/models/` — 21 Lucid models
- `app/validators/` — 21 VineJS validators
- `app/services/` — domain logic, i18n helpers, money utils, transfer service
- `app/middleware/` — auth, guest, inertia, locale detection, silent auth
- `app/transformers/` — user_transformer
- `config/` — 14 config files
- `start/` — routes, kernel, env, validator (global VineJS date transform)
- `inertia/` — Vue pages, layouts, components, stores, client setup
- `database/migrations/` — 21 migration files
- `database/seeders/` — 2 seeders
- `resources/lang/{en-US,pt-BR}/` — ICU-format i18n dictionaries
- `providers/` — `api_provider.ts` (serializer injection)

## TODOs

### Hard-delete cleanup command

Criar um ace command (`node ace cleanup:archived`) que exclui permanentemente registros com `archived = true` e `archivedAt` com mais de **5 anos**.

**Checklist:**

- [ ] Criar `app/commands/cleanup_archived.ts` — comando ace que varre todas as entidades que possuem soft archive (`archived` + `archivedAt`)
- [ ] Respeitar ordem de exclusão por chaves estrangeiras (ex.: deletar transactions antes de accounts, etc.)
- [ ] Logar quantos registros foram excluídos por entidade
- [ ] Usar Luxon (`DateTime`) para comparar a data — `archivedAt < now().minus({ years: 5 })`
- [ ] Opcional: agendar execução periódica (ex.: 1x/dia via `cron` ou `node ace` num scheduler)
