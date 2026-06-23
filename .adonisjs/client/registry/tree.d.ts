/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  home: typeof routes['home']
  newAccount: {
    create: typeof routes['new_account.create']
    store: typeof routes['new_account.store']
  }
  session: {
    create: typeof routes['session.create']
    store: typeof routes['session.store']
    destroy: typeof routes['session.destroy']
  }
  accountTypes: {
    index: typeof routes['account_types.index']
    list: typeof routes['account_types.list']
    show: typeof routes['account_types.show']
    store: typeof routes['account_types.store']
    update: typeof routes['account_types.update']
    archive: typeof routes['account_types.archive']
  }
  accounts: {
    index: typeof routes['accounts.index']
    store: typeof routes['accounts.store']
    update: typeof routes['accounts.update']
    archive: typeof routes['accounts.archive']
  }
  categoryGroups: {
    index: typeof routes['category_groups.index']
    list: typeof routes['category_groups.list']
    show: typeof routes['category_groups.show']
    store: typeof routes['category_groups.store']
    update: typeof routes['category_groups.update']
    archive: typeof routes['category_groups.archive']
  }
  categories: {
    index: typeof routes['categories.index']
    store: typeof routes['categories.store']
    update: typeof routes['categories.update']
    archive: typeof routes['categories.archive']
  }
  payees: {
    index: typeof routes['payees.index']
    store: typeof routes['payees.store']
    update: typeof routes['payees.update']
    archive: typeof routes['payees.archive']
  }
  transactions: {
    index: typeof routes['transactions.index']
    store: typeof routes['transactions.store']
    update: typeof routes['transactions.update']
    archive: typeof routes['transactions.archive']
  }
  transfers: {
    store: typeof routes['transfers.store']
    show: typeof routes['transfers.show']
    archive: typeof routes['transfers.archive']
  }
  recurringTransactions: {
    index: typeof routes['recurring_transactions.index']
    store: typeof routes['recurring_transactions.store']
    update: typeof routes['recurring_transactions.update']
    archive: typeof routes['recurring_transactions.archive']
  }
  budgets: {
    index: typeof routes['budgets.index']
    store: typeof routes['budgets.store']
    update: typeof routes['budgets.update']
    archive: typeof routes['budgets.archive']
  }
  budgetCategories: {
    index: typeof routes['budget_categories.index']
    store: typeof routes['budget_categories.store']
    update: typeof routes['budget_categories.update']
    archive: typeof routes['budget_categories.archive']
  }
  creditCards: {
    index: typeof routes['credit_cards.index']
    store: typeof routes['credit_cards.store']
    update: typeof routes['credit_cards.update']
    archive: typeof routes['credit_cards.archive']
  }
  creditCardInvoices: {
    index: typeof routes['credit_card_invoices.index']
    store: typeof routes['credit_card_invoices.store']
    update: typeof routes['credit_card_invoices.update']
    archive: typeof routes['credit_card_invoices.archive']
  }
  creditCardPurchases: {
    index: typeof routes['credit_card_purchases.index']
    store: typeof routes['credit_card_purchases.store']
    update: typeof routes['credit_card_purchases.update']
    archive: typeof routes['credit_card_purchases.archive']
  }
  creditCardInstallments: {
    index: typeof routes['credit_card_installments.index']
    store: typeof routes['credit_card_installments.store']
    update: typeof routes['credit_card_installments.update']
    archive: typeof routes['credit_card_installments.archive']
  }
  creditCardInvoicePayments: {
    index: typeof routes['credit_card_invoice_payments.index']
    store: typeof routes['credit_card_invoice_payments.store']
    update: typeof routes['credit_card_invoice_payments.update']
    archive: typeof routes['credit_card_invoice_payments.archive']
  }
  shoppingLists: {
    index: typeof routes['shopping_lists.index']
    store: typeof routes['shopping_lists.store']
    update: typeof routes['shopping_lists.update']
    archive: typeof routes['shopping_lists.archive']
  }
  shoppingListItems: {
    index: typeof routes['shopping_list_items.index']
    store: typeof routes['shopping_list_items.store']
    update: typeof routes['shopping_list_items.update']
    archive: typeof routes['shopping_list_items.archive']
  }
  purchases: {
    index: typeof routes['purchases.index']
    store: typeof routes['purchases.store']
    update: typeof routes['purchases.update']
    archive: typeof routes['purchases.archive']
  }
  purchaseItems: {
    index: typeof routes['purchase_items.index']
    store: typeof routes['purchase_items.store']
    update: typeof routes['purchase_items.update']
    archive: typeof routes['purchase_items.archive']
  }
}
