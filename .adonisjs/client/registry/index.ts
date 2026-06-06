/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'home': {
    methods: ["GET","HEAD"],
    pattern: '/',
    tokens: [{"old":"/","type":0,"val":"/","end":""}],
    types: placeholder as Registry['home']['types'],
  },
  'new_account.create': {
    methods: ["GET","HEAD"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.create']['types'],
  },
  'new_account.store': {
    methods: ["POST"],
    pattern: '/signup',
    tokens: [{"old":"/signup","type":0,"val":"signup","end":""}],
    types: placeholder as Registry['new_account.store']['types'],
  },
  'session.create': {
    methods: ["GET","HEAD"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.create']['types'],
  },
  'session.store': {
    methods: ["POST"],
    pattern: '/login',
    tokens: [{"old":"/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['session.store']['types'],
  },
  'session.destroy': {
    methods: ["POST"],
    pattern: '/logout',
    tokens: [{"old":"/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['session.destroy']['types'],
  },
  'account_types.index': {
    methods: ["GET","HEAD"],
    pattern: '/account-types',
    tokens: [{"old":"/account-types","type":0,"val":"account-types","end":""}],
    types: placeholder as Registry['account_types.index']['types'],
  },
  'account_types.store': {
    methods: ["POST"],
    pattern: '/account-types',
    tokens: [{"old":"/account-types","type":0,"val":"account-types","end":""}],
    types: placeholder as Registry['account_types.store']['types'],
  },
  'account_types.update': {
    methods: ["PUT"],
    pattern: '/account-types/:id',
    tokens: [{"old":"/account-types/:id","type":0,"val":"account-types","end":""},{"old":"/account-types/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['account_types.update']['types'],
  },
  'account_types.archive': {
    methods: ["PATCH"],
    pattern: '/account-types/:id/archive',
    tokens: [{"old":"/account-types/:id/archive","type":0,"val":"account-types","end":""},{"old":"/account-types/:id/archive","type":1,"val":"id","end":""},{"old":"/account-types/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['account_types.archive']['types'],
  },
  'accounts.index': {
    methods: ["GET","HEAD"],
    pattern: '/accounts',
    tokens: [{"old":"/accounts","type":0,"val":"accounts","end":""}],
    types: placeholder as Registry['accounts.index']['types'],
  },
  'accounts.store': {
    methods: ["POST"],
    pattern: '/accounts',
    tokens: [{"old":"/accounts","type":0,"val":"accounts","end":""}],
    types: placeholder as Registry['accounts.store']['types'],
  },
  'accounts.update': {
    methods: ["PUT"],
    pattern: '/accounts/:id',
    tokens: [{"old":"/accounts/:id","type":0,"val":"accounts","end":""},{"old":"/accounts/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['accounts.update']['types'],
  },
  'accounts.archive': {
    methods: ["PATCH"],
    pattern: '/accounts/:id/archive',
    tokens: [{"old":"/accounts/:id/archive","type":0,"val":"accounts","end":""},{"old":"/accounts/:id/archive","type":1,"val":"id","end":""},{"old":"/accounts/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['accounts.archive']['types'],
  },
  'category_groups.index': {
    methods: ["GET","HEAD"],
    pattern: '/category-groups',
    tokens: [{"old":"/category-groups","type":0,"val":"category-groups","end":""}],
    types: placeholder as Registry['category_groups.index']['types'],
  },
  'category_groups.store': {
    methods: ["POST"],
    pattern: '/category-groups',
    tokens: [{"old":"/category-groups","type":0,"val":"category-groups","end":""}],
    types: placeholder as Registry['category_groups.store']['types'],
  },
  'category_groups.update': {
    methods: ["PUT"],
    pattern: '/category-groups/:id',
    tokens: [{"old":"/category-groups/:id","type":0,"val":"category-groups","end":""},{"old":"/category-groups/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['category_groups.update']['types'],
  },
  'category_groups.archive': {
    methods: ["PATCH"],
    pattern: '/category-groups/:id/archive',
    tokens: [{"old":"/category-groups/:id/archive","type":0,"val":"category-groups","end":""},{"old":"/category-groups/:id/archive","type":1,"val":"id","end":""},{"old":"/category-groups/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['category_groups.archive']['types'],
  },
  'categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/categories',
    tokens: [{"old":"/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.index']['types'],
  },
  'categories.store': {
    methods: ["POST"],
    pattern: '/categories',
    tokens: [{"old":"/categories","type":0,"val":"categories","end":""}],
    types: placeholder as Registry['categories.store']['types'],
  },
  'categories.update': {
    methods: ["PUT"],
    pattern: '/categories/:id',
    tokens: [{"old":"/categories/:id","type":0,"val":"categories","end":""},{"old":"/categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['categories.update']['types'],
  },
  'categories.archive': {
    methods: ["PATCH"],
    pattern: '/categories/:id/archive',
    tokens: [{"old":"/categories/:id/archive","type":0,"val":"categories","end":""},{"old":"/categories/:id/archive","type":1,"val":"id","end":""},{"old":"/categories/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['categories.archive']['types'],
  },
  'payees.index': {
    methods: ["GET","HEAD"],
    pattern: '/payees',
    tokens: [{"old":"/payees","type":0,"val":"payees","end":""}],
    types: placeholder as Registry['payees.index']['types'],
  },
  'payees.store': {
    methods: ["POST"],
    pattern: '/payees',
    tokens: [{"old":"/payees","type":0,"val":"payees","end":""}],
    types: placeholder as Registry['payees.store']['types'],
  },
  'payees.update': {
    methods: ["PUT"],
    pattern: '/payees/:id',
    tokens: [{"old":"/payees/:id","type":0,"val":"payees","end":""},{"old":"/payees/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['payees.update']['types'],
  },
  'payees.archive': {
    methods: ["PATCH"],
    pattern: '/payees/:id/archive',
    tokens: [{"old":"/payees/:id/archive","type":0,"val":"payees","end":""},{"old":"/payees/:id/archive","type":1,"val":"id","end":""},{"old":"/payees/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['payees.archive']['types'],
  },
  'transactions.index': {
    methods: ["GET","HEAD"],
    pattern: '/transactions',
    tokens: [{"old":"/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['transactions.index']['types'],
  },
  'transactions.store': {
    methods: ["POST"],
    pattern: '/transactions',
    tokens: [{"old":"/transactions","type":0,"val":"transactions","end":""}],
    types: placeholder as Registry['transactions.store']['types'],
  },
  'transactions.update': {
    methods: ["PUT"],
    pattern: '/transactions/:id',
    tokens: [{"old":"/transactions/:id","type":0,"val":"transactions","end":""},{"old":"/transactions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['transactions.update']['types'],
  },
  'transactions.archive': {
    methods: ["PATCH"],
    pattern: '/transactions/:id/archive',
    tokens: [{"old":"/transactions/:id/archive","type":0,"val":"transactions","end":""},{"old":"/transactions/:id/archive","type":1,"val":"id","end":""},{"old":"/transactions/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['transactions.archive']['types'],
  },
  'transfers.store': {
    methods: ["POST"],
    pattern: '/transfers',
    tokens: [{"old":"/transfers","type":0,"val":"transfers","end":""}],
    types: placeholder as Registry['transfers.store']['types'],
  },
  'transfers.show': {
    methods: ["GET","HEAD"],
    pattern: '/transfers/:id',
    tokens: [{"old":"/transfers/:id","type":0,"val":"transfers","end":""},{"old":"/transfers/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['transfers.show']['types'],
  },
  'transfers.archive': {
    methods: ["PATCH"],
    pattern: '/transfers/:id/archive',
    tokens: [{"old":"/transfers/:id/archive","type":0,"val":"transfers","end":""},{"old":"/transfers/:id/archive","type":1,"val":"id","end":""},{"old":"/transfers/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['transfers.archive']['types'],
  },
  'recurring_transactions.index': {
    methods: ["GET","HEAD"],
    pattern: '/recurring-transactions',
    tokens: [{"old":"/recurring-transactions","type":0,"val":"recurring-transactions","end":""}],
    types: placeholder as Registry['recurring_transactions.index']['types'],
  },
  'recurring_transactions.store': {
    methods: ["POST"],
    pattern: '/recurring-transactions',
    tokens: [{"old":"/recurring-transactions","type":0,"val":"recurring-transactions","end":""}],
    types: placeholder as Registry['recurring_transactions.store']['types'],
  },
  'recurring_transactions.update': {
    methods: ["PUT"],
    pattern: '/recurring-transactions/:id',
    tokens: [{"old":"/recurring-transactions/:id","type":0,"val":"recurring-transactions","end":""},{"old":"/recurring-transactions/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['recurring_transactions.update']['types'],
  },
  'recurring_transactions.archive': {
    methods: ["PATCH"],
    pattern: '/recurring-transactions/:id/archive',
    tokens: [{"old":"/recurring-transactions/:id/archive","type":0,"val":"recurring-transactions","end":""},{"old":"/recurring-transactions/:id/archive","type":1,"val":"id","end":""},{"old":"/recurring-transactions/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['recurring_transactions.archive']['types'],
  },
  'budgets.index': {
    methods: ["GET","HEAD"],
    pattern: '/budgets',
    tokens: [{"old":"/budgets","type":0,"val":"budgets","end":""}],
    types: placeholder as Registry['budgets.index']['types'],
  },
  'budgets.store': {
    methods: ["POST"],
    pattern: '/budgets',
    tokens: [{"old":"/budgets","type":0,"val":"budgets","end":""}],
    types: placeholder as Registry['budgets.store']['types'],
  },
  'budgets.update': {
    methods: ["PUT"],
    pattern: '/budgets/:id',
    tokens: [{"old":"/budgets/:id","type":0,"val":"budgets","end":""},{"old":"/budgets/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['budgets.update']['types'],
  },
  'budgets.archive': {
    methods: ["PATCH"],
    pattern: '/budgets/:id/archive',
    tokens: [{"old":"/budgets/:id/archive","type":0,"val":"budgets","end":""},{"old":"/budgets/:id/archive","type":1,"val":"id","end":""},{"old":"/budgets/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['budgets.archive']['types'],
  },
  'budget_categories.index': {
    methods: ["GET","HEAD"],
    pattern: '/budget-categories',
    tokens: [{"old":"/budget-categories","type":0,"val":"budget-categories","end":""}],
    types: placeholder as Registry['budget_categories.index']['types'],
  },
  'budget_categories.store': {
    methods: ["POST"],
    pattern: '/budget-categories',
    tokens: [{"old":"/budget-categories","type":0,"val":"budget-categories","end":""}],
    types: placeholder as Registry['budget_categories.store']['types'],
  },
  'budget_categories.update': {
    methods: ["PUT"],
    pattern: '/budget-categories/:id',
    tokens: [{"old":"/budget-categories/:id","type":0,"val":"budget-categories","end":""},{"old":"/budget-categories/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['budget_categories.update']['types'],
  },
  'budget_categories.archive': {
    methods: ["PATCH"],
    pattern: '/budget-categories/:id/archive',
    tokens: [{"old":"/budget-categories/:id/archive","type":0,"val":"budget-categories","end":""},{"old":"/budget-categories/:id/archive","type":1,"val":"id","end":""},{"old":"/budget-categories/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['budget_categories.archive']['types'],
  },
  'credit_cards.index': {
    methods: ["GET","HEAD"],
    pattern: '/credit-cards',
    tokens: [{"old":"/credit-cards","type":0,"val":"credit-cards","end":""}],
    types: placeholder as Registry['credit_cards.index']['types'],
  },
  'credit_cards.store': {
    methods: ["POST"],
    pattern: '/credit-cards',
    tokens: [{"old":"/credit-cards","type":0,"val":"credit-cards","end":""}],
    types: placeholder as Registry['credit_cards.store']['types'],
  },
  'credit_cards.update': {
    methods: ["PUT"],
    pattern: '/credit-cards/:id',
    tokens: [{"old":"/credit-cards/:id","type":0,"val":"credit-cards","end":""},{"old":"/credit-cards/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['credit_cards.update']['types'],
  },
  'credit_cards.archive': {
    methods: ["PATCH"],
    pattern: '/credit-cards/:id/archive',
    tokens: [{"old":"/credit-cards/:id/archive","type":0,"val":"credit-cards","end":""},{"old":"/credit-cards/:id/archive","type":1,"val":"id","end":""},{"old":"/credit-cards/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['credit_cards.archive']['types'],
  },
  'credit_card_invoices.index': {
    methods: ["GET","HEAD"],
    pattern: '/credit-card-invoices',
    tokens: [{"old":"/credit-card-invoices","type":0,"val":"credit-card-invoices","end":""}],
    types: placeholder as Registry['credit_card_invoices.index']['types'],
  },
  'credit_card_invoices.store': {
    methods: ["POST"],
    pattern: '/credit-card-invoices',
    tokens: [{"old":"/credit-card-invoices","type":0,"val":"credit-card-invoices","end":""}],
    types: placeholder as Registry['credit_card_invoices.store']['types'],
  },
  'credit_card_invoices.update': {
    methods: ["PUT"],
    pattern: '/credit-card-invoices/:id',
    tokens: [{"old":"/credit-card-invoices/:id","type":0,"val":"credit-card-invoices","end":""},{"old":"/credit-card-invoices/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['credit_card_invoices.update']['types'],
  },
  'credit_card_invoices.archive': {
    methods: ["PATCH"],
    pattern: '/credit-card-invoices/:id/archive',
    tokens: [{"old":"/credit-card-invoices/:id/archive","type":0,"val":"credit-card-invoices","end":""},{"old":"/credit-card-invoices/:id/archive","type":1,"val":"id","end":""},{"old":"/credit-card-invoices/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['credit_card_invoices.archive']['types'],
  },
  'credit_card_purchases.index': {
    methods: ["GET","HEAD"],
    pattern: '/credit-card-purchases',
    tokens: [{"old":"/credit-card-purchases","type":0,"val":"credit-card-purchases","end":""}],
    types: placeholder as Registry['credit_card_purchases.index']['types'],
  },
  'credit_card_purchases.store': {
    methods: ["POST"],
    pattern: '/credit-card-purchases',
    tokens: [{"old":"/credit-card-purchases","type":0,"val":"credit-card-purchases","end":""}],
    types: placeholder as Registry['credit_card_purchases.store']['types'],
  },
  'credit_card_purchases.update': {
    methods: ["PUT"],
    pattern: '/credit-card-purchases/:id',
    tokens: [{"old":"/credit-card-purchases/:id","type":0,"val":"credit-card-purchases","end":""},{"old":"/credit-card-purchases/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['credit_card_purchases.update']['types'],
  },
  'credit_card_purchases.archive': {
    methods: ["PATCH"],
    pattern: '/credit-card-purchases/:id/archive',
    tokens: [{"old":"/credit-card-purchases/:id/archive","type":0,"val":"credit-card-purchases","end":""},{"old":"/credit-card-purchases/:id/archive","type":1,"val":"id","end":""},{"old":"/credit-card-purchases/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['credit_card_purchases.archive']['types'],
  },
  'credit_card_installments.index': {
    methods: ["GET","HEAD"],
    pattern: '/credit-card-installments',
    tokens: [{"old":"/credit-card-installments","type":0,"val":"credit-card-installments","end":""}],
    types: placeholder as Registry['credit_card_installments.index']['types'],
  },
  'credit_card_installments.store': {
    methods: ["POST"],
    pattern: '/credit-card-installments',
    tokens: [{"old":"/credit-card-installments","type":0,"val":"credit-card-installments","end":""}],
    types: placeholder as Registry['credit_card_installments.store']['types'],
  },
  'credit_card_installments.update': {
    methods: ["PUT"],
    pattern: '/credit-card-installments/:id',
    tokens: [{"old":"/credit-card-installments/:id","type":0,"val":"credit-card-installments","end":""},{"old":"/credit-card-installments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['credit_card_installments.update']['types'],
  },
  'credit_card_installments.archive': {
    methods: ["PATCH"],
    pattern: '/credit-card-installments/:id/archive',
    tokens: [{"old":"/credit-card-installments/:id/archive","type":0,"val":"credit-card-installments","end":""},{"old":"/credit-card-installments/:id/archive","type":1,"val":"id","end":""},{"old":"/credit-card-installments/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['credit_card_installments.archive']['types'],
  },
  'credit_card_invoice_payments.index': {
    methods: ["GET","HEAD"],
    pattern: '/credit-card-invoice-payments',
    tokens: [{"old":"/credit-card-invoice-payments","type":0,"val":"credit-card-invoice-payments","end":""}],
    types: placeholder as Registry['credit_card_invoice_payments.index']['types'],
  },
  'credit_card_invoice_payments.store': {
    methods: ["POST"],
    pattern: '/credit-card-invoice-payments',
    tokens: [{"old":"/credit-card-invoice-payments","type":0,"val":"credit-card-invoice-payments","end":""}],
    types: placeholder as Registry['credit_card_invoice_payments.store']['types'],
  },
  'credit_card_invoice_payments.update': {
    methods: ["PUT"],
    pattern: '/credit-card-invoice-payments/:id',
    tokens: [{"old":"/credit-card-invoice-payments/:id","type":0,"val":"credit-card-invoice-payments","end":""},{"old":"/credit-card-invoice-payments/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['credit_card_invoice_payments.update']['types'],
  },
  'credit_card_invoice_payments.archive': {
    methods: ["PATCH"],
    pattern: '/credit-card-invoice-payments/:id/archive',
    tokens: [{"old":"/credit-card-invoice-payments/:id/archive","type":0,"val":"credit-card-invoice-payments","end":""},{"old":"/credit-card-invoice-payments/:id/archive","type":1,"val":"id","end":""},{"old":"/credit-card-invoice-payments/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['credit_card_invoice_payments.archive']['types'],
  },
  'shopping_lists.index': {
    methods: ["GET","HEAD"],
    pattern: '/shopping-lists',
    tokens: [{"old":"/shopping-lists","type":0,"val":"shopping-lists","end":""}],
    types: placeholder as Registry['shopping_lists.index']['types'],
  },
  'shopping_lists.store': {
    methods: ["POST"],
    pattern: '/shopping-lists',
    tokens: [{"old":"/shopping-lists","type":0,"val":"shopping-lists","end":""}],
    types: placeholder as Registry['shopping_lists.store']['types'],
  },
  'shopping_lists.update': {
    methods: ["PUT"],
    pattern: '/shopping-lists/:id',
    tokens: [{"old":"/shopping-lists/:id","type":0,"val":"shopping-lists","end":""},{"old":"/shopping-lists/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['shopping_lists.update']['types'],
  },
  'shopping_lists.archive': {
    methods: ["PATCH"],
    pattern: '/shopping-lists/:id/archive',
    tokens: [{"old":"/shopping-lists/:id/archive","type":0,"val":"shopping-lists","end":""},{"old":"/shopping-lists/:id/archive","type":1,"val":"id","end":""},{"old":"/shopping-lists/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['shopping_lists.archive']['types'],
  },
  'shopping_list_items.index': {
    methods: ["GET","HEAD"],
    pattern: '/shopping-list-items',
    tokens: [{"old":"/shopping-list-items","type":0,"val":"shopping-list-items","end":""}],
    types: placeholder as Registry['shopping_list_items.index']['types'],
  },
  'shopping_list_items.store': {
    methods: ["POST"],
    pattern: '/shopping-list-items',
    tokens: [{"old":"/shopping-list-items","type":0,"val":"shopping-list-items","end":""}],
    types: placeholder as Registry['shopping_list_items.store']['types'],
  },
  'shopping_list_items.update': {
    methods: ["PUT"],
    pattern: '/shopping-list-items/:id',
    tokens: [{"old":"/shopping-list-items/:id","type":0,"val":"shopping-list-items","end":""},{"old":"/shopping-list-items/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['shopping_list_items.update']['types'],
  },
  'shopping_list_items.archive': {
    methods: ["PATCH"],
    pattern: '/shopping-list-items/:id/archive',
    tokens: [{"old":"/shopping-list-items/:id/archive","type":0,"val":"shopping-list-items","end":""},{"old":"/shopping-list-items/:id/archive","type":1,"val":"id","end":""},{"old":"/shopping-list-items/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['shopping_list_items.archive']['types'],
  },
  'purchases.index': {
    methods: ["GET","HEAD"],
    pattern: '/purchases',
    tokens: [{"old":"/purchases","type":0,"val":"purchases","end":""}],
    types: placeholder as Registry['purchases.index']['types'],
  },
  'purchases.store': {
    methods: ["POST"],
    pattern: '/purchases',
    tokens: [{"old":"/purchases","type":0,"val":"purchases","end":""}],
    types: placeholder as Registry['purchases.store']['types'],
  },
  'purchases.update': {
    methods: ["PUT"],
    pattern: '/purchases/:id',
    tokens: [{"old":"/purchases/:id","type":0,"val":"purchases","end":""},{"old":"/purchases/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['purchases.update']['types'],
  },
  'purchases.archive': {
    methods: ["PATCH"],
    pattern: '/purchases/:id/archive',
    tokens: [{"old":"/purchases/:id/archive","type":0,"val":"purchases","end":""},{"old":"/purchases/:id/archive","type":1,"val":"id","end":""},{"old":"/purchases/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['purchases.archive']['types'],
  },
  'purchase_items.index': {
    methods: ["GET","HEAD"],
    pattern: '/purchase-items',
    tokens: [{"old":"/purchase-items","type":0,"val":"purchase-items","end":""}],
    types: placeholder as Registry['purchase_items.index']['types'],
  },
  'purchase_items.store': {
    methods: ["POST"],
    pattern: '/purchase-items',
    tokens: [{"old":"/purchase-items","type":0,"val":"purchase-items","end":""}],
    types: placeholder as Registry['purchase_items.store']['types'],
  },
  'purchase_items.update': {
    methods: ["PUT"],
    pattern: '/purchase-items/:id',
    tokens: [{"old":"/purchase-items/:id","type":0,"val":"purchase-items","end":""},{"old":"/purchase-items/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['purchase_items.update']['types'],
  },
  'purchase_items.archive': {
    methods: ["PATCH"],
    pattern: '/purchase-items/:id/archive',
    tokens: [{"old":"/purchase-items/:id/archive","type":0,"val":"purchase-items","end":""},{"old":"/purchase-items/:id/archive","type":1,"val":"id","end":""},{"old":"/purchase-items/:id/archive","type":0,"val":"archive","end":""}],
    types: placeholder as Registry['purchase_items.archive']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
