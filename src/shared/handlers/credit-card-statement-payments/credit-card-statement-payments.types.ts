import type { CreditCardStatementPaymentsTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const CREDIT_CARD_STATEMENT_PAYMENTS_CHANNELS = {
  list: 'credit-card-statement-payments:list',
  findOne: 'credit-card-statement-payments:find-one',
  add: 'credit-card-statement-payments:add',
  change: 'credit-card-statement-payments:change',
  remove: 'credit-card-statement-payments:remove',
} as const;

export type CreditCardStatementPaymentsRow = Selectable<CreditCardStatementPaymentsTable>;
export type CreditCardStatementPaymentsAddInput = Insertable<CreditCardStatementPaymentsTable>;
export type CreditCardStatementPaymentsChangeInput = { id: number; changes: Updateable<CreditCardStatementPaymentsTable> };
