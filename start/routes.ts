/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from '#start/kernel';
import { controllers } from '#generated/controllers';
import router from '@adonisjs/core/services/router';

const AccountTypesController = () => import('#controllers/account_types_controller');
const AccountsController = () => import('#controllers/accounts_controller');
const CategoryGroupsController = () => import('#controllers/category_groups_controller');
const CategoriesController = () => import('#controllers/categories_controller');
const PayeesController = () => import('#controllers/payees_controller');
const TransactionsController = () => import('#controllers/transactions_controller');
const TransfersController = () => import('#controllers/transfers_controller');
const RecurringTransactionsController = () => import('#controllers/recurring_transactions_controller');
const BudgetsController = () => import('#controllers/budgets_controller');
const BudgetCategoriesController = () => import('#controllers/budget_categories_controller');

router.on('/').renderInertia('home', {}).as('home');

router
  .group(() => {
    router.get('signup', [controllers.NewAccount, 'create']);
    router.post('signup', [controllers.NewAccount, 'store']);

    router.get('login', [controllers.Session, 'create']);
    router.post('login', [controllers.Session, 'store']);
  })
  .use(middleware.guest());

router
  .group(() => {
    router.post('logout', [controllers.Session, 'destroy']);

    router.get('account-types', [AccountTypesController, 'index']);
    router.post('account-types', [AccountTypesController, 'store']);
    router.put('account-types/:id', [AccountTypesController, 'update']);
    router.patch('account-types/:id/archive', [AccountTypesController, 'archive']);

    router.get('accounts', [AccountsController, 'index']);
    router.post('accounts', [AccountsController, 'store']);
    router.put('accounts/:id', [AccountsController, 'update']);
    router.patch('accounts/:id/archive', [AccountsController, 'archive']);

    router.get('category-groups', [CategoryGroupsController, 'index']);
    router.post('category-groups', [CategoryGroupsController, 'store']);
    router.put('category-groups/:id', [CategoryGroupsController, 'update']);
    router.patch('category-groups/:id/archive', [CategoryGroupsController, 'archive']);

    router.get('categories', [CategoriesController, 'index']);
    router.post('categories', [CategoriesController, 'store']);
    router.put('categories/:id', [CategoriesController, 'update']);
    router.patch('categories/:id/archive', [CategoriesController, 'archive']);

    router.get('payees', [PayeesController, 'index']);
    router.post('payees', [PayeesController, 'store']);
    router.put('payees/:id', [PayeesController, 'update']);
    router.patch('payees/:id/archive', [PayeesController, 'archive']);

    router.get('transactions', [TransactionsController, 'index']);
    router.post('transactions', [TransactionsController, 'store']);
    router.put('transactions/:id', [TransactionsController, 'update']);
    router.patch('transactions/:id/archive', [TransactionsController, 'archive']);

    router.post('transfers', [TransfersController, 'store']);
    router.get('transfers/:id', [TransfersController, 'show']);
    router.patch('transfers/:id/archive', [TransfersController, 'archive']);

    router.get('recurring-transactions', [RecurringTransactionsController, 'index']);
    router.post('recurring-transactions', [RecurringTransactionsController, 'store']);
    router.put('recurring-transactions/:id', [RecurringTransactionsController, 'update']);
    router.patch('recurring-transactions/:id/archive', [RecurringTransactionsController, 'archive']);

    router.get('budgets', [BudgetsController, 'index']);
    router.post('budgets', [BudgetsController, 'store']);
    router.put('budgets/:id', [BudgetsController, 'update']);
    router.patch('budgets/:id/archive', [BudgetsController, 'archive']);

    router.get('budget-categories', [BudgetCategoriesController, 'index']);
    router.post('budget-categories', [BudgetCategoriesController, 'store']);
    router.put('budget-categories/:id', [BudgetCategoriesController, 'update']);
    router.patch('budget-categories/:id/archive', [BudgetCategoriesController, 'archive']);
  })
  .use(middleware.auth());
