# @repo/shared

Shared contracts package for Project Fortuna.

Main responsibilities:
- shared TypeScript types
- Zod schemas and validations
- DTO definitions
- cross-package contracts
- table interfaces used by data/persistence layers

This package must stay framework-agnostic and infrastructure-agnostic.

## Public modules

`@repo/shared` exports:
- `types/finance.types`
- `constants/finance.constants`
- `schemas/common.schemas`
- `schemas/finance.schemas`
- `dto/finance.dto`
- `contracts/finance.contracts`
- `contracts/finance.tables`
- `enums/finance.enums`

## Usage examples

```ts
import { transactionSchema, TRANSACTION_TYPES, type TransactionType } from '@repo/shared';

const parsed = transactionSchema.parse(input);
const type: TransactionType = TRANSACTION_TYPES[0];
```

```ts
import type { Database } from '@repo/shared';
import { Kysely } from 'kysely';

const db: Kysely<Database> = createDbClient();
```

## Rules

- Do not add runtime dependencies on database, API, Angular, filesystem, or env access.
- Keep this package focused on contracts and shared validation.
- Business rules belong to `@repo/domain`, not here.

## Scripts

```bash
pnpm --filter @repo/shared run build
pnpm --filter @repo/shared run typecheck
pnpm --filter @repo/shared run test
```
