import type { CreditCardInstallmentsTable } from '@db/schema';
import type { Insertable, Selectable, Updateable } from 'kysely';

export const CREDIT_CARD_INSTALLMENTS_CHANNELS = {
  list: 'credit-card-installments:list',
  findOne: 'credit-card-installments:find-one',
  add: 'credit-card-installments:add',
  change: 'credit-card-installments:change',
  remove: 'credit-card-installments:remove',
} as const;

export type CreditCardInstallmentsRow = Selectable<CreditCardInstallmentsTable>;
export type CreditCardInstallmentsAddInput = Insertable<CreditCardInstallmentsTable>;
export type CreditCardInstallmentsChangeInput = { id: number; changes: Updateable<CreditCardInstallmentsTable> };
