import { Hono } from 'hono';

import type { ApiVariables } from '../lib/http-context.js';
import { createApiRepositories } from '../lib/repositories.js';
import { createAccountTypesRoutes } from '../modules/account-types/routes.js';
import { createAccountsRoutes } from '../modules/accounts/routes.js';
import { createCategoriesRoutes } from '../modules/categories/routes.js';
import { createCategoryGroupsRoutes } from '../modules/category-groups/routes.js';
import { createCreditCardInstallmentsRoutes } from '../modules/credit-card-installments/routes.js';
import { createCreditCardPurchasesRoutes } from '../modules/credit-card-purchases/routes.js';
import { createCreditCardStatementPaymentsRoutes } from '../modules/credit-card-statement-payments/routes.js';
import { createCreditCardStatementsRoutes } from '../modules/credit-card-statements/routes.js';
import { createCreditCardsRoutes } from '../modules/credit-cards/routes.js';
import { healthRoutes } from '../modules/health/routes.js';
import { createPayeesRoutes } from '../modules/payees/routes.js';
import { createRecurringTransactionsRoutes } from '../modules/recurring-transactions/routes.js';
import { createReportsRoutes } from '../modules/reports/routes.js';
import { createTransactionsRoutes } from '../modules/transactions/routes.js';
import { createTransfersRoutes } from '../modules/transfers/routes.js';
import { createUserSettingsRoutes } from '../modules/user-settings/routes.js';
import { createUsersRoutes } from '../modules/users/routes.js';

export const registerRoutes = (app: Hono<{ Variables: ApiVariables }>): void => {
  const repositories = createApiRepositories();
  const apiV1 = new Hono<{ Variables: ApiVariables }>();

  apiV1.route('/users', createUsersRoutes(repositories));
  apiV1.route('/user-settings', createUserSettingsRoutes(repositories));
  apiV1.route('/account-types', createAccountTypesRoutes(repositories));
  apiV1.route('/accounts', createAccountsRoutes(repositories));
  apiV1.route('/category-groups', createCategoryGroupsRoutes(repositories));
  apiV1.route('/categories', createCategoriesRoutes(repositories));
  apiV1.route('/payees', createPayeesRoutes(repositories));
  apiV1.route('/credit-cards', createCreditCardsRoutes(repositories));
  apiV1.route('/', createCreditCardStatementsRoutes(repositories));
  apiV1.route('/', createCreditCardPurchasesRoutes(repositories));
  apiV1.route('/', createCreditCardInstallmentsRoutes(repositories));
  apiV1.route('/', createCreditCardStatementPaymentsRoutes(repositories));
  apiV1.route('/transactions', createTransactionsRoutes(repositories));
  apiV1.route('/transfers', createTransfersRoutes(repositories));
  apiV1.route('/recurring-transactions', createRecurringTransactionsRoutes(repositories));
  apiV1.route('/', createReportsRoutes(repositories));

  app.route('/', healthRoutes);
  app.route('/api/v1', apiV1);
};
