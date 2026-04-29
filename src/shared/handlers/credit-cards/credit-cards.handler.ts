import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register-crud';
import { CREDIT_CARDS_CHANNELS } from './credit-cards.types';

export function registerCreditCardsHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'credit_cards', CREDIT_CARDS_CHANNELS);
}
