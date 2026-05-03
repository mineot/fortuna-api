import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register.crud';
import { CREDIT_CARD_PURCHASES_CHANNELS } from './credit-card-purchases.types';

export function registerCreditCardPurchasesHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'credit_card_purchases', CREDIT_CARD_PURCHASES_CHANNELS);
}
