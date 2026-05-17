# @repo/domain

Domain layer for Project Fortuna.

Main responsibilities:
- centralize business rules and use cases
- expose domain ports (interfaces) for infrastructure adapters
- keep domain logic reusable across API/CLI/Web integrations
- enforce business invariants without HTTP or SQL concerns

This package must not depend on `@repo/api` or `@repo/database`.

## Architecture conventions

- Depends only on `@repo/shared`.
- Uses ports for external capabilities (repositories, token signing, hashing).
- Throws domain errors with stable `code/message`.
- Keeps orchestration details (HTTP status, request parsing) outside domain.

## Implemented modules

- `auth`
- `users`
- `account-types`
- `accounts`
- `user-settings`
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
pnpm --filter @repo/domain run build
pnpm --filter @repo/domain run typecheck
pnpm --filter @repo/domain run test
```

## Test coverage (current)

Unit tests currently cover critical domain use-case rules:
- auth login success path
- user email conflict detection
- transfer same-account rejection
- credit card installment sum mismatch validation
- statement payment invalid amount rejection
