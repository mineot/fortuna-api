import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'account_types.index': { paramsTuple?: []; params?: {} }
    'account_types.list': { paramsTuple?: []; params?: {} }
    'account_types.store': { paramsTuple?: []; params?: {} }
    'account_types.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'account_types.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'accounts.index': { paramsTuple?: []; params?: {} }
    'accounts.store': { paramsTuple?: []; params?: {} }
    'accounts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'accounts.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'category_groups.index': { paramsTuple?: []; params?: {} }
    'category_groups.store': { paramsTuple?: []; params?: {} }
    'category_groups.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'category_groups.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payees.index': { paramsTuple?: []; params?: {} }
    'payees.store': { paramsTuple?: []; params?: {} }
    'payees.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payees.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.index': { paramsTuple?: []; params?: {} }
    'transactions.store': { paramsTuple?: []; params?: {} }
    'transactions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transfers.store': { paramsTuple?: []; params?: {} }
    'transfers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transfers.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'recurring_transactions.index': { paramsTuple?: []; params?: {} }
    'recurring_transactions.store': { paramsTuple?: []; params?: {} }
    'recurring_transactions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'recurring_transactions.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'budgets.index': { paramsTuple?: []; params?: {} }
    'budgets.store': { paramsTuple?: []; params?: {} }
    'budgets.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'budgets.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'budget_categories.index': { paramsTuple?: []; params?: {} }
    'budget_categories.store': { paramsTuple?: []; params?: {} }
    'budget_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'budget_categories.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_cards.index': { paramsTuple?: []; params?: {} }
    'credit_cards.store': { paramsTuple?: []; params?: {} }
    'credit_cards.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_cards.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_invoices.index': { paramsTuple?: []; params?: {} }
    'credit_card_invoices.store': { paramsTuple?: []; params?: {} }
    'credit_card_invoices.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_invoices.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_purchases.index': { paramsTuple?: []; params?: {} }
    'credit_card_purchases.store': { paramsTuple?: []; params?: {} }
    'credit_card_purchases.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_purchases.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_installments.index': { paramsTuple?: []; params?: {} }
    'credit_card_installments.store': { paramsTuple?: []; params?: {} }
    'credit_card_installments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_installments.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_invoice_payments.index': { paramsTuple?: []; params?: {} }
    'credit_card_invoice_payments.store': { paramsTuple?: []; params?: {} }
    'credit_card_invoice_payments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_invoice_payments.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'shopping_lists.index': { paramsTuple?: []; params?: {} }
    'shopping_lists.store': { paramsTuple?: []; params?: {} }
    'shopping_lists.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'shopping_lists.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'shopping_list_items.index': { paramsTuple?: []; params?: {} }
    'shopping_list_items.store': { paramsTuple?: []; params?: {} }
    'shopping_list_items.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'shopping_list_items.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'purchases.index': { paramsTuple?: []; params?: {} }
    'purchases.store': { paramsTuple?: []; params?: {} }
    'purchases.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'purchases.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'purchase_items.index': { paramsTuple?: []; params?: {} }
    'purchase_items.store': { paramsTuple?: []; params?: {} }
    'purchase_items.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'purchase_items.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  GET: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'account_types.index': { paramsTuple?: []; params?: {} }
    'account_types.list': { paramsTuple?: []; params?: {} }
    'accounts.index': { paramsTuple?: []; params?: {} }
    'category_groups.index': { paramsTuple?: []; params?: {} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'payees.index': { paramsTuple?: []; params?: {} }
    'transactions.index': { paramsTuple?: []; params?: {} }
    'transfers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'recurring_transactions.index': { paramsTuple?: []; params?: {} }
    'budgets.index': { paramsTuple?: []; params?: {} }
    'budget_categories.index': { paramsTuple?: []; params?: {} }
    'credit_cards.index': { paramsTuple?: []; params?: {} }
    'credit_card_invoices.index': { paramsTuple?: []; params?: {} }
    'credit_card_purchases.index': { paramsTuple?: []; params?: {} }
    'credit_card_installments.index': { paramsTuple?: []; params?: {} }
    'credit_card_invoice_payments.index': { paramsTuple?: []; params?: {} }
    'shopping_lists.index': { paramsTuple?: []; params?: {} }
    'shopping_list_items.index': { paramsTuple?: []; params?: {} }
    'purchases.index': { paramsTuple?: []; params?: {} }
    'purchase_items.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'home': { paramsTuple?: []; params?: {} }
    'new_account.create': { paramsTuple?: []; params?: {} }
    'session.create': { paramsTuple?: []; params?: {} }
    'account_types.index': { paramsTuple?: []; params?: {} }
    'account_types.list': { paramsTuple?: []; params?: {} }
    'accounts.index': { paramsTuple?: []; params?: {} }
    'category_groups.index': { paramsTuple?: []; params?: {} }
    'categories.index': { paramsTuple?: []; params?: {} }
    'payees.index': { paramsTuple?: []; params?: {} }
    'transactions.index': { paramsTuple?: []; params?: {} }
    'transfers.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'recurring_transactions.index': { paramsTuple?: []; params?: {} }
    'budgets.index': { paramsTuple?: []; params?: {} }
    'budget_categories.index': { paramsTuple?: []; params?: {} }
    'credit_cards.index': { paramsTuple?: []; params?: {} }
    'credit_card_invoices.index': { paramsTuple?: []; params?: {} }
    'credit_card_purchases.index': { paramsTuple?: []; params?: {} }
    'credit_card_installments.index': { paramsTuple?: []; params?: {} }
    'credit_card_invoice_payments.index': { paramsTuple?: []; params?: {} }
    'shopping_lists.index': { paramsTuple?: []; params?: {} }
    'shopping_list_items.index': { paramsTuple?: []; params?: {} }
    'purchases.index': { paramsTuple?: []; params?: {} }
    'purchase_items.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'new_account.store': { paramsTuple?: []; params?: {} }
    'session.store': { paramsTuple?: []; params?: {} }
    'session.destroy': { paramsTuple?: []; params?: {} }
    'account_types.store': { paramsTuple?: []; params?: {} }
    'accounts.store': { paramsTuple?: []; params?: {} }
    'category_groups.store': { paramsTuple?: []; params?: {} }
    'categories.store': { paramsTuple?: []; params?: {} }
    'payees.store': { paramsTuple?: []; params?: {} }
    'transactions.store': { paramsTuple?: []; params?: {} }
    'transfers.store': { paramsTuple?: []; params?: {} }
    'recurring_transactions.store': { paramsTuple?: []; params?: {} }
    'budgets.store': { paramsTuple?: []; params?: {} }
    'budget_categories.store': { paramsTuple?: []; params?: {} }
    'credit_cards.store': { paramsTuple?: []; params?: {} }
    'credit_card_invoices.store': { paramsTuple?: []; params?: {} }
    'credit_card_purchases.store': { paramsTuple?: []; params?: {} }
    'credit_card_installments.store': { paramsTuple?: []; params?: {} }
    'credit_card_invoice_payments.store': { paramsTuple?: []; params?: {} }
    'shopping_lists.store': { paramsTuple?: []; params?: {} }
    'shopping_list_items.store': { paramsTuple?: []; params?: {} }
    'purchases.store': { paramsTuple?: []; params?: {} }
    'purchase_items.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'account_types.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'accounts.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'category_groups.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payees.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'recurring_transactions.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'budgets.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'budget_categories.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_cards.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_invoices.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_purchases.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_installments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_invoice_payments.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'shopping_lists.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'shopping_list_items.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'purchases.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'purchase_items.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  PATCH: {
    'account_types.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'accounts.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'category_groups.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'categories.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'payees.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transactions.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'transfers.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'recurring_transactions.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'budgets.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'budget_categories.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_cards.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_invoices.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_purchases.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_installments.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'credit_card_invoice_payments.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'shopping_lists.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'shopping_list_items.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'purchases.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'purchase_items.archive': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}