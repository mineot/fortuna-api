# Plano de Implementação — `@repo/database`

## 1. Objetivo do pacote

- Entregar a camada de infraestrutura de dados: client Kysely, migrations, seeds e repositórios.
- Manter regras de negócio pesadas fora do pacote `database` (devem permanecer no `domain`).
- Consumir os contratos centrais do `shared` em vez de redefinir modelos.

## 2. Estrutura de pastas (Fase 3)

- `packages/database/src/client/`
- `packages/database/src/schema/`
- `packages/database/src/migrations/`
- `packages/database/src/seeds/`
- `packages/database/src/repositories/`
- `packages/database/src/adapters/sqlite/`
- `packages/database/src/index.ts`

## 3. Contratos vindos do `shared`

- Reutilizar `Database` e interfaces `*Table` de `@repo/shared` (`contracts/finance.tables`).
- Reutilizar unions de domínio (`TransactionStatus`, `RecurrenceType`, etc.) de `@repo/shared/types`.
- Evitar duplicação de interfaces de tabela no pacote `database`.

## 4. Client Kysely

- Criar factory de conexão SQLite (`createDatabaseClient`).
- Expor `Kysely<Database>` tipado com base no `shared`.
- Configurar origem do SQLite via env (`DATABASE_URL`) com fallback local para desenvolvimento.

## 5. Migrations (ordem sugerida)

1. `users`, `user_settings`
2. `account_types`, `accounts`
3. `category_groups`, `categories`
4. `payees`
5. `transactions`, `transfers`, `recurring_transactions`
6. `credit_cards`, `credit_card_statements`, `credit_card_purchases`, `credit_card_installments`, `credit_card_statement_payments`

Cada migration deve incluir PKs, FKs, unique, check constraints e índices aderentes ao documento `.database`.

## 6. Constraints essenciais da V1

- `users.email` unique.
- `user_settings.user_id` unique.
- Checks de faixa: dias e mês fiscal, `closing_day`, `due_day`, `recurring_transactions.due_day`.
- Checks enum-like em colunas text (`type`, `status`, `frequency`, etc.).
- Checks monetários (`amount > 0`, `installment_count >= 1`, etc.).
- Regra de transferência: `source_account_id != destination_account_id`.

## 7. Índices

Implementar os índices recomendados na especificação `.database`, priorizando:

- colunas de filtro/listagem por `user_id`
- colunas de data (`date`, `purchase_date`, `due_date`, `competence_date`)
- colunas de status
- FKs de relacionamento
- `users.email`

## 8. Seeds

- Seed de `account_types` padrão:
  - Checking
  - Savings
  - Wallet
  - Investment
  - Other
- Seed de grupos/categorias padrão úteis para início de uso.
- Garantir idempotência dos seeds (ex.: `on conflict do nothing`, quando suportado).

## 9. Repositórios (primeira onda)

- CRUD base para: `users`, `accounts`, `categories`, `transactions`, `transfers`.
- Repositórios devem retornar tipos compartilhados (`@repo/shared`).
- Módulo de cartão:
  - compra em cartão cria registros em `credit_card_purchases`
  - gera parcelas em `credit_card_installments`
  - pagamento de fatura cria `credit_card_statement_payments` + transação real vinculada (`transaction_id`)

## 10. Queries de leitura críticas

- Cálculo de saldo atual de conta (sem persistir saldo final em coluna dedicada).
- Total da fatura por soma de parcelas vinculadas.
- Total pago da fatura e regra para transição de status para `paid`.

## 11. Superfície pública em `src/index.ts`

Exportar:

- client/factory Kysely
- runners de migration e seed
- repositórios
- tipos públicos necessários (com re-export do `shared` quando fizer sentido)

## 12. Validação e qualidade

- `pnpm --filter @repo/database typecheck`
- testes de integração com SQLite temporário cobrindo:
  - migration up/down
  - idempotência de seed
  - fluxo cartão: compra -> parcelas -> pagamento -> transação

## 13. Sequência de execução recomendada

1. Setup de dependências e configuração do pacote `database`.
2. Implementação do client Kysely + config SQLite.
3. Implementação das migrations core.
4. Inclusão de índices e constraints finais.
5. Implementação dos seeds.
6. Implementação dos repositórios base.
7. Implementação dos repositórios de cartão.
8. Testes de integração.
9. Finalização dos exports em `src/index.ts`.

## 14. Critérios de pronto (Definition of Done)

- Todas as tabelas V1 da especificação `.database` criadas por migration.
- Constraints e índices principais aplicados.
- Seeds iniciais executáveis e idempotentes.
- Repositórios base e fluxo de cartão operacionais.
- `@repo/database` tipado com contratos do `@repo/shared`.
- Typecheck e testes de integração do pacote passando.
