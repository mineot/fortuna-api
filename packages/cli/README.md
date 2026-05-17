# @repo/cli

CLI operacional do Project Fortuna.

Modos suportados:
- `local`: executa direto no banco via `@repo/database`
- `remote`: executa via HTTP em `@repo/api`

## Pré-requisitos

- Dependências instaladas no monorepo (`pnpm install`)
- Build dos pacotes quando necessário (`pnpm build`)
- Para uso por binário: `pnpm --filter @repo/cli build`

Executar por Node:
- `node packages/cli/dist/main.js ...`

## Convenções Globais

Flags globais:
- `--mode local|remote` (default: `local`)
- `--output human|json` (default: `human`)

Envelope de saída:
- sucesso: `{ "ok": true, "data": ... }`
- erro: `{ "ok": false, "error": { "code", "message" } }`

Exit codes:
- `0` sucesso
- `2` erro de uso/validação (`UNKNOWN_COMMAND`, `COMMAND_NOT_IMPLEMENTED`, `VALIDATION_ERROR`)
- `3` erro de modo (`MODE_ERROR`)
- `4` autenticação necessária (`AUTH_REQUIRED`)
- `5` erro de API (`API_ERROR`)
- `1` erro interno (`INTERNAL_ERROR`)

## Variáveis de Ambiente

Variáveis comuns:
- `FORTUNA_ENV=DEV|PROD`
- `FORTUNA_API_BASE_URL` (ex: `http://localhost:3000`)
- `FORTUNA_CLI_MODE=local|remote`
- `FORTUNA_CLI_OUTPUT=human|json`
- `FORTUNA_CLI_USER_ID` (default user no modo local, fallback `1`)

Sessão remota:
- `FORTUNA_CLI_SESSION_FILE`
- padrão em `DEV`: `~/.fortuna/session.dev.json`
- padrão em `PROD`: `~/.fortuna/session.prod.json`

Banco local (via `@repo/database`):
- `FORTUNA_DB` (caminho SQLite)

## Catálogo de Comandos

### Auth (`remote`)
- `auth login --email <email> --password <password>`
- `auth refresh`
- `auth logout`
- `auth me`

### Accounts (`local`/`remote`)
- `accounts list [--page <n>] [--page-size <n>] [--account-type-id <id>] [--user-id <id>]`
- `accounts create --account-type-id <id> --name <name> --initial-balance <cents> [--notes <text>] [--user-id <id>]`

### Categories (`local`/`remote`)
- `categories list [--type income|expense] [--page <n>] [--page-size <n>] [--category-group-id <id>] [--user-id <id>]`
- `categories create --category-group-id <id> --name <name> --type income|expense [--user-id <id>]`

### Transactions (`local`/`remote`)
- `transactions list [--account-id <id>] [--category-id <id>] [--payee-id <id>] [--type income|expense] [--status pending|confirmed|cancelled] [--from <YYYY-MM-DD>] [--to <YYYY-MM-DD>] [--page <n>] [--page-size <n>] [--user-id <id>]`
- `transactions create --account-id <id> --category-id <id> --type income|expense --amount <cents> --date <YYYY-MM-DD> --description <text> --status pending|confirmed|cancelled [--payee-id <id>] [--notes <text>] [--user-id <id>]`

### Transfers (`local`/`remote`)
- `transfers list [--source-account-id <id>] [--destination-account-id <id>] [--status pending|confirmed|cancelled] [--from <YYYY-MM-DD>] [--to <YYYY-MM-DD>] [--page <n>] [--page-size <n>] [--user-id <id>]`
- `transfers create --source-account-id <id> --destination-account-id <id> --amount <cents> --date <YYYY-MM-DD> --status pending|confirmed|cancelled [--description <text>] [--user-id <id>]`

### Reports (`local`/`remote`)
- `reports summary [--from <YYYY-MM-DD>] [--to <YYYY-MM-DD>] [--user-id <id>]`
- `reports account-balances [--user-id <id>]`

### Credit Cards (`local`/`remote`)
- `credit-cards list [--page <n>] [--page-size <n>] [--user-id <id>]`
- `credit-cards purchase --credit-card-id <id> --category-id <id> --total-amount <cents> --installment-count <n> --purchase-date <YYYY-MM-DD> --description <text> [--payee-id <id>]`

### Statement Payments (`local`/`remote`)
- `statement-payments create --credit-card-statement-id <id> --account-id <id> --amount <cents> --date <YYYY-MM-DD> --category-id <id> [--description <text>] [--payee-id <id>] [--notes <text>] [--transaction-status pending|confirmed|cancelled] [--user-id <id>]`

## Exemplos

### 1) Login remoto
```bash
node packages/cli/dist/main.js --mode remote --output json auth login \
  --email remote.integration@fortuna.local \
  --password remote-password
```

### 2) Criar conta no modo local
```bash
node packages/cli/dist/main.js --mode local --output json accounts create \
  --user-id 1 \
  --account-type-id 1 \
  --name "Checking" \
  --initial-balance 100000
```

### 3) Criar transação no modo remoto
```bash
node packages/cli/dist/main.js --mode remote --output json transactions create \
  --account-id 1 \
  --category-id 1 \
  --type expense \
  --amount 2500 \
  --date 2026-05-16 \
  --description "Lunch" \
  --status confirmed
```

### 4) Relatório de resumo
```bash
node packages/cli/dist/main.js --mode local --output json reports summary \
  --user-id 1 \
  --from 2026-05-01 \
  --to 2026-05-31
```

## Testes

Unitários + integração local + integração remota:
```bash
pnpm --filter @repo/cli test
```

## Observações Operacionais

- No modo `remote`, rode a API antes de executar comandos.
- `credit-cards purchase` usa o endpoint de compras de cartão (`/credit-cards/:id/purchases`).
- `statement-payments create` usa o fluxo de negócio de pagamento de fatura (`register-payment`), que gera transação vinculada.
