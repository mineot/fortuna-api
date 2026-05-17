# @repo/cli

CLI package for Project Fortuna operations, with two execution modes:

- `local`: direct operation against local persistence layer.
- `remote`: operation through `@repo/api` HTTP endpoints.

## Phase 6 - Part 1 (Implemented)

Part 1 defines command scope and command matrix only. It does not implement command execution yet.

Implemented artifacts:

- typed command matrix: `src/plan/command-matrix.ts`
- package export for planning metadata: `src/index.ts`

Primary modules in scope:

- `auth`
- `accounts`
- `categories`
- `transactions`
- `transfers`
- `reports`
- `credit-cards`
- `statement-payments`

Milestone mapping:

- `M1`: auth + first vertical slice (`transactions create/list`)
- `M2`: core finance commands (`accounts`, `categories`, `transfers`)
- `M3`: credit-card flows, statement payments, reports
- `M4`: hardening and delivery quality

## Next Step

Part 2 should implement architecture baseline folders and foundational abstractions for mode-resolved command execution.

## Phase 6 - Part 2 (Implemented)

Part 2 establishes the architecture baseline and composition root, still without domain command execution.

Implemented artifacts:

- `src/config/cli-config.ts`: runtime mode and output resolution
- `src/services/types.ts`: core context contracts
- `src/services/defaults.ts`: default logger/clock/session store
- `src/services/container.ts`: composition root (`createCliContext`)
- `src/adapters/local/local-adapter.ts`: local adapter baseline
- `src/adapters/remote/remote-adapter.ts`: remote adapter baseline
- `src/commands/registry.ts`: command registry bound to command matrix
- `src/formatters/output.ts`: output formatting (`human`/`json`)

## Phase 6 - Part 3 (Implemented)

Part 3 adds the CLI runtime entrypoint and command dispatch flow.

Implemented artifacts:

- `src/runtime/argv.ts`: argument parsing and command extraction
- `src/runtime/run-cli.ts`: runtime dispatcher and exit code contract
- `src/main.ts`: executable entrypoint
- `package.json` `bin` mapping: `fortuna -> dist/main.js`

## Phase 6 - Part 4 (Implemented)

Part 4 consolidates composition root and execution context wiring.

Implemented artifacts:

- execution metadata in context: `requestId`, `startedAt`
- env-aware config: `environment` (`DEV`/`PROD`)
- mode-specific adapters now receive environment metadata
- `SessionProvider` abstraction layered on top of `SessionStore`
- centralized context bootstrap in `createCliContext` with:
  - logger
  - clock
  - session store/provider
  - mode-resolved adapter

## Phase 6 - Part 5 (Implemented)

Part 5 implements remote auth commands and persistent session storage.

Implemented artifacts:

- file-based session store:
  - `src/services/session/file-session-store.ts`
  - default paths by environment:
    - `DEV`: `~/.fortuna/session.dev.json`
    - `PROD`: `~/.fortuna/session.prod.json`
- remote auth HTTP client:
  - `src/adapters/remote/auth-client.ts`
- auth handlers:
  - `auth login`
  - `auth refresh`
  - `auth logout`
  - `auth me`
  - implemented in `src/commands/auth.ts`
- command registry wiring for auth handlers:
  - `src/commands/registry.ts`

## Phase 6 - Part 6 (Implemented)

Part 6 delivers the first end-to-end vertical slice with transactions in both modes.

Implemented artifacts:

- transaction command handlers:
  - `transactions create`
  - `transactions list`
  - file: `src/commands/transactions.ts`
- local transactions client (database direct):
  - `src/adapters/local/transactions-client.ts`
- remote transactions client (API + bearer token):
  - `src/adapters/remote/transactions-client.ts`
- registry wiring for transaction handlers:
  - `src/commands/registry.ts`

## M2 Progress (Implemented)

Added first core-finance commands after the initial vertical slice:

- `accounts list`
- `accounts create`
- `categories list`
- `categories create`

Implemented for both modes:

- local (`database` direct adapters)
- remote (`api` adapters with bearer token)
