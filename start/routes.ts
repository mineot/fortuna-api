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
  })
  .use(middleware.auth());
