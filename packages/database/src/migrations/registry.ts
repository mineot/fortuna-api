import {
  CREDIT_CARD_STATEMENT_STATUSES,
  RECURRENCE_FREQUENCIES,
  RECURRENCE_TYPES,
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
} from '@repo/shared';
import { expressionBuilder, sql } from 'kysely';

import type { MigrationDatabase, VersionedMigration } from './types';

const BOOLEAN_INT_VALUES = [0, 1] as const;

const initialSchemaV010: VersionedMigration = {
  id: '001_users_user_settings',
  version: '0.1.0',
  up: async (db): Promise<void> => {
    const userSettingsEb = expressionBuilder<MigrationDatabase, 'user_settings'>();
    const categoriesEb = expressionBuilder<MigrationDatabase, 'categories'>();
    const transactionsEb = expressionBuilder<MigrationDatabase, 'transactions'>();
    const transfersEb = expressionBuilder<MigrationDatabase, 'transfers'>();
    const recurringEb = expressionBuilder<MigrationDatabase, 'recurring_transactions'>();
    const creditCardsEb = expressionBuilder<MigrationDatabase, 'credit_cards'>();
    const creditCardStatementsEb = expressionBuilder<MigrationDatabase, 'credit_card_statements'>();
    const creditCardPurchasesEb = expressionBuilder<MigrationDatabase, 'credit_card_purchases'>();
    const creditCardInstallmentsEb = expressionBuilder<
      MigrationDatabase,
      'credit_card_installments'
    >();
    const creditCardStatementPaymentsEb = expressionBuilder<
      MigrationDatabase,
      'credit_card_statement_payments'
    >();

    await db.schema
      .createTable('users')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('name', 'text', (column) => column.notNull())
      .addColumn('email', 'text', (column) => column.notNull().unique())
      .addColumn('password', 'text', (column) => column.notNull())
      .execute();

    await db.schema
      .createTable('user_settings')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('user_id', 'integer', (column) =>
        column.notNull().references('users.id').onDelete('cascade').unique(),
      )
      .addColumn('locale', 'text', (column) => column.notNull())
      .addColumn('currency', 'text', (column) => column.notNull())
      .addColumn('fiscal_year_cutoff_day', 'integer', (column) =>
        column
          .notNull()
          .check(
            userSettingsEb('fiscal_year_cutoff_day', '>=', sql.lit(1)).and(
              'fiscal_year_cutoff_day',
              '<=',
              sql.lit(31),
            ),
          ),
      )
      .addColumn('fiscal_year_cutoff_month', 'integer', (column) =>
        column
          .notNull()
          .check(
            userSettingsEb('fiscal_year_cutoff_month', '>=', sql.lit(1)).and(
              'fiscal_year_cutoff_month',
              '<=',
              sql.lit(12),
            ),
          ),
      )
      .execute();

    await db.schema
      .createTable('account_types')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('name', 'text', (column) => column.notNull().unique())
      .execute();

    await db.schema
      .createTable('accounts')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('user_id', 'integer', (column) =>
        column.notNull().references('users.id').onDelete('cascade'),
      )
      .addColumn('account_type_id', 'integer', (column) =>
        column.notNull().references('account_types.id').onDelete('restrict'),
      )
      .addColumn('name', 'text', (column) => column.notNull())
      .addColumn('initial_balance', 'integer', (column) => column.notNull())
      .addColumn('notes', 'text')
      .execute();

    await db.schema
      .createTable('category_groups')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('user_id', 'integer', (column) =>
        column.notNull().references('users.id').onDelete('cascade'),
      )
      .addColumn('name', 'text', (column) => column.notNull())
      .execute();

    await db.schema
      .createTable('categories')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('user_id', 'integer', (column) =>
        column.notNull().references('users.id').onDelete('cascade'),
      )
      .addColumn('category_group_id', 'integer', (column) =>
        column.notNull().references('category_groups.id').onDelete('cascade'),
      )
      .addColumn('name', 'text', (column) => column.notNull())
      .addColumn('type', 'text', (column) =>
        column.notNull().check(
          categoriesEb(
            'type',
            'in',
            TRANSACTION_TYPES.map((value) => sql.lit(value)),
          ),
        ),
      )
      .execute();

    await db.schema
      .createTable('payees')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('user_id', 'integer', (column) =>
        column.notNull().references('users.id').onDelete('cascade'),
      )
      .addColumn('name', 'text', (column) => column.notNull())
      .execute();

    await db.schema
      .createTable('transactions')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('user_id', 'integer', (column) =>
        column.notNull().references('users.id').onDelete('cascade'),
      )
      .addColumn('account_id', 'integer', (column) =>
        column.notNull().references('accounts.id').onDelete('cascade'),
      )
      .addColumn('category_id', 'integer', (column) =>
        column.notNull().references('categories.id').onDelete('restrict'),
      )
      .addColumn('payee_id', 'integer', (column) =>
        column.references('payees.id').onDelete('set null'),
      )
      .addColumn('type', 'text', (column) =>
        column.notNull().check(
          transactionsEb(
            'type',
            'in',
            TRANSACTION_TYPES.map((value) => sql.lit(value)),
          ),
        ),
      )
      .addColumn('description', 'text', (column) => column.notNull())
      .addColumn('amount', 'integer', (column) =>
        column.notNull().check(transactionsEb('amount', '>', sql.lit(0))),
      )
      .addColumn('date', 'text', (column) => column.notNull())
      .addColumn('status', 'text', (column) =>
        column.notNull().check(
          transactionsEb(
            'status',
            'in',
            TRANSACTION_STATUSES.map((value) => sql.lit(value)),
          ),
        ),
      )
      .addColumn('notes', 'text')
      .execute();

    await db.schema
      .createTable('transfers')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('user_id', 'integer', (column) =>
        column.notNull().references('users.id').onDelete('cascade'),
      )
      .addColumn('source_account_id', 'integer', (column) =>
        column.notNull().references('accounts.id').onDelete('cascade'),
      )
      .addColumn('destination_account_id', 'integer', (column) =>
        column.notNull().references('accounts.id').onDelete('cascade'),
      )
      .addColumn('amount', 'integer', (column) =>
        column.notNull().check(transfersEb('amount', '>', sql.lit(0))),
      )
      .addColumn('date', 'text', (column) => column.notNull())
      .addColumn('description', 'text')
      .addColumn('status', 'text', (column) =>
        column.notNull().check(
          transfersEb(
            'status',
            'in',
            TRANSACTION_STATUSES.map((value) => sql.lit(value)),
          ),
        ),
      )
      .addCheckConstraint(
        'chk_transfers_source_destination_different',
        transfersEb('source_account_id', '!=', transfersEb.ref('destination_account_id')),
      )
      .execute();

    await db.schema
      .createTable('recurring_transactions')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('user_id', 'integer', (column) =>
        column.notNull().references('users.id').onDelete('cascade'),
      )
      .addColumn('account_id', 'integer', (column) =>
        column.notNull().references('accounts.id').onDelete('cascade'),
      )
      .addColumn('category_id', 'integer', (column) =>
        column.notNull().references('categories.id').onDelete('restrict'),
      )
      .addColumn('payee_id', 'integer', (column) =>
        column.references('payees.id').onDelete('set null'),
      )
      .addColumn('name', 'text', (column) => column.notNull())
      .addColumn('description', 'text')
      .addColumn('type', 'text', (column) =>
        column.notNull().check(
          recurringEb(
            'type',
            'in',
            TRANSACTION_TYPES.map((value) => sql.lit(value)),
          ),
        ),
      )
      .addColumn('recurrence_type', 'text', (column) =>
        column.notNull().check(
          recurringEb(
            'recurrence_type',
            'in',
            RECURRENCE_TYPES.map((value) => sql.lit(value)),
          ),
        ),
      )
      .addColumn('amount', 'integer', (column) =>
        column.notNull().check(recurringEb('amount', '>', sql.lit(0))),
      )
      .addColumn('frequency', 'text', (column) =>
        column.notNull().check(
          recurringEb(
            'frequency',
            'in',
            RECURRENCE_FREQUENCIES.map((value) => sql.lit(value)),
          ),
        ),
      )
      .addColumn('due_day', 'integer', (column) =>
        column
          .notNull()
          .check(recurringEb('due_day', '>=', sql.lit(1)).and('due_day', '<=', sql.lit(31))),
      )
      .addColumn('start_date', 'text', (column) => column.notNull())
      .addColumn('end_date', 'text')
      .addColumn('active', 'integer', (column) =>
        column.notNull().check(
          recurringEb(
            'active',
            'in',
            BOOLEAN_INT_VALUES.map((value) => sql.lit(value)),
          ),
        ),
      )
      .execute();

    await db.schema
      .createTable('credit_cards')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('user_id', 'integer', (column) =>
        column.notNull().references('users.id').onDelete('cascade'),
      )
      .addColumn('name', 'text', (column) => column.notNull())
      .addColumn('credit_limit', 'integer', (column) =>
        column.notNull().check(creditCardsEb('credit_limit', '>=', sql.lit(0))),
      )
      .addColumn('closing_day', 'integer', (column) =>
        column
          .notNull()
          .check(
            creditCardsEb('closing_day', '>=', sql.lit(1)).and('closing_day', '<=', sql.lit(31)),
          ),
      )
      .addColumn('due_day', 'integer', (column) =>
        column
          .notNull()
          .check(creditCardsEb('due_day', '>=', sql.lit(1)).and('due_day', '<=', sql.lit(31))),
      )
      .addColumn('notes', 'text')
      .execute();

    await db.schema
      .createTable('credit_card_statements')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('credit_card_id', 'integer', (column) =>
        column.notNull().references('credit_cards.id').onDelete('cascade'),
      )
      .addColumn('start_date', 'text', (column) => column.notNull())
      .addColumn('end_date', 'text', (column) => column.notNull())
      .addColumn('due_date', 'text', (column) => column.notNull())
      .addColumn('status', 'text', (column) =>
        column.notNull().check(
          creditCardStatementsEb(
            'status',
            'in',
            CREDIT_CARD_STATEMENT_STATUSES.map((value) => sql.lit(value)),
          ),
        ),
      )
      .execute();

    await db.schema
      .createTable('credit_card_purchases')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('credit_card_id', 'integer', (column) =>
        column.notNull().references('credit_cards.id').onDelete('cascade'),
      )
      .addColumn('category_id', 'integer', (column) =>
        column.notNull().references('categories.id').onDelete('restrict'),
      )
      .addColumn('payee_id', 'integer', (column) =>
        column.references('payees.id').onDelete('set null'),
      )
      .addColumn('description', 'text', (column) => column.notNull())
      .addColumn('total_amount', 'integer', (column) =>
        column.notNull().check(creditCardPurchasesEb('total_amount', '>', sql.lit(0))),
      )
      .addColumn('installment_count', 'integer', (column) =>
        column.notNull().check(creditCardPurchasesEb('installment_count', '>=', sql.lit(1))),
      )
      .addColumn('purchase_date', 'text', (column) => column.notNull())
      .execute();

    await db.schema
      .createTable('credit_card_installments')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('credit_card_purchase_id', 'integer', (column) =>
        column.notNull().references('credit_card_purchases.id').onDelete('cascade'),
      )
      .addColumn('credit_card_statement_id', 'integer', (column) =>
        column.notNull().references('credit_card_statements.id').onDelete('cascade'),
      )
      .addColumn('installment_number', 'integer', (column) =>
        column.notNull().check(creditCardInstallmentsEb('installment_number', '>=', sql.lit(1))),
      )
      .addColumn('amount', 'integer', (column) =>
        column.notNull().check(creditCardInstallmentsEb('amount', '>', sql.lit(0))),
      )
      .addColumn('competence_date', 'text', (column) => column.notNull())
      .execute();

    await db.schema
      .createTable('credit_card_statement_payments')
      .ifNotExists()
      .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement().notNull())
      .addColumn('credit_card_statement_id', 'integer', (column) =>
        column.notNull().references('credit_card_statements.id').onDelete('cascade'),
      )
      .addColumn('account_id', 'integer', (column) =>
        column.notNull().references('accounts.id').onDelete('cascade'),
      )
      .addColumn('amount', 'integer', (column) =>
        column.notNull().check(creditCardStatementPaymentsEb('amount', '>', sql.lit(0))),
      )
      .addColumn('date', 'text', (column) => column.notNull())
      .addColumn('transaction_id', 'integer', (column) =>
        column.notNull().references('transactions.id').onDelete('cascade'),
      )
      .execute();

    await db.schema
      .createIndex('idx_user_settings_user_id')
      .ifNotExists()
      .on('user_settings')
      .column('user_id')
      .execute();
    await db.schema
      .createIndex('idx_accounts_user_id')
      .ifNotExists()
      .on('accounts')
      .column('user_id')
      .execute();
    await db.schema
      .createIndex('idx_accounts_account_type_id')
      .ifNotExists()
      .on('accounts')
      .column('account_type_id')
      .execute();

    await db.schema
      .createIndex('idx_category_groups_user_id')
      .ifNotExists()
      .on('category_groups')
      .column('user_id')
      .execute();

    await db.schema
      .createIndex('idx_categories_user_id')
      .ifNotExists()
      .on('categories')
      .column('user_id')
      .execute();
    await db.schema
      .createIndex('idx_categories_category_group_id')
      .ifNotExists()
      .on('categories')
      .column('category_group_id')
      .execute();
    await db.schema
      .createIndex('idx_categories_type')
      .ifNotExists()
      .on('categories')
      .column('type')
      .execute();

    await db.schema
      .createIndex('idx_payees_user_id')
      .ifNotExists()
      .on('payees')
      .column('user_id')
      .execute();

    await db.schema
      .createIndex('idx_transactions_user_id')
      .ifNotExists()
      .on('transactions')
      .column('user_id')
      .execute();
    await db.schema
      .createIndex('idx_transactions_account_id')
      .ifNotExists()
      .on('transactions')
      .column('account_id')
      .execute();
    await db.schema
      .createIndex('idx_transactions_category_id')
      .ifNotExists()
      .on('transactions')
      .column('category_id')
      .execute();
    await db.schema
      .createIndex('idx_transactions_payee_id')
      .ifNotExists()
      .on('transactions')
      .column('payee_id')
      .execute();
    await db.schema
      .createIndex('idx_transactions_date')
      .ifNotExists()
      .on('transactions')
      .column('date')
      .execute();
    await db.schema
      .createIndex('idx_transactions_status')
      .ifNotExists()
      .on('transactions')
      .column('status')
      .execute();
    await db.schema
      .createIndex('idx_transactions_type')
      .ifNotExists()
      .on('transactions')
      .column('type')
      .execute();

    await db.schema
      .createIndex('idx_transfers_user_id')
      .ifNotExists()
      .on('transfers')
      .column('user_id')
      .execute();
    await db.schema
      .createIndex('idx_transfers_source_account_id')
      .ifNotExists()
      .on('transfers')
      .column('source_account_id')
      .execute();
    await db.schema
      .createIndex('idx_transfers_destination_account_id')
      .ifNotExists()
      .on('transfers')
      .column('destination_account_id')
      .execute();
    await db.schema
      .createIndex('idx_transfers_date')
      .ifNotExists()
      .on('transfers')
      .column('date')
      .execute();
    await db.schema
      .createIndex('idx_transfers_status')
      .ifNotExists()
      .on('transfers')
      .column('status')
      .execute();

    await db.schema
      .createIndex('idx_recurring_transactions_user_id')
      .ifNotExists()
      .on('recurring_transactions')
      .column('user_id')
      .execute();
    await db.schema
      .createIndex('idx_recurring_transactions_active')
      .ifNotExists()
      .on('recurring_transactions')
      .column('active')
      .execute();
    await db.schema
      .createIndex('idx_recurring_transactions_due_day')
      .ifNotExists()
      .on('recurring_transactions')
      .column('due_day')
      .execute();

    await db.schema
      .createIndex('idx_credit_cards_user_id')
      .ifNotExists()
      .on('credit_cards')
      .column('user_id')
      .execute();

    await db.schema
      .createIndex('idx_credit_card_statements_credit_card_id')
      .ifNotExists()
      .on('credit_card_statements')
      .column('credit_card_id')
      .execute();
    await db.schema
      .createIndex('idx_credit_card_statements_status')
      .ifNotExists()
      .on('credit_card_statements')
      .column('status')
      .execute();
    await db.schema
      .createIndex('idx_credit_card_statements_due_date')
      .ifNotExists()
      .on('credit_card_statements')
      .column('due_date')
      .execute();

    await db.schema
      .createIndex('idx_credit_card_purchases_credit_card_id')
      .ifNotExists()
      .on('credit_card_purchases')
      .column('credit_card_id')
      .execute();
    await db.schema
      .createIndex('idx_credit_card_purchases_category_id')
      .ifNotExists()
      .on('credit_card_purchases')
      .column('category_id')
      .execute();
    await db.schema
      .createIndex('idx_credit_card_purchases_payee_id')
      .ifNotExists()
      .on('credit_card_purchases')
      .column('payee_id')
      .execute();
    await db.schema
      .createIndex('idx_credit_card_purchases_purchase_date')
      .ifNotExists()
      .on('credit_card_purchases')
      .column('purchase_date')
      .execute();

    await db.schema
      .createIndex('idx_credit_card_installments_credit_card_purchase_id')
      .ifNotExists()
      .on('credit_card_installments')
      .column('credit_card_purchase_id')
      .execute();
    await db.schema
      .createIndex('idx_credit_card_installments_credit_card_statement_id')
      .ifNotExists()
      .on('credit_card_installments')
      .column('credit_card_statement_id')
      .execute();
    await db.schema
      .createIndex('idx_credit_card_installments_competence_date')
      .ifNotExists()
      .on('credit_card_installments')
      .column('competence_date')
      .execute();

    await db.schema
      .createIndex('idx_credit_card_statement_payments_credit_card_statement_id')
      .ifNotExists()
      .on('credit_card_statement_payments')
      .column('credit_card_statement_id')
      .execute();
    await db.schema
      .createIndex('idx_credit_card_statement_payments_account_id')
      .ifNotExists()
      .on('credit_card_statement_payments')
      .column('account_id')
      .execute();
    await db.schema
      .createIndex('idx_credit_card_statement_payments_transaction_id')
      .ifNotExists()
      .on('credit_card_statement_payments')
      .column('transaction_id')
      .execute();
    await db.schema
      .createIndex('idx_credit_card_statement_payments_date')
      .ifNotExists()
      .on('credit_card_statement_payments')
      .column('date')
      .execute();
  },
  down: async (db): Promise<void> => {
    await db.schema.dropTable('credit_card_statement_payments').ifExists().execute();
    await db.schema.dropTable('credit_card_installments').ifExists().execute();
    await db.schema.dropTable('credit_card_purchases').ifExists().execute();
    await db.schema.dropTable('credit_card_statements').ifExists().execute();
    await db.schema.dropTable('credit_cards').ifExists().execute();
    await db.schema.dropTable('recurring_transactions').ifExists().execute();
    await db.schema.dropTable('transfers').ifExists().execute();
    await db.schema.dropTable('transactions').ifExists().execute();
    await db.schema.dropTable('payees').ifExists().execute();
    await db.schema.dropTable('categories').ifExists().execute();
    await db.schema.dropTable('category_groups').ifExists().execute();
    await db.schema.dropTable('accounts').ifExists().execute();
    await db.schema.dropTable('account_types').ifExists().execute();
    await db.schema.dropTable('user_settings').ifExists().execute();
    await db.schema.dropTable('users').ifExists().execute();
  },
};

export const versionedMigrations: readonly VersionedMigration[] = [initialSchemaV010];
