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
