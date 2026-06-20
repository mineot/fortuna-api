/* eslint-disable prettier/prettier */
/// <reference path="../manifest.d.ts" />

import type { ExtractBody, ExtractErrorResponse, ExtractQuery, ExtractQueryForGet, ExtractResponse } from '@tuyau/core/types'
import type { InferInput, SimpleError } from '@vinejs/vine/types'

export type ParamValue = string | number | bigint | boolean

export interface Registry {
  'home': {
    methods: ["GET","HEAD"]
    pattern: '/'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: unknown
      errorResponse: unknown
    }
  }
  'new_account.create': {
    methods: ["GET","HEAD"]
    pattern: '/signup'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['create']>>>
    }
  }
  'new_account.store': {
    methods: ["POST"]
    pattern: '/signup'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/user').signupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/user').signupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/new_account_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.create': {
    methods: ["GET","HEAD"]
    pattern: '/login'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['create']>>>
    }
  }
  'session.store': {
    methods: ["POST"]
    pattern: '/login'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/session').loginValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/session').loginValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'session.destroy': {
    methods: ["POST"]
    pattern: '/logout'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/session_controller').default['destroy']>>>
    }
  }
  'account_types.index': {
    methods: ["GET","HEAD"]
    pattern: '/account-types'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/account_types_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/account_types_controller').default['index']>>>
    }
  }
  'account_types.list': {
    methods: ["GET","HEAD"]
    pattern: '/account-types/list'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/account_types_controller').default['list']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/account_types_controller').default['list']>>>
    }
  }
  'account_types.show': {
    methods: ["GET","HEAD"]
    pattern: '/account-types/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/account_types_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/account_types_controller').default['show']>>>
    }
  }
  'account_types.store': {
    methods: ["POST"]
    pattern: '/account-types'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/account_type').createAccountTypeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/account_type').createAccountTypeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/account_types_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/account_types_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'account_types.update': {
    methods: ["PUT"]
    pattern: '/account-types/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/account_type').updateAccountTypeValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/account_type').updateAccountTypeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/account_types_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/account_types_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'account_types.archive': {
    methods: ["PATCH"]
    pattern: '/account-types/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/account_types_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/account_types_controller').default['archive']>>>
    }
  }
  'accounts.index': {
    methods: ["GET","HEAD"]
    pattern: '/accounts'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['index']>>>
    }
  }
  'accounts.store': {
    methods: ["POST"]
    pattern: '/accounts'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/account').createAccountValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/account').createAccountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'accounts.update': {
    methods: ["PUT"]
    pattern: '/accounts/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/account').updateAccountValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/account').updateAccountValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'accounts.archive': {
    methods: ["PATCH"]
    pattern: '/accounts/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/accounts_controller').default['archive']>>>
    }
  }
  'category_groups.index': {
    methods: ["GET","HEAD"]
    pattern: '/category-groups'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/category_groups_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/category_groups_controller').default['index']>>>
    }
  }
  'category_groups.store': {
    methods: ["POST"]
    pattern: '/category-groups'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/category_group').createCategoryGroupValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/category_group').createCategoryGroupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/category_groups_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/category_groups_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'category_groups.update': {
    methods: ["PUT"]
    pattern: '/category-groups/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/category_group').updateCategoryGroupValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/category_group').updateCategoryGroupValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/category_groups_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/category_groups_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'category_groups.archive': {
    methods: ["PATCH"]
    pattern: '/category-groups/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/category_groups_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/category_groups_controller').default['archive']>>>
    }
  }
  'categories.index': {
    methods: ["GET","HEAD"]
    pattern: '/categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['index']>>>
    }
  }
  'categories.store': {
    methods: ["POST"]
    pattern: '/categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/category').createCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/category').createCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'categories.update': {
    methods: ["PUT"]
    pattern: '/categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/category').updateCategoryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/category').updateCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'categories.archive': {
    methods: ["PATCH"]
    pattern: '/categories/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/categories_controller').default['archive']>>>
    }
  }
  'payees.index': {
    methods: ["GET","HEAD"]
    pattern: '/payees'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payees_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/payees_controller').default['index']>>>
    }
  }
  'payees.store': {
    methods: ["POST"]
    pattern: '/payees'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/payee').createPayeeValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/payee').createPayeeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payees_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/payees_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'payees.update': {
    methods: ["PUT"]
    pattern: '/payees/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/payee').updatePayeeValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/payee').updatePayeeValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payees_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/payees_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'payees.archive': {
    methods: ["PATCH"]
    pattern: '/payees/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/payees_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/payees_controller').default['archive']>>>
    }
  }
  'transactions.index': {
    methods: ["GET","HEAD"]
    pattern: '/transactions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['index']>>>
    }
  }
  'transactions.store': {
    methods: ["POST"]
    pattern: '/transactions'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/transaction').createTransactionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/transaction').createTransactionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'transactions.update': {
    methods: ["PUT"]
    pattern: '/transactions/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/transaction').updateTransactionValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/transaction').updateTransactionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'transactions.archive': {
    methods: ["PATCH"]
    pattern: '/transactions/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transactions_controller').default['archive']>>>
    }
  }
  'transfers.store': {
    methods: ["POST"]
    pattern: '/transfers'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/transfer').createTransferValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/transfer').createTransferValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'transfers.show': {
    methods: ["GET","HEAD"]
    pattern: '/transfers/:id'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['show']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['show']>>>
    }
  }
  'transfers.archive': {
    methods: ["PATCH"]
    pattern: '/transfers/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/transfers_controller').default['archive']>>>
    }
  }
  'recurring_transactions.index': {
    methods: ["GET","HEAD"]
    pattern: '/recurring-transactions'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/recurring_transactions_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/recurring_transactions_controller').default['index']>>>
    }
  }
  'recurring_transactions.store': {
    methods: ["POST"]
    pattern: '/recurring-transactions'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/recurring_transaction').createRecurringTransactionValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/recurring_transaction').createRecurringTransactionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/recurring_transactions_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/recurring_transactions_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'recurring_transactions.update': {
    methods: ["PUT"]
    pattern: '/recurring-transactions/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/recurring_transaction').updateRecurringTransactionValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/recurring_transaction').updateRecurringTransactionValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/recurring_transactions_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/recurring_transactions_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'recurring_transactions.archive': {
    methods: ["PATCH"]
    pattern: '/recurring-transactions/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/recurring_transactions_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/recurring_transactions_controller').default['archive']>>>
    }
  }
  'budgets.index': {
    methods: ["GET","HEAD"]
    pattern: '/budgets'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/budgets_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/budgets_controller').default['index']>>>
    }
  }
  'budgets.store': {
    methods: ["POST"]
    pattern: '/budgets'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/budget').createBudgetValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/budget').createBudgetValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/budgets_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/budgets_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'budgets.update': {
    methods: ["PUT"]
    pattern: '/budgets/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/budget').updateBudgetValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/budget').updateBudgetValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/budgets_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/budgets_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'budgets.archive': {
    methods: ["PATCH"]
    pattern: '/budgets/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/budgets_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/budgets_controller').default['archive']>>>
    }
  }
  'budget_categories.index': {
    methods: ["GET","HEAD"]
    pattern: '/budget-categories'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/budget_categories_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/budget_categories_controller').default['index']>>>
    }
  }
  'budget_categories.store': {
    methods: ["POST"]
    pattern: '/budget-categories'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/budget_category').createBudgetCategoryValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/budget_category').createBudgetCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/budget_categories_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/budget_categories_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'budget_categories.update': {
    methods: ["PUT"]
    pattern: '/budget-categories/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/budget_category').updateBudgetCategoryValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/budget_category').updateBudgetCategoryValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/budget_categories_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/budget_categories_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'budget_categories.archive': {
    methods: ["PATCH"]
    pattern: '/budget-categories/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/budget_categories_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/budget_categories_controller').default['archive']>>>
    }
  }
  'credit_cards.index': {
    methods: ["GET","HEAD"]
    pattern: '/credit-cards'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_cards_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_cards_controller').default['index']>>>
    }
  }
  'credit_cards.store': {
    methods: ["POST"]
    pattern: '/credit-cards'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/credit_card').createCreditCardValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/credit_card').createCreditCardValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_cards_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_cards_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'credit_cards.update': {
    methods: ["PUT"]
    pattern: '/credit-cards/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/credit_card').updateCreditCardValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/credit_card').updateCreditCardValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_cards_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_cards_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'credit_cards.archive': {
    methods: ["PATCH"]
    pattern: '/credit-cards/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_cards_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_cards_controller').default['archive']>>>
    }
  }
  'credit_card_invoices.index': {
    methods: ["GET","HEAD"]
    pattern: '/credit-card-invoices'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_invoices_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_invoices_controller').default['index']>>>
    }
  }
  'credit_card_invoices.store': {
    methods: ["POST"]
    pattern: '/credit-card-invoices'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/credit_card_invoice').createCreditCardInvoiceValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/credit_card_invoice').createCreditCardInvoiceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_invoices_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_invoices_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'credit_card_invoices.update': {
    methods: ["PUT"]
    pattern: '/credit-card-invoices/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/credit_card_invoice').updateCreditCardInvoiceValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/credit_card_invoice').updateCreditCardInvoiceValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_invoices_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_invoices_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'credit_card_invoices.archive': {
    methods: ["PATCH"]
    pattern: '/credit-card-invoices/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_invoices_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_invoices_controller').default['archive']>>>
    }
  }
  'credit_card_purchases.index': {
    methods: ["GET","HEAD"]
    pattern: '/credit-card-purchases'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_purchases_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_purchases_controller').default['index']>>>
    }
  }
  'credit_card_purchases.store': {
    methods: ["POST"]
    pattern: '/credit-card-purchases'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/credit_card_purchase').createCreditCardPurchaseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/credit_card_purchase').createCreditCardPurchaseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_purchases_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_purchases_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'credit_card_purchases.update': {
    methods: ["PUT"]
    pattern: '/credit-card-purchases/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/credit_card_purchase').updateCreditCardPurchaseValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/credit_card_purchase').updateCreditCardPurchaseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_purchases_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_purchases_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'credit_card_purchases.archive': {
    methods: ["PATCH"]
    pattern: '/credit-card-purchases/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_purchases_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_purchases_controller').default['archive']>>>
    }
  }
  'credit_card_installments.index': {
    methods: ["GET","HEAD"]
    pattern: '/credit-card-installments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_installments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_installments_controller').default['index']>>>
    }
  }
  'credit_card_installments.store': {
    methods: ["POST"]
    pattern: '/credit-card-installments'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/credit_card_installment').createCreditCardInstallmentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/credit_card_installment').createCreditCardInstallmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_installments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_installments_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'credit_card_installments.update': {
    methods: ["PUT"]
    pattern: '/credit-card-installments/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/credit_card_installment').updateCreditCardInstallmentValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/credit_card_installment').updateCreditCardInstallmentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_installments_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_installments_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'credit_card_installments.archive': {
    methods: ["PATCH"]
    pattern: '/credit-card-installments/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_installments_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_installments_controller').default['archive']>>>
    }
  }
  'credit_card_invoice_payments.index': {
    methods: ["GET","HEAD"]
    pattern: '/credit-card-invoice-payments'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_invoice_payments_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_invoice_payments_controller').default['index']>>>
    }
  }
  'credit_card_invoice_payments.store': {
    methods: ["POST"]
    pattern: '/credit-card-invoice-payments'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/credit_card_invoice_payment').createCreditCardInvoicePaymentValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/credit_card_invoice_payment').createCreditCardInvoicePaymentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_invoice_payments_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_invoice_payments_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'credit_card_invoice_payments.update': {
    methods: ["PUT"]
    pattern: '/credit-card-invoice-payments/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/credit_card_invoice_payment').updateCreditCardInvoicePaymentValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/credit_card_invoice_payment').updateCreditCardInvoicePaymentValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_invoice_payments_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_invoice_payments_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'credit_card_invoice_payments.archive': {
    methods: ["PATCH"]
    pattern: '/credit-card-invoice-payments/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/credit_card_invoice_payments_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/credit_card_invoice_payments_controller').default['archive']>>>
    }
  }
  'shopping_lists.index': {
    methods: ["GET","HEAD"]
    pattern: '/shopping-lists'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shopping_lists_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/shopping_lists_controller').default['index']>>>
    }
  }
  'shopping_lists.store': {
    methods: ["POST"]
    pattern: '/shopping-lists'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/shopping_list').createShoppingListValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/shopping_list').createShoppingListValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shopping_lists_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/shopping_lists_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'shopping_lists.update': {
    methods: ["PUT"]
    pattern: '/shopping-lists/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/shopping_list').updateShoppingListValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/shopping_list').updateShoppingListValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shopping_lists_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/shopping_lists_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'shopping_lists.archive': {
    methods: ["PATCH"]
    pattern: '/shopping-lists/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shopping_lists_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/shopping_lists_controller').default['archive']>>>
    }
  }
  'shopping_list_items.index': {
    methods: ["GET","HEAD"]
    pattern: '/shopping-list-items'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shopping_list_items_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/shopping_list_items_controller').default['index']>>>
    }
  }
  'shopping_list_items.store': {
    methods: ["POST"]
    pattern: '/shopping-list-items'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/shopping_list_item').createShoppingListItemValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/shopping_list_item').createShoppingListItemValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shopping_list_items_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/shopping_list_items_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'shopping_list_items.update': {
    methods: ["PUT"]
    pattern: '/shopping-list-items/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/shopping_list_item').updateShoppingListItemValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/shopping_list_item').updateShoppingListItemValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shopping_list_items_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/shopping_list_items_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'shopping_list_items.archive': {
    methods: ["PATCH"]
    pattern: '/shopping-list-items/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/shopping_list_items_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/shopping_list_items_controller').default['archive']>>>
    }
  }
  'purchases.index': {
    methods: ["GET","HEAD"]
    pattern: '/purchases'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/purchases_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/purchases_controller').default['index']>>>
    }
  }
  'purchases.store': {
    methods: ["POST"]
    pattern: '/purchases'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/purchase').createPurchaseValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/purchase').createPurchaseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/purchases_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/purchases_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'purchases.update': {
    methods: ["PUT"]
    pattern: '/purchases/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/purchase').updatePurchaseValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/purchase').updatePurchaseValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/purchases_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/purchases_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'purchases.archive': {
    methods: ["PATCH"]
    pattern: '/purchases/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/purchases_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/purchases_controller').default['archive']>>>
    }
  }
  'purchase_items.index': {
    methods: ["GET","HEAD"]
    pattern: '/purchase-items'
    types: {
      body: {}
      paramsTuple: []
      params: {}
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/purchase_items_controller').default['index']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/purchase_items_controller').default['index']>>>
    }
  }
  'purchase_items.store': {
    methods: ["POST"]
    pattern: '/purchase-items'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/purchase_item').createPurchaseItemValidator)>>
      paramsTuple: []
      params: {}
      query: ExtractQuery<InferInput<(typeof import('#validators/purchase_item').createPurchaseItemValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/purchase_items_controller').default['store']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/purchase_items_controller').default['store']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'purchase_items.update': {
    methods: ["PUT"]
    pattern: '/purchase-items/:id'
    types: {
      body: ExtractBody<InferInput<(typeof import('#validators/purchase_item').updatePurchaseItemValidator)>>
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: ExtractQuery<InferInput<(typeof import('#validators/purchase_item').updatePurchaseItemValidator)>>
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/purchase_items_controller').default['update']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/purchase_items_controller').default['update']>>> | { status: 422; response: { errors: SimpleError[] } }
    }
  }
  'purchase_items.archive': {
    methods: ["PATCH"]
    pattern: '/purchase-items/:id/archive'
    types: {
      body: {}
      paramsTuple: [ParamValue]
      params: { id: ParamValue }
      query: {}
      response: ExtractResponse<Awaited<ReturnType<import('#controllers/purchase_items_controller').default['archive']>>>
      errorResponse: ExtractErrorResponse<Awaited<ReturnType<import('#controllers/purchase_items_controller').default['archive']>>>
    }
  }
}
