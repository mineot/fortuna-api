import { sql, type Kysely } from 'kysely';

import type { DatabaseSchema } from '../../client';

const CREATE_TABLE_STATEMENTS = [
  `
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
  `,
  `
  CREATE TABLE user_settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL UNIQUE,
    locale TEXT NOT NULL,
    currency TEXT NOT NULL,
    fiscal_year_cutoff_day INTEGER NOT NULL CHECK (fiscal_year_cutoff_day BETWEEN 1 AND 31),
    fiscal_year_cutoff_month INTEGER NOT NULL CHECK (fiscal_year_cutoff_month BETWEEN 1 AND 12),
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
  `,
  `
  CREATE TABLE account_types (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )
  `,
  `
  CREATE TABLE accounts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_type_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    initial_balance INTEGER NOT NULL,
    notes TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (account_type_id) REFERENCES account_types(id)
  )
  `,
  `
  CREATE TABLE category_groups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
  `,
  `
  CREATE TABLE categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category_group_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (category_group_id) REFERENCES category_groups(id)
  )
  `,
  `
  CREATE TABLE payees (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
  `,
  `
  CREATE TABLE transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    payee_id INTEGER NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    description TEXT NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0),
    date TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    notes TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (payee_id) REFERENCES payees(id)
  )
  `,
  `
  CREATE TABLE transfers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    source_account_id INTEGER NOT NULL,
    destination_account_id INTEGER NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0),
    date TEXT NOT NULL,
    description TEXT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'cancelled')),
    CHECK (source_account_id <> destination_account_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (source_account_id) REFERENCES accounts(id),
    FOREIGN KEY (destination_account_id) REFERENCES accounts(id)
  )
  `,
  `
  CREATE TABLE recurring_transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    payee_id INTEGER NULL,
    name TEXT NOT NULL,
    description TEXT NULL,
    type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
    recurrence_type TEXT NOT NULL CHECK (
      recurrence_type IN ('subscription', 'fixed_bill', 'fixed_income', 'monthly_fee', 'other')
    ),
    amount INTEGER NOT NULL CHECK (amount > 0),
    frequency TEXT NOT NULL CHECK (
      frequency IN ('monthly', 'yearly', 'weekly', 'biweekly', 'custom')
    ),
    due_day INTEGER NOT NULL CHECK (due_day BETWEEN 1 AND 31),
    start_date TEXT NOT NULL,
    end_date TEXT NULL,
    active INTEGER NOT NULL CHECK (active IN (0, 1)),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (payee_id) REFERENCES payees(id)
  )
  `,
  `
  CREATE TABLE credit_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    credit_limit INTEGER NOT NULL CHECK (credit_limit >= 0),
    closing_day INTEGER NOT NULL CHECK (closing_day BETWEEN 1 AND 31),
    due_day INTEGER NOT NULL CHECK (due_day BETWEEN 1 AND 31),
    notes TEXT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
  `,
  `
  CREATE TABLE credit_card_statements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    credit_card_id INTEGER NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    due_date TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('open', 'closed', 'paid', 'cancelled')),
    FOREIGN KEY (credit_card_id) REFERENCES credit_cards(id)
  )
  `,
  `
  CREATE TABLE credit_card_purchases (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    credit_card_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    payee_id INTEGER NULL,
    description TEXT NOT NULL,
    total_amount INTEGER NOT NULL CHECK (total_amount > 0),
    installment_count INTEGER NOT NULL CHECK (installment_count >= 1),
    purchase_date TEXT NOT NULL,
    FOREIGN KEY (credit_card_id) REFERENCES credit_cards(id),
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (payee_id) REFERENCES payees(id)
  )
  `,
  `
  CREATE TABLE credit_card_installments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    credit_card_purchase_id INTEGER NOT NULL,
    credit_card_statement_id INTEGER NOT NULL,
    installment_number INTEGER NOT NULL CHECK (installment_number >= 1),
    amount INTEGER NOT NULL CHECK (amount > 0),
    competence_date TEXT NOT NULL,
    FOREIGN KEY (credit_card_purchase_id) REFERENCES credit_card_purchases(id),
    FOREIGN KEY (credit_card_statement_id) REFERENCES credit_card_statements(id)
  )
  `,
  `
  CREATE TABLE credit_card_statement_payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    credit_card_statement_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0),
    date TEXT NOT NULL,
    transaction_id INTEGER NOT NULL UNIQUE,
    FOREIGN KEY (credit_card_statement_id) REFERENCES credit_card_statements(id),
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (transaction_id) REFERENCES transactions(id)
  )
  `,
] as const;

const CREATE_INDEX_STATEMENTS = [
  `CREATE INDEX idx_users_email ON users(email)`,
  `CREATE INDEX idx_user_settings_user_id ON user_settings(user_id)`,
  `CREATE INDEX idx_accounts_user_id ON accounts(user_id)`,
  `CREATE INDEX idx_accounts_account_type_id ON accounts(account_type_id)`,
  `CREATE INDEX idx_category_groups_user_id ON category_groups(user_id)`,
  `CREATE INDEX idx_categories_user_id ON categories(user_id)`,
  `CREATE INDEX idx_categories_category_group_id ON categories(category_group_id)`,
  `CREATE INDEX idx_categories_type ON categories(type)`,
  `CREATE INDEX idx_payees_user_id ON payees(user_id)`,
  `CREATE INDEX idx_transactions_user_id ON transactions(user_id)`,
  `CREATE INDEX idx_transactions_account_id ON transactions(account_id)`,
  `CREATE INDEX idx_transactions_category_id ON transactions(category_id)`,
  `CREATE INDEX idx_transactions_payee_id ON transactions(payee_id)`,
  `CREATE INDEX idx_transactions_date ON transactions(date)`,
  `CREATE INDEX idx_transactions_status ON transactions(status)`,
  `CREATE INDEX idx_transactions_type ON transactions(type)`,
  `CREATE INDEX idx_transfers_user_id ON transfers(user_id)`,
  `CREATE INDEX idx_transfers_source_account_id ON transfers(source_account_id)`,
  `CREATE INDEX idx_transfers_destination_account_id ON transfers(destination_account_id)`,
  `CREATE INDEX idx_transfers_date ON transfers(date)`,
  `CREATE INDEX idx_transfers_status ON transfers(status)`,
  `CREATE INDEX idx_recurring_transactions_user_id ON recurring_transactions(user_id)`,
  `CREATE INDEX idx_recurring_transactions_active ON recurring_transactions(active)`,
  `CREATE INDEX idx_recurring_transactions_due_day ON recurring_transactions(due_day)`,
  `CREATE INDEX idx_credit_cards_user_id ON credit_cards(user_id)`,
  `CREATE INDEX idx_credit_card_statements_credit_card_id ON credit_card_statements(credit_card_id)`,
  `CREATE INDEX idx_credit_card_statements_status ON credit_card_statements(status)`,
  `CREATE INDEX idx_credit_card_statements_due_date ON credit_card_statements(due_date)`,
  `CREATE INDEX idx_credit_card_purchases_credit_card_id ON credit_card_purchases(credit_card_id)`,
  `CREATE INDEX idx_credit_card_purchases_category_id ON credit_card_purchases(category_id)`,
  `CREATE INDEX idx_credit_card_purchases_payee_id ON credit_card_purchases(payee_id)`,
  `CREATE INDEX idx_credit_card_purchases_purchase_date ON credit_card_purchases(purchase_date)`,
  `CREATE INDEX idx_credit_card_installments_credit_card_purchase_id ON credit_card_installments(credit_card_purchase_id)`,
  `CREATE INDEX idx_credit_card_installments_credit_card_statement_id ON credit_card_installments(credit_card_statement_id)`,
  `CREATE INDEX idx_credit_card_installments_competence_date ON credit_card_installments(competence_date)`,
  `CREATE INDEX idx_cc_statement_payments_statement_id ON credit_card_statement_payments(credit_card_statement_id)`,
  `CREATE INDEX idx_cc_statement_payments_account_id ON credit_card_statement_payments(account_id)`,
  `CREATE INDEX idx_cc_statement_payments_transaction_id ON credit_card_statement_payments(transaction_id)`,
  `CREATE INDEX idx_cc_statement_payments_date ON credit_card_statement_payments(date)`,
] as const;

const DROP_TABLE_STATEMENTS = [
  `DROP TABLE IF EXISTS credit_card_statement_payments`,
  `DROP TABLE IF EXISTS credit_card_installments`,
  `DROP TABLE IF EXISTS credit_card_purchases`,
  `DROP TABLE IF EXISTS credit_card_statements`,
  `DROP TABLE IF EXISTS credit_cards`,
  `DROP TABLE IF EXISTS recurring_transactions`,
  `DROP TABLE IF EXISTS transfers`,
  `DROP TABLE IF EXISTS transactions`,
  `DROP TABLE IF EXISTS payees`,
  `DROP TABLE IF EXISTS categories`,
  `DROP TABLE IF EXISTS category_groups`,
  `DROP TABLE IF EXISTS accounts`,
  `DROP TABLE IF EXISTS account_types`,
  `DROP TABLE IF EXISTS user_settings`,
  `DROP TABLE IF EXISTS users`,
] as const;

const executeStatements = async (
  db: Kysely<DatabaseSchema>,
  statements: readonly string[],
): Promise<void> => {
  for (const statement of statements) {
    await sql.raw(statement).execute(db);
  }
};

export async function up(db: Kysely<DatabaseSchema>): Promise<void> {
  await sql`PRAGMA foreign_keys = ON`.execute(db);
  await executeStatements(db, CREATE_TABLE_STATEMENTS);
  await executeStatements(db, CREATE_INDEX_STATEMENTS);
}

export async function down(db: Kysely<DatabaseSchema>): Promise<void> {
  await sql`PRAGMA foreign_keys = OFF`.execute(db);
  await executeStatements(db, DROP_TABLE_STATEMENTS);
  await sql`PRAGMA foreign_keys = ON`.execute(db);
}
