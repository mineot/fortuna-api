import type { CreditCardPurchasesTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const CREDIT_CARD_PURCHASES_CHANNELS = {
  list: 'credit-card-purchases:list',
  findOne: 'credit-card-purchases:find-one',
  add: 'credit-card-purchases:add',
  change: 'credit-card-purchases:change',
  remove: 'credit-card-purchases:remove',
} as const;

export type CreditCardPurchasesRow = Selectable<CreditCardPurchasesTable>;
export type CreditCardPurchasesAddInput = Insertable<CreditCardPurchasesTable>;
export type CreditCardPurchasesChangeInput = { id: number; changes: Updateable<CreditCardPurchasesTable> };
