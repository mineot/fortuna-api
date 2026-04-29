import type { Database } from '@db';
import type { Kysely } from 'kysely';

import { registerAccountTypesHandlers } from './account-types/account-types.handler';
import { registerAccountsHandlers } from './accounts/accounts.handler';
import { registerAppHandlers } from './app/app.handler';
import { registerCategoriesHandlers } from './categories/categories.handler';
import { registerCategoryGroupsHandlers } from './category-groups/category-groups.handler';
import { registerCreditCardInstallmentsHandlers } from './credit-card-installments/credit-card-installments.handler';
import { registerCreditCardPurchasesHandlers } from './credit-card-purchases/credit-card-purchases.handler';
import { registerCreditCardStatementPaymentsHandlers } from './credit-card-statement-payments/credit-card-statement-payments.handler';
import { registerCreditCardStatementsHandlers } from './credit-card-statements/credit-card-statements.handler';
import { registerCreditCardsHandlers } from './credit-cards/credit-cards.handler';
import { registerPayeesHandlers } from './payees/payees.handler';
import { registerRecurringTransactionsHandlers } from './recurring-transactions/recurring-transactions.handler';
import { registerTransactionsHandlers } from './transactions/transactions.handler';
import { registerTransfersHandlers } from './transfers/transfers.handler';
import { registerUserSettingsHandlers } from './user-settings/user-settings.handler';
import { registerUsersHandlers } from './users/users.handler';

export function registerIpcHandlers(db: Kysely<Database>): void {
  registerAppHandlers();
  registerUsersHandlers(db);
  registerUserSettingsHandlers(db);
  registerAccountTypesHandlers(db);
  registerAccountsHandlers(db);
  registerCategoryGroupsHandlers(db);
  registerCategoriesHandlers(db);
  registerPayeesHandlers(db);
  registerTransactionsHandlers(db);
  registerTransfersHandlers(db);
  registerRecurringTransactionsHandlers(db);
  registerCreditCardsHandlers(db);
  registerCreditCardStatementsHandlers(db);
  registerCreditCardPurchasesHandlers(db);
  registerCreditCardInstallmentsHandlers(db);
  registerCreditCardStatementPaymentsHandlers(db);
}
