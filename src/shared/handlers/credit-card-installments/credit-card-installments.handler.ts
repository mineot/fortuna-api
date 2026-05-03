import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerCrudHandlers } from '../crud/register.crud';
import { CREDIT_CARD_INSTALLMENTS_CHANNELS } from './credit-card-installments.types';

export function registerCreditCardInstallmentsHandlers(db: Kysely<Database>): void {
  registerCrudHandlers(db, 'credit_card_installments', CREDIT_CARD_INSTALLMENTS_CHANNELS);
}
