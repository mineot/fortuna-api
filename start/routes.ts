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
const RecurringTransactionsController = () =>
  import('#controllers/recurring_transactions_controller');
const BudgetsController = () => import('#controllers/budgets_controller');
const BudgetCategoriesController = () => import('#controllers/budget_categories_controller');
const CreditCardsController = () => import('#controllers/credit_cards_controller');
const CreditCardInvoicesController = () => import('#controllers/credit_card_invoices_controller');
const CreditCardPurchasesController = () => import('#controllers/credit_card_purchases_controller');
const CreditCardInstallmentsController = () =>
  import('#controllers/credit_card_installments_controller');
const CreditCardInvoicePaymentsController = () =>
  import('#controllers/credit_card_invoice_payments_controller');
const SettingsController = () => import('#controllers/settings_controller');
const ProfileController = () => import('#controllers/profile_controller');
const ShoppingListsController = () => import('#controllers/shopping_lists_controller');
const ShoppingListItemsController = () => import('#controllers/shopping_list_items_controller');
const PurchasesController = () => import('#controllers/purchases_controller');
const PurchaseItemsController = () => import('#controllers/purchase_items_controller');

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
    router.get('account-types/list', [AccountTypesController, 'list']);
    router.get('account-types/:id', [AccountTypesController, 'show']);
    router.post('account-types', [AccountTypesController, 'store']);
    router.put('account-types/:id', [AccountTypesController, 'update']);
    router.patch('account-types/:id/archive', [AccountTypesController, 'archive']);

    router.get('accounts', [AccountsController, 'index']);
    router.post('accounts', [AccountsController, 'store']);
    router.put('accounts/:id', [AccountsController, 'update']);
    router.patch('accounts/:id/archive', [AccountsController, 'archive']);

    router.get('category-groups', [CategoryGroupsController, 'index']);
    router.get('category-groups/list', [CategoryGroupsController, 'list']);
    router.get('category-groups/:id', [CategoryGroupsController, 'show']);
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
    router.patch('recurring-transactions/:id/archive', [
      RecurringTransactionsController,
      'archive',
    ]);

    router.get('budgets', [BudgetsController, 'index']);
    router.post('budgets', [BudgetsController, 'store']);
    router.put('budgets/:id', [BudgetsController, 'update']);
    router.patch('budgets/:id/archive', [BudgetsController, 'archive']);

    router.get('budget-categories', [BudgetCategoriesController, 'index']);
    router.post('budget-categories', [BudgetCategoriesController, 'store']);
    router.put('budget-categories/:id', [BudgetCategoriesController, 'update']);
    router.patch('budget-categories/:id/archive', [BudgetCategoriesController, 'archive']);

    router.get('credit-cards', [CreditCardsController, 'index']);
    router.post('credit-cards', [CreditCardsController, 'store']);
    router.put('credit-cards/:id', [CreditCardsController, 'update']);
    router.patch('credit-cards/:id/archive', [CreditCardsController, 'archive']);

    router.get('credit-card-invoices', [CreditCardInvoicesController, 'index']);
    router.post('credit-card-invoices', [CreditCardInvoicesController, 'store']);
    router.put('credit-card-invoices/:id', [CreditCardInvoicesController, 'update']);
    router.patch('credit-card-invoices/:id/archive', [CreditCardInvoicesController, 'archive']);

    router.get('credit-card-purchases', [CreditCardPurchasesController, 'index']);
    router.post('credit-card-purchases', [CreditCardPurchasesController, 'store']);
    router.put('credit-card-purchases/:id', [CreditCardPurchasesController, 'update']);
    router.patch('credit-card-purchases/:id/archive', [CreditCardPurchasesController, 'archive']);

    router.get('credit-card-installments', [CreditCardInstallmentsController, 'index']);
    router.post('credit-card-installments', [CreditCardInstallmentsController, 'store']);
    router.put('credit-card-installments/:id', [CreditCardInstallmentsController, 'update']);
    router.patch('credit-card-installments/:id/archive', [
      CreditCardInstallmentsController,
      'archive',
    ]);

    router.get('credit-card-invoice-payments', [CreditCardInvoicePaymentsController, 'index']);
    router.post('credit-card-invoice-payments', [CreditCardInvoicePaymentsController, 'store']);
    router.put('credit-card-invoice-payments/:id', [CreditCardInvoicePaymentsController, 'update']);
    router.patch('credit-card-invoice-payments/:id/archive', [
      CreditCardInvoicePaymentsController,
      'archive',
    ]);

    router.get('shopping-lists', [ShoppingListsController, 'index']);
    router.post('shopping-lists', [ShoppingListsController, 'store']);
    router.put('shopping-lists/:id', [ShoppingListsController, 'update']);
    router.patch('shopping-lists/:id/archive', [ShoppingListsController, 'archive']);

    router.get('shopping-list-items', [ShoppingListItemsController, 'index']);
    router.post('shopping-list-items', [ShoppingListItemsController, 'store']);
    router.put('shopping-list-items/:id', [ShoppingListItemsController, 'update']);
    router.patch('shopping-list-items/:id/archive', [ShoppingListItemsController, 'archive']);

    router.get('purchases', [PurchasesController, 'index']);
    router.post('purchases', [PurchasesController, 'store']);
    router.put('purchases/:id', [PurchasesController, 'update']);
    router.patch('purchases/:id/archive', [PurchasesController, 'archive']);

    router.get('purchase-items', [PurchaseItemsController, 'index']);
    router.post('purchase-items', [PurchaseItemsController, 'store']);
    router.put('purchase-items/:id', [PurchaseItemsController, 'update']);
    router.patch('purchase-items/:id/archive', [PurchaseItemsController, 'archive']);

    router.get('settings', [SettingsController, 'index']);
    router.put('settings', [SettingsController, 'update']);

    router.get('profile', [ProfileController, 'index']);
    router.put('profile', [ProfileController, 'update']);
  })
  .use(middleware.auth());
