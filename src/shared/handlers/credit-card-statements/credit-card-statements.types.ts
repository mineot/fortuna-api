import type { CreditCardStatementsTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const CREDIT_CARD_STATEMENTS_CHANNELS = {
  list: 'credit-card-statements:list',
  findOne: 'credit-card-statements:find-one',
  add: 'credit-card-statements:add',
  change: 'credit-card-statements:change',
  remove: 'credit-card-statements:remove',
} as const;

export type CreditCardStatementsRow = Selectable<CreditCardStatementsTable>;
export type CreditCardStatementsAddInput = Insertable<CreditCardStatementsTable>;
export type CreditCardStatementsChangeInput = { id: number; changes: Updateable<CreditCardStatementsTable> };
