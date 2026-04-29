import { type Kysely, sql } from 'kysely';

import type { Database } from '../schema';
import type { Migration } from './types';

async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable('users')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('name', 'text', (column) => column.notNull())
    .addColumn('email', 'text', (column) => column.notNull().unique())
    .addColumn('password', 'text', (column) => column.notNull())
    .execute();

  await db.schema
    .createTable('user_settings')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', (column) => column.notNull().references('users.id').unique())
    .addColumn('locale', 'text', (column) => column.notNull())
    .addColumn('currency', 'text', (column) => column.notNull())
    .addColumn('fiscal_year_cutoff_day', 'integer', (column) =>
      column.notNull().check(sql`fiscal_year_cutoff_day between 1 and 31`),
    )
    .addColumn('fiscal_year_cutoff_month', 'integer', (column) =>
      column.notNull().check(sql`fiscal_year_cutoff_month between 1 and 12`),
    )
    .execute();

  await db.schema
    .createTable('account_types')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('name', 'text', (column) => column.notNull().unique())
    .execute();

  await db.schema
    .createTable('accounts')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', (column) => column.notNull().references('users.id'))
    .addColumn('account_type_id', 'integer', (column) => column.notNull().references('account_types.id'))
    .addColumn('name', 'text', (column) => column.notNull())
    .addColumn('initial_balance', 'integer', (column) => column.notNull())
    .addColumn('notes', 'text')
    .execute();

  await db.schema
    .createTable('category_groups')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', (column) => column.notNull().references('users.id'))
    .addColumn('name', 'text', (column) => column.notNull())
    .execute();

  await db.schema
    .createTable('categories')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', (column) => column.notNull().references('users.id'))
    .addColumn('category_group_id', 'integer', (column) => column.notNull().references('category_groups.id'))
    .addColumn('name', 'text', (column) => column.notNull())
    .addColumn('type', 'text', (column) => column.notNull().check(sql`type in ('income', 'expense')`))
    .execute();

  await db.schema
    .createTable('payees')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', (column) => column.notNull().references('users.id'))
    .addColumn('name', 'text', (column) => column.notNull())
    .execute();

  await db.schema
    .createTable('transactions')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', (column) => column.notNull().references('users.id'))
    .addColumn('account_id', 'integer', (column) => column.notNull().references('accounts.id'))
    .addColumn('category_id', 'integer', (column) => column.notNull().references('categories.id'))
    .addColumn('payee_id', 'integer', (column) => column.references('payees.id'))
    .addColumn('type', 'text', (column) => column.notNull().check(sql`type in ('income', 'expense')`))
    .addColumn('description', 'text', (column) => column.notNull())
    .addColumn('amount', 'integer', (column) => column.notNull().check(sql`amount > 0`))
    .addColumn('date', 'text', (column) => column.notNull())
    .addColumn('status', 'text', (column) =>
      column.notNull().check(sql`status in ('pending', 'confirmed', 'cancelled')`),
    )
    .addColumn('notes', 'text')
    .execute();

  await db.schema
    .createTable('transfers')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', (column) => column.notNull().references('users.id'))
    .addColumn('source_account_id', 'integer', (column) => column.notNull().references('accounts.id'))
    .addColumn('destination_account_id', 'integer', (column) => column.notNull().references('accounts.id'))
    .addColumn('amount', 'integer', (column) => column.notNull().check(sql`amount > 0`))
    .addColumn('date', 'text', (column) => column.notNull())
    .addColumn('description', 'text')
    .addColumn('status', 'text', (column) =>
      column.notNull().check(sql`status in ('pending', 'confirmed', 'cancelled')`),
    )
    .addCheckConstraint('transfers_source_destination_diff', sql`source_account_id != destination_account_id`)
    .execute();

  await db.schema
    .createTable('recurring_transactions')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', (column) => column.notNull().references('users.id'))
    .addColumn('account_id', 'integer', (column) => column.notNull().references('accounts.id'))
    .addColumn('category_id', 'integer', (column) => column.notNull().references('categories.id'))
    .addColumn('payee_id', 'integer', (column) => column.references('payees.id'))
    .addColumn('name', 'text', (column) => column.notNull())
    .addColumn('description', 'text')
    .addColumn('type', 'text', (column) => column.notNull().check(sql`type in ('income', 'expense')`))
    .addColumn('recurrence_type', 'text', (column) =>
      column
        .notNull()
        .check(sql`recurrence_type in ('subscription', 'fixed_bill', 'fixed_income', 'monthly_fee', 'other')`),
    )
    .addColumn('amount', 'integer', (column) => column.notNull().check(sql`amount > 0`))
    .addColumn('frequency', 'text', (column) =>
      column.notNull().check(sql`frequency in ('monthly', 'yearly', 'weekly', 'biweekly', 'custom')`),
    )
    .addColumn('due_day', 'integer', (column) => column.notNull().check(sql`due_day between 1 and 31`))
    .addColumn('start_date', 'text', (column) => column.notNull())
    .addColumn('end_date', 'text')
    .addColumn('active', 'integer', (column) => column.notNull().check(sql`active in (0, 1)`))
    .execute();

  await db.schema
    .createTable('credit_cards')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('user_id', 'integer', (column) => column.notNull().references('users.id'))
    .addColumn('name', 'text', (column) => column.notNull())
    .addColumn('credit_limit', 'integer', (column) => column.notNull().check(sql`credit_limit >= 0`))
    .addColumn('closing_day', 'integer', (column) => column.notNull().check(sql`closing_day between 1 and 31`))
    .addColumn('due_day', 'integer', (column) => column.notNull().check(sql`due_day between 1 and 31`))
    .addColumn('notes', 'text')
    .execute();

  await db.schema
    .createTable('credit_card_statements')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('credit_card_id', 'integer', (column) => column.notNull().references('credit_cards.id'))
    .addColumn('start_date', 'text', (column) => column.notNull())
    .addColumn('end_date', 'text', (column) => column.notNull())
    .addColumn('due_date', 'text', (column) => column.notNull())
    .addColumn('status', 'text', (column) =>
      column.notNull().check(sql`status in ('open', 'closed', 'paid', 'cancelled')`),
    )
    .execute();

  await db.schema
    .createTable('credit_card_purchases')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('credit_card_id', 'integer', (column) => column.notNull().references('credit_cards.id'))
    .addColumn('category_id', 'integer', (column) => column.notNull().references('categories.id'))
    .addColumn('payee_id', 'integer', (column) => column.references('payees.id'))
    .addColumn('description', 'text', (column) => column.notNull())
    .addColumn('total_amount', 'integer', (column) => column.notNull().check(sql`total_amount > 0`))
    .addColumn('installment_count', 'integer', (column) => column.notNull().check(sql`installment_count >= 1`))
    .addColumn('purchase_date', 'text', (column) => column.notNull())
    .execute();

  await db.schema
    .createTable('credit_card_installments')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('credit_card_purchase_id', 'integer', (column) =>
      column.notNull().references('credit_card_purchases.id'),
    )
    .addColumn('credit_card_statement_id', 'integer', (column) =>
      column.notNull().references('credit_card_statements.id'),
    )
    .addColumn('installment_number', 'integer', (column) => column.notNull().check(sql`installment_number >= 1`))
    .addColumn('amount', 'integer', (column) => column.notNull().check(sql`amount > 0`))
    .addColumn('competence_date', 'text', (column) => column.notNull())
    .execute();

  await db.schema
    .createTable('credit_card_statement_payments')
    .ifNotExists()
    .addColumn('id', 'integer', (column) => column.primaryKey().autoIncrement())
    .addColumn('credit_card_statement_id', 'integer', (column) =>
      column.notNull().references('credit_card_statements.id'),
    )
    .addColumn('account_id', 'integer', (column) => column.notNull().references('accounts.id'))
    .addColumn('amount', 'integer', (column) => column.notNull().check(sql`amount > 0`))
    .addColumn('date', 'text', (column) => column.notNull())
    .addColumn('transaction_id', 'integer', (column) => column.notNull().references('transactions.id'))
    .execute();

  await db.schema
    .createIndex('idx_user_settings_user_id')
    .ifNotExists()
    .on('user_settings')
    .column('user_id')
    .execute();

  await db.schema.createIndex('idx_accounts_user_id').ifNotExists().on('accounts').column('user_id').execute();

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

  await db.schema.createIndex('idx_categories_user_id').ifNotExists().on('categories').column('user_id').execute();

  await db.schema
    .createIndex('idx_categories_category_group_id')
    .ifNotExists()
    .on('categories')
    .column('category_group_id')
    .execute();

  await db.schema.createIndex('idx_categories_type').ifNotExists().on('categories').column('type').execute();

  await db.schema.createIndex('idx_payees_user_id').ifNotExists().on('payees').column('user_id').execute();

  await db.schema.createIndex('idx_transactions_user_id').ifNotExists().on('transactions').column('user_id').execute();

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

  await db.schema.createIndex('idx_transactions_date').ifNotExists().on('transactions').column('date').execute();

  await db.schema.createIndex('idx_transactions_status').ifNotExists().on('transactions').column('status').execute();

  await db.schema.createIndex('idx_transactions_type').ifNotExists().on('transactions').column('type').execute();

  await db.schema.createIndex('idx_transfers_user_id').ifNotExists().on('transfers').column('user_id').execute();

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

  await db.schema.createIndex('idx_transfers_date').ifNotExists().on('transfers').column('date').execute();

  await db.schema.createIndex('idx_transfers_status').ifNotExists().on('transfers').column('status').execute();

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

  await db.schema.createIndex('idx_credit_cards_user_id').ifNotExists().on('credit_cards').column('user_id').execute();

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
}

async function down(db: Kysely<Database>): Promise<void> {
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
}

export const createTypesTableMigration: Migration = {
  version: 1,
  name: 'init_app',
  up,
  down,
};
