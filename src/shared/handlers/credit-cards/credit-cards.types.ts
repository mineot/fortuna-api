import type { CreditCardsTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const CREDIT_CARDS_CHANNELS = {
  list: 'credit-cards:list',
  listAll: 'credit-cards:list-all',
  findOne: 'credit-cards:find-one',
  add: 'credit-cards:add',
  change: 'credit-cards:change',
  remove: 'credit-cards:remove',
} as const;

export type CreditCardsRow = Selectable<CreditCardsTable>;
export type CreditCardsAddInput = Insertable<CreditCardsTable>;
export type CreditCardsChangeInput = { id: number; changes: Updateable<CreditCardsTable> };
