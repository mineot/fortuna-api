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
